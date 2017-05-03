const EventEmitter = require('events')
const { Events } = require('./constants')
const { Guild, User, Member, Role, TextChannel, VoiceChannel } = require('./structures')

module.exports = class DispatchHandler {
    constructor(client) {
        this.client = client
    }

    dispatch(event, data, socket) {
        const { client } = this
        switch (event) {
            case Events.READY:
                for (let { id } of data.guilds) {
                    const guild = new Guild(id)
                    client.guilds[client.guilds.length++] = guild
                }
                client.user = new User(data.user)
                break
            case Events.GUILD_CREATE:
                const guild = client.getGuild(data.id) || (client.guilds[client.guilds.length++] = new Guild(data.id))
                guild._afkId = data.afk_channel_id
                guild.joined = new Date(data.joined_at)
                guild.icon = data.icon
                guild.afkTimeout = 300
                guild.large = data.large
                guild.name = data.name
                guild.mfaLevel = data.mfa_level
                guild.roles = data.roles.map(role => new Role(role))
                guild.members = data.members.map(member => new Member(member, guild))
                guild._oId = data.owner_id
                guild.channels = data.channels.map(channel => {
                    switch (channel.type) {
                        case 0:
                            return new TextChannel(channel)
                        case 2:
                            return new VoiceChannel(channel)
                    }
                })
                break
        }
    }
}