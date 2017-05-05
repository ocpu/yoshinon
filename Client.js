// https://discordapi.com/permissions.html#3072

const RequestHandler = require('./rest/RequestHandler')
const { Opcodes, Endpoints, Events } = require('./constants')
const WebSocket = require('ws')
const EventEmitter = require('events')
const GatewaySocket = require('./ws/GatewaySocket')
const DispatchHandler = require('./DispatchHandler')
const leftPad = require('left-pad')
const Message = require('./structures/Message')

class Client extends EventEmitter {
    /**
     * 
     * @param {string} token
     * @param {Object} options
     * @param {boolean} options.compress
     * @param {number} options.shardId
     * @param {number} options.numShards
     */
    constructor(token, options = {}) {
        super()
        this.token = token
        this.bot = true
        this._autoReconnect = options.autoReconnect || true
        this._compress = options.compress
        this._shardId = options.shardId || 0
        this._numShards = options.shardId || this._shardId + 1
        this.dh = new DispatchHandler(this)
        this.requestHandler = new RequestHandler(this)
        this.gs = new GatewaySocket(this)
        this.guilds = []
        this.setupEvents()
    }

    getGuild(id) {
        return this.guilds.filter(guild => guild.id === id)[0]
    }

    setupEvents() {
        this.on(Events.READY, data => {

        })
    }

    getGateway() {
        return this.requestHandler.request('GET', Endpoints.GATEWAY)
    }

    getBotGateway() {
        return this.requestHandler.request('GET', Endpoints.BOT_GATEWAY)
    }

    connect() {
        const promise = this.bot ? this.getBotGateway() : this.getGateway()
        promise.then(gateway => {
            if (this.bot) {
                if (this.numShards) {
                    if (this.numShards < gateway.shards)
                        console.warn(`The specified shard amount (${this.numShards}) is below the recommended shard amount (${gateway.shards})`)
                } else this.numShards = gateway.shards
            }
            this.gs = new WebSocket(`${gateway.url}?v=6&encoding=json`)
        })
    }

    setupUserInfo(user) {
        /*this.requestHandler.request('GET', '/users/' + user.id, true).then((reqUser) => {
            console.log(user, reqUser)
        })*/
        this.user = new AuthenticatedUser(user)
        this.emit(Events.READY, this.user)
    }
}
const client = global.client = new Client(process.env.token)

client.on('debug', ({ type, level = 'info', args = [] }) => {
    const date = new Date(Date.now() + new Date(Date.now()).getTimezoneOffset())
    console.log(`${date.getFullYear()}-${leftPad(date.getMonth(), 2, 0)}-${leftPad(date.getDate(), 2, 0)}`,
        `${date.getHours()}:${leftPad(date.getMinutes(), 2, 0)}:${leftPad(date.getSeconds(), 2, 0)}`,
        `[${type}/${level.toUpperCase()}]:`, ...args)
})

function debug(type, level, ...args) {
    const date = new Date(Date.now() + new Date(Date.now()).getTimezoneOffset())
    console.log(`${date.getFullYear()}-${leftPad(date.getMonth(), 2, 0)}-${leftPad(date.getDate(), 2, 0)}`,
        `${date.getHours()}:${leftPad(date.getMinutes(), 2, 0)}:${leftPad(date.getSeconds(), 2, 0)}`,
        `[${type}/${level.toUpperCase()}]:`, ...args)
}

//client.requestHandler.request('GET', "/users/@me/channels", true).then(console.log, console.error)

// Message.getMessage(client, '250656960246972427', '308583487315640322').then(console.log)

client.connect()