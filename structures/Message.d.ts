import Client from "../Client"

declare class Message {

    id: string
    channel
    author
    content: string
    tts: boolean

    constructor(msg, guild, client: Client)

    static getMessage(client: Client, cid: string, uid: string): Promise<any>
}