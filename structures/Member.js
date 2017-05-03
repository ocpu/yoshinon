const User = require('./User')

module.exports = class Member {
    constructor({ mute, deaf, nick, joined, roles, user }, guild) {
        this.mute = mute
        this.deaf = deaf
        this.nickname = nick
        this.joined = new Date(joined)
        this.user = new User(user)
        this.roles = guild.roles.filter(role => roles.includes(role.id))
        this._guild = guild
    }
}