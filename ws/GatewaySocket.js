const { Opcodes, Events } = require('../constants')
const WebSocket = require('ws')
const Guild = require('../structures/Guild')

module.exports = class GatewaySocket {
    constructor(client) {
        this.client = client
        this.sequence = null
        this.closed = false
        this.gotHeartbeatACK = true
        this.sessionId = ''

        this.connect = this.connect.bind(this)
    }
    
    connect(gatewayData) {
        if (this.client.bot) {
            if (this.client.numShards) {
                if (this.client.numShards < gatewayData.shards)
                    console.warn(`The specified shard amount (${this.client.numShards}) is below the recommended shard amount (${gatewayData.shards})`)
            } else this.client.numShards = gatewayData.shards
        }
        const socket = this.socket = new WebSocket(`${gatewayData.url}?v=6&encoding=json`)
        socket.on('message', message => {
            const { t: event, s: sequence, op: opcode, d: data} = JSON.parse(message)
            switch (opcode) {
                case Opcodes.DISPATCH:
                    this.client.emit('debug', { type: 'Socket', args: [`Recived '${event}' event`, data] })
                    this.sequence = sequence
                    this.client.dh.dispatch(event, data, this)
                    /*switch (event) {
                        case Events.READY:
                            this.sessionId = data.session_id
                            break
                        case Events.GUILD_CREATE:
                            const guild = new Guild(data)
                    }*/
                    break
                case Opcodes.HELLO:
                    this.heartbeat()
                    this.heartbeatInterval = setInterval(this.heartbeat.bind(this), data.heartbeat_interval)
                    this.resumeOrIdentiy()
                    break
                case Opcodes.INVALID_SESSION:
                    this.client.emit('debug', { type: 'Socket', args: ['Recived invalid session', !data && this.client._autoReconnect ? 'now reconnecting...' : ''] })
                    if (!data && this.client._autoReconnect) {
                        let time = Math.random() * 5000
                        if (time < 1000) time = 1000
                        setTimeout(this.identify, time)
                    }
                case Opcodes.HEARTBEAT_ACK:
                    this.client.emit('debug', { type: 'Socket', args: ['Recived heartbeat ACK'] })
                    this.gotHeartbeatACK = true
            }
        })
        socket.on('close', (code, message) => {
            this.closed = true
            this.client.emit('debug', { type: 'Socket', args: ['Closing', { code, message }]})
        })
        socket.on('error', error => {
            this.client.emit('debug', { type: 'Socket', level: 'error', args: [error]})
        })
    }

    send(op, data = null) {
        const payload = { op, d: data}
        this.socket.send(JSON.stringify(payload))
    }

    heartbeat() {
        if (this.closed) return clearInterval(this.heartbeatInterval)
        if (!this.gotHeartbeatACK) {
            this.reconnect = true
            this.socket.close()
            return clearInterval(this.heartbeatInterval)
        }
        this.client.emit('debug', { type: 'Socket', args: ['Sending heartbeat'] })        
        this.send(Opcodes.HEARTBEAT, this.sequence)
        this.gotHeartbeatACK = false
    }

    resumeOrIdentiy() {
        if (this.sessionId)
            this.resume()
        else
            this.identify()
    }

    resume() {
        this.send(Opcodes.RESUME, {
            token: this.client.token,
            session_id: this.sessionId,
            seq: this.sequence
        })
    }

    identify() {
        this.client.emit('debug', { type: 'Socket', args: ['Sending identity'] })
        this.send(Opcodes.IDENTIFY, {
            token: this.client.token,
            compress: this.client.compress,
            properties: {
                $os: process.platform,
                $browser: 'Yoshinon',
                $device: 'Yoshinon'
            },
            large_threshold: 250,
            shard: [this.client._shardId, this.client._numShards]
        })
    }
}