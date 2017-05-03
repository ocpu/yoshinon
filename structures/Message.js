const { request } = require('../rest/RequestHandler')
const { Endpoints } = require('../constants')

module.exports = class Message {
    constructor(msg, guild, client) {
        this._C = client
        this._$ = msg
        this.id = msg.id
        this.channel = guild._getChannel(msg.channel_id)
        this.author = guild._getUser(msg.author)
        this.content = msg.content
        this.tts = msg.tts
    }

    static getMessage(client, cid, mid) {
        return client.requestHandler.request('GET', Endpoints.CHANNEL(cid, mid))
    }
}