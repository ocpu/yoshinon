import {IncomingMessage} from "http"
import {Socket} from "net"
declare class RequestBuilder {
    constructor(url: string)
    setHeader(name: string, value: string, condition: boolean | (() => boolean)): this
    body(body: Buffer): this
    method(method: string): this
    get(): this
    post(): this
    put(): this
    patch(): this
    delete(): this
    copy(): this
    head(): this
    options(): this
    link(): this
    unlink(): this
    purge(): this
    lock(): this
    unlock(): this
    propfind(): this
    view(): this
    send(): void
    on(event: 'abort', listener: () => void): this
    on(event: 'aborted', listener: () => void): this
    on(event: 'connect', listener: (response: IncomingMessage, socket: Socket, head: Buffer) => void): this
    on(event: 'continue', listener: () => void): this
    on(event: 'response', listener: (response: IncomingMessage) => void): this
    on(event: 'socket', listener: (socket: Socket) => void): this
    on(event: 'upgrade', listener: (response: IncomingMessage, socket: Socket, head: Buffer) => void): this
}

export = RequestBuilder