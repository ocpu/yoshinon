const EventEmitter = require('events')

module.exports = class RequestBuilder {
    constructor(method, url) {
        const { host, path, protocol, port } = require('url').parse(url)
        this._httpObj = protocol.startsWith('https') ? require('https') : require('http')
        this._opts = { method, host, path, port }
        this._emitter = new EventEmitter()
    }

    header(name, value, condition) {
        if (typeof condition !== 'undefined') {
            if (typeof condition === 'function') {
                if (condition()) this._opts.headers = Object.assign({ [name]: value }, Object(this._opts.headers))
            }else if (condition) this._opts.headers = Object.assign({ [name]: value }, Object(this._opts.headers))
        } else this._opts.headers = Object.assign({ [name]: value }, Object(this._opts.headers))
        return this
    }

    headers(headers) {
        this._opts.headers = Object.assign({}, headers, Object(this._opts.headers))
        return this
    }

    send(body) {
        return new Promise((resolve, reject) => {
            const req = this._httpObj.request(this._opts, res => {
                const bufs = []
                res.on('data', d => bufs.push(d))
                res.on('end', () => {
                    resolve(new Response(Buffer.concat(bufs), res.headers, res.statusCode, res.statusMessage))
                })
            })
            req.end(body)
        })
    }

    static request(method, url) { return new RequestBuilder(method, url) }

    static get(url) { return RequestBuilder.request('GET', url) }
    static post(url) { return RequestBuilder.request('POST', url) }
    static put(url) { return RequestBuilder.request('PUT', url) }
    static patch(url) { return RequestBuilder.request('PATCH', url) }
    static delete(url) { return RequestBuilder.request('DELETE', url) }
    static copy(url) { return RequestBuilder.request('COPY', url) }
    static head(url) { return RequestBuilder.request('HEAD', url) }
    static options(url) { return RequestBuilder.request('OPTIONS', url) }
    static link(url) { return RequestBuilder.request('LINK', url) }
    static unlink(url) { return RequestBuilder.request('UNLINK', url) }
    static purge(url) { return RequestBuilder.request('PURGE', url) }
    static lock(url) { return RequestBuilder.request('LOCK', url) }
    static unlock(url) { return RequestBuilder.request('UNLOCK', url) }
    static propfind(url) { return RequestBuilder.request('PROPFIND', url) }
    static view(url) { return RequestBuilder.request('VIEW', url) }
}

class Response {
    constructor(buffer, headers, status, message) {
        this._buffer = buffer
        this._headers = headers
        this._status = status
        this._message = message
    }

    get headers() { return this._headers }
    get status() { return this._status }
    get message() { return this._message }

    buffer() {
        return Promise.resolve(this._buffer)
    }

    text() {
        return Promise.resolve(this._buffer.toString())
    }

    json() {
        return this.text().then(JSON.parse)
    }
}