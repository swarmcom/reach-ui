import { EventBus } from './event_bus.js'

export default class WsProto {
  constructor (Uri) {
    this.id = 1
    this.r = {}
    this.uri = Uri
    this.connect()
    setTimeout(() => this.ping(), 30000)
  }

  connect () {
    this.ws = new WebSocket(this.uri)
    this.ws.onmessage = Ev => this.onMessage(Ev)
    this.ws.onclose = Ev => this.onClose(Ev)
    this.ws.onerror = Ev => this.onError(Ev)
  }

  call (F, A = [], Cb = (A) => A) {
    this.mfa('ws_agent', F, A, Cb)
  }

  mfa (M, F, A = [], Cb = (A) => A) {
    var msg = {
      id: this.id,
      type: 'call',
      args: [M, F, A]
    }
    this.r[this.id] = Cb
    this.id++
    console.log('Cmd', msg)
    return this.ws.send(JSON.stringify(msg))
  }

  ping () {
    this.ws.send('ping') // they don't have ping support in browser O_O
    setTimeout(() => this.ping(), 30000)
  }

  onDisconnect () {
  }

  onMessage (Ev) {
    var Data = JSON.parse(Ev.data)
    var Cb = this.r[Data.id]
    if (Cb !== undefined) {
      console.log('Re', Data)
      delete this.r[Data.id]
      Cb(Data.reply)
    } else if (Data.event) {
      console.log('Ev', Data)
      EventBus.$emit(Data.event, Data)
    }
  }

  onClose (Ev) {
    console.log('WS CLOSE:', Ev)
    this.onDisconnect()
    this.ws.close()
    setTimeout( () => this.connect(), 5000 )
  }

  onError (Ev) {
    console.log('WS ERROR:', Ev)
    this.onDisconnect()
  }
}
