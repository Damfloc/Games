/**
 * Shared Network Utilities & MQTT Broker Failover for Party Games Platform
 * Provides resilient real-time networking with zero backend servers.
 */

(function(global) {
  'use strict';

  const DEFAULT_BROKERS = [
    { host: 'broker.emqx.io', port: 8084, path: '/mqtt', ssl: true, name: 'EMQX' },
    { host: 'broker.hivemq.com', port: 8884, path: '/mqtt', ssl: true, name: 'HiveMQ' }
  ];

  function generateRoomCode(len = 4) {
    return Math.random().toString(36).substring(2, 2 + len).toUpperCase();
  }

  function getRoomCodeFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('room');
      return code ? code.trim().toUpperCase() : null;
    } catch (e) {
      return null;
    }
  }

  function updateNetworkStatus(status, customText) {
    const dots = document.querySelectorAll('.network-status-dot, .network-dot');
    dots.forEach(dot => {
      dot.classList.remove('connected', 'connecting', 'disconnected');
      dot.classList.add(status);
      const title = customText || (status === 'connected' ? 'Connected (Multiplayer Online)' :
                                   status === 'connecting' ? 'Connecting to Multiplayer Broker...' :
                                   'Disconnected (Offline / Reconnecting...)');
      dot.setAttribute('title', title);
    });
  }

  class GameNetworkManager {
    constructor(options = {}) {
      this.gameName = options.gameName || 'game';
      this.clientId = options.clientId || ('usr_' + Math.random().toString(36).substring(2, 9));
      this.currentRoom = null;
      this.client = null;
      this.isConnected = false;
      this.brokerIndex = 0;
      this.reconnectTimer = null;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 10;
      this.brokers = options.brokers || DEFAULT_BROKERS;

      this.onMessage = options.onMessage || (() => {});
      this.onConnect = options.onConnect || (() => {});
      this.onDisconnect = options.onDisconnect || (() => {});
      this.onStatusChange = options.onStatusChange || updateNetworkStatus;
    }

    getTopic() {
      return `partygames/${this.gameName}/${this.currentRoom}`;
    }

    connect(roomCode) {
      if (!roomCode) return;
      this.currentRoom = roomCode.toUpperCase().trim();
      this.reconnectAttempts = 0;
      this._attemptConnect();
    }

    _attemptConnect() {
      if (typeof Paho === 'undefined' || !Paho.MQTT) {
        console.warn('Paho MQTT library not loaded. Multiplayer network unavailable.');
        this.onStatusChange('disconnected', 'MQTT library not loaded');
        return;
      }

      this.onStatusChange('connecting');

      // Cleanup prior client if any
      if (this.client) {
        try {
          this.client.onConnectionLost = null;
          this.client.onMessageArrived = null;
          this.client.disconnect();
        } catch (e) {}
        this.client = null;
      }

      const broker = this.brokers[this.brokerIndex % this.brokers.length];
      console.log(`[Network] Connecting to ${broker.name} (${broker.host}:${broker.port})...`);

      try {
        this.client = new Paho.MQTT.Client(broker.host, broker.port, broker.path, this.clientId);
        this.client.onConnectionLost = (responseObject) => this._onConnectionLost(responseObject);
        this.client.onMessageArrived = (message) => this._onMessageArrived(message);

        this.client.connect({
          useSSL: broker.ssl,
          timeout: 6,
          keepAliveInterval: 30,
          cleanSession: false,
          onSuccess: () => this._onConnectSuccess(broker),
          onFailure: (err) => this._onConnectFailure(err)
        });
      } catch (err) {
        this._onConnectFailure(err);
      }
    }

    _onConnectSuccess(broker) {
      console.log(`[Network] Connected successfully to ${broker.name}!`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.onStatusChange('connected');

      const topic = this.getTopic();
      try {
        this.client.subscribe(topic, { qos: 1 });
      } catch (e) {}

      this.onConnect({ room: this.currentRoom, broker: broker.name });
    }

    _onConnectFailure(err) {
      console.warn(`[Network] Connection failed:`, err);
      this.isConnected = false;
      this.onStatusChange('disconnected');

      // Failover to next broker
      this.brokerIndex++;
      this._scheduleReconnect();
    }

    _onConnectionLost(responseObject) {
      console.warn(`[Network] Connection lost:`, responseObject);
      this.isConnected = false;
      this.onStatusChange('disconnected');
      this.onDisconnect(responseObject);
      this._scheduleReconnect();
    }

    _scheduleReconnect() {
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn(`[Network] Max reconnection attempts reached.`);
        return;
      }

      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
      console.log(`[Network] Reconnecting in ${Math.round(delay)}ms (Attempt ${this.reconnectAttempts})...`);

      this.reconnectTimer = setTimeout(() => {
        this._attemptConnect();
      }, delay);
    }

    publish(payload) {
      if (!this.client || !this.isConnected || !this.currentRoom) return false;
      try {
        const jsonStr = JSON.stringify(payload);
        const message = new Paho.MQTT.Message(jsonStr);
        message.destinationName = this.getTopic();
        message.qos = 1;
        this.client.send(message);
        return true;
      } catch (e) {
        console.error('[Network] Publish error:', e);
        return false;
      }
    }

    disconnect() {
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      if (this.client) {
        try {
          this.client.disconnect();
        } catch (e) {}
      }
      this.isConnected = false;
      this.onStatusChange('disconnected');
    }

    _onMessageArrived(message) {
      try {
        const payload = JSON.parse(message.payloadString);
        this.onMessage(payload);
      } catch (e) {
        console.warn('[Network] Failed to parse message JSON:', e);
      }
    }
  }

  // Global exports
  global.DEFAULT_MQTT_BROKERS = DEFAULT_BROKERS;
  global.generateRoomCode = generateRoomCode;
  global.getRoomCodeFromUrl = getRoomCodeFromUrl;
  global.updateNetworkStatus = updateNetworkStatus;
  global.GameNetworkManager = GameNetworkManager;

})(typeof window !== 'undefined' ? window : this);
