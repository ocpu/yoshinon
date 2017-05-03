import  EventEmitter from 'events'

declare module "yoshinon" {
    namespace rest {
        class RequestHandler {
            
        }
    }
    namespace ws {
        class GatewaySocket {

        }
        class VoiceSocket {

        }
    }
    type GatewayResponse = { url: string }
    type BotGatewayResponse = { url: string, shards: number }
    /**
     * @event debug
     */
    class Client extends EventEmitter {
        constructor(token: string, options?: {
            compress?: boolean
            shardId?: number
            numShard?: number
            autoReconnect?: boolean
        })
        guilds: Guild[]
        token: string
        bot: boolean
        requestHandler: rest.RequestHandler
        gs: ws.GatewaySocket

        getGateway(): Promise<GatewayResponse>
        getBotGateway(): Promise<BotGatewayResponse>
        connect(): void
    }
    export = Client
}