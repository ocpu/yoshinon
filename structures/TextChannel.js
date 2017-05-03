module.exports = class TextChannel {
    constructor(ch, guild) {
        this._$ = ch
        this._guild = guild
    }

    get id() {
        return this._$.id
    }

    get name() {
        return this._$.name
    }

    get position() {
        return this._$.position
    }

    get lastMessage() {
        return this.this._$.user_limit
    }

    get userLimit() {
        return this._$.user_limit
    }
}