module.exports = class Role {
    constructor(roleData) {
        this.color = roleData.color
        this.hoist = roleData.hoist
        this.id = roleData.id
        this.managed = roleData.managed
        this.mentionable = roleData.mentionable
        this.name = roleData.name
        this.permissions = roleData.permissions
        this.position = roleData.position
    }
}