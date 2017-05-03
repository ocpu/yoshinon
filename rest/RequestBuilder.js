const EventEmitter = require('events')

module.exports = class Request {
    constructor(url) {
        const { host, path, protocol, port } = require('url').parse(url)
        this._httpObj = protocol.startsWith('https') ? require('https') : require('http')
        this._opts = { host, path, port }
        this._emitter = new EventEmitter()
    }

    setHeader(name, value, condition) {
        if (typeof condition !== 'undefined') {
            if (typeof condition === 'function') {
                if (condition()) this._opts.headers = Object.assign({ [name]: value }, Object(this._opts.headers))
            }else if (condition) this._opts.headers = Object.assign({ [name]: value }, Object(this._opts.headers))
        } else this._opts.headers = Object.assign({ [name]: value }, Object(this._opts.headers))
        return this
    }

    method(method) {
        this._opts.method = method
        return this
    }

    get() {
        return this.method('GET')
    }

    post() {
        return this.method('POST')
    }

    put() {
        return this.method('PUT')
    }

    patch() {
        return this.method('PATCH')
    }

    delete() {
        return this.method('DELETE')
    }

    copy() {
        return this.method('COPY')
    }

    head() {
        return this.method('HEAD')
    }

    options() {
        return this.method('OPTIONS')
    }

    link() {
        return this.method('LINK')
    }

    unlink() {
        return this.method('UNLINK')
    }

    purge() {
        return this.method('PURGE')
    }

    lock() {
        return this.method('LOCK')
    }

    unlock() {
        return this.method('UNLOCK')
    }

    propfind() {
        return this.method('PROPFIND')
    }

    view() {
        return this.method('VIEW')
    }

    send(body) {
        const req = this._httpObj.request(this._opts)
        req.on('abort', () => this._emitter.emit('abort'))
        req.on('aborted', () => this._emitter.emit('aborted'))
        req.on('connect', (response, socket, head) => this._emitter.emit('connect', response, socket, head))
        req.on('continue', () => this._emitter.emit('continue'))
        req.on('response', (response) => this._emitter.emit('response', response))
        req.on('socket', (socket) => this._emitter.emit('socket', socket))
        req.on('upgrade', (response, socket, head) => this._emitter.emit('upgrade', response, socket, head))
        req.end(body)
    }

    on(event, listener) {
        this._emitter.on(event, listener)
        return this
    }
}