/* @flow */

const { request } = require('https')
const { Vars } = require('../constants')
const RequestBuilder = require('./RequestBuilder')

module.exports = class RequestHandler {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this._client = client
    }

    /**
     * 
     * @param {string} method 
     * @param {string} url
     * @param {Object} body 
     */
    request(method, url, body) {
        return new Promise((resolve, reject) => {
            if (body && method === 'GET') {
                url += '?' + Object.keys(body).map(key => ({ key, value: body[key] }))
                    .reduce((qs, { key, value }) => Array.isArray(value) ?
                        value.reduce((total, item) => `&${encodeURIComponent(key)}=${encodeURIComponent(item)}`) :
                        `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`, '').substring(1)
                body = void 0
            }
            RequestBuilder.request(method, 'https://discordapp.com/api/v6' + url)
                .headers({
                    'User-Agent': Vars.userAgent,
                    'Authorization': (this._client.bot ? 'Bot ' : '') + this._client.token
                })
                .header('Content-Type', 'application/json', !!body)
                .send(body)
                .then(res => {
                    switch (res.status) {
                        case 400:
                            throw new Error('The request was improperly formatted, or the server couldn\'t understand it')
                        case 401:
                            throw new Error('The token provided is invalid or missing')
                        case 403:
                            throw new Error('The user with that token do not have permission to that resource')
                        case 404:
                            throw new Error('The resource at the location specified doesn\'t exist')
                        case 405:
                            throw new Error('The HTTP method used is not valid for the location specified')
                        case 429:
                            this.rateLimiting()
                            break
                        case 502:
                            //throw new Error('There was not a gateway available to process your request. Wait a bit and retry')
                            console.log(1)
                            resolve(new Promise(resolve => setTimeout(resolve, 2000)).then(() => this.request(method, url, body)))
                            return
                    }
                    resolve(res.json())
                })
        })
    }
}