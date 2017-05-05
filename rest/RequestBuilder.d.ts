import {IncomingMessage} from "http"
import {Socket} from "net"
declare class RequestBuilder {
    static request(method: string, url: string): RequestBuilder
    header(name: string, value: string): this
    header(name: string, value: string, condition: boolean | (() => boolean)): this
    headers(headers: Object): this
    static get(url: string): RequestBuilder
    static post(url: string): RequestBuilder
    static put(url: string): RequestBuilder
    static patch(url: string): RequestBuilder
    static delete(url: string): RequestBuilder
    static copy(url: string): RequestBuilder
    static head(url: string): RequestBuilder
    static options(url: string): RequestBuilder
    static link(url: string): RequestBuilder
    static unlink(url: string): RequestBuilder
    static purge(url: string): RequestBuilder
    static lock(url: string): RequestBuilder
    static unlock(url: string): RequestBuilder
    static propfind(url: string): RequestBuilder
    static view(url: string): RequestBuilder
    send(body?: Buffer): Promise<Response>
}

declare class Response {

    readonly headers: Object
    readonly status: number
    readonly message: string

    buffer(): Promise<Buffer>

    text(): Promise<string>

    json(): Promise<Object>
}

export = RequestBuilder