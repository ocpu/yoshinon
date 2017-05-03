const Member = require('./Member')
const TextChannel = require('./TextChannel')
const VoiceChannel = require('./VoiceChannel')

module.exports = class Guild {
    constructor(id) {
        this.id = id
        this.unavailable = true
        /*this.id = guildConstruct.id
        this.name = guildConstruct.name
        this.members = guildConstruct.members.map(member => new Member(member))
        this.owner = this.members.filter(member => member.user.id === guildConstruct.owner_id)[0].user
        this.textChannels = guildConstruct.channels.filter(channel => channel.type === 0).map(channel => {
            switch (channel.type) {
                case 0:
                    return new TextChannel(channel)
                case 2:
                    return new VoiceChannel(channel)
            }
        })
        this.channels = guildConstruct.channels.map(channel => {
            switch (channel.type) {
                case 0:
                    return new TextChannel(channel)
                case 2:
                    return new VoiceChannel(channel)
            }
        })
        this.presences = []*/
    }

    get owner() {
        return this.members.filter(member => member.user.id === this._oId)[0]
    }

    get afkChannel() {
        return this.voiceChannels.filter(channel => channel.id === this._afkId)[0]
    }

    get voiceChannels() {
        return this.channels.filter(channel => channel instanceof VoiceChannel)
    }

    get textChannels() {
        return this.channels.filter(channel => channel instanceof TextChannel)
    }

    _getChannel(id) {
        return this.channels.filter(channel => channel instanceof TextChannel && channel.id === id)[0]
    }

    _getUser(id) {

    }

    _getRole(id) {

    }
}