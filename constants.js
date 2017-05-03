exports.Opcodes = {
    DISPATCH: 0,                // dispatches an event
    HEARTBEAT: 1,               // used for ping checking
    IDENTIFY: 2,                // used for client handshake
    Status_UPDATE: 3,           // used to update the client status
    VOICE_STATE_UPDATE: 4,      // used to join/move/leave voice channels
    VOICE_SERVER_PING: 5,       // used for voice ping checking
    RESUME: 6,                  // used to resume a closed connection
    RECONNECT: 7,               // used to tell clients to reconnect to the gateway
    REQUEST_GUILD_MEMBERS: 8,   // used to request guild members
    INVALID_SESSION: 9,         // used to notify client they have an invalid session id
    HELLO: 10,                  // sent immediately after connecting, contains heartbeat and server debug information
    HEARTBEAT_ACK: 11           // sent immediately following a client heartbeat that was received
}
exports.Endpoints = {
    GATEWAY: '/gateway',
    BOT_GATEWAY: '/gateway/bot',
    /**
     * 
     * @param {string} id 
     * @param {(boolean|string)=} messageId 
     * @param {(boolean|string)=} emoji 
     * @param {string=} userId 
     */
    CHANNEL(id, messageId, emoji, userId) {
        return `/channels/${id}` + (messageId !== void 0 ? 
            '/messages' + ((typeof messageId === 'string') ?
                `/${messageId}` + ((emoji !== void 0) ?
                    '/reactions' + ((typeof emoji === 'string') ?
                        `/${emoji}/` + ((typeof userId === 'string') ?
                            `${userId}` : ''
                        ) : ''
                    ) : ''
                ) : ''
            ): ''
        )
    },
}
exports.Events = {
    READY: 'READY',
    GUILD_CREATE: 'GUILD_CREATE',
}
exports.Vars = {
    userAgent: 'DiscordBot (https://github/ocpu/yoshinon, 0)',
    baseUrl: '/api/v6'
}