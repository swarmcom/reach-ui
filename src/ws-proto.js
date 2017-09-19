import {EventBus} from './event-bus.js'

function handleReply (Re, resolve, reject) {
  if (Re && Re.reply) {
    resolve(Re.reply)
  } else {
    reject(Re.error)
  }
} 

export default class WsProto {

  constructor (Uri) {
    this.id = 1
    this.r = {}
    this.uri = Uri
    this.connect()
    setTimeout(() => this.ping(), 30000)
  }

  connect () {
    console.log("connect:", this.uri)
    this.ws = new WebSocket(this.uri)
    this.ws.onmessage = Ev => this.onMessage(Ev)
    this.ws.onclose = Ev => this.onClose(Ev)
    this.ws.onerror = Ev => this.onError(Ev)
  }

  call (F, A = [], Cb = (A) => A) {
    return this.mfa('ws_agent', F, A, Cb)
  }

  p_call (F, A = []) {
    return this.p_mfa('ws_agent', F, A)
  }

  p_mfa (M, F, A = []) {
    return new Promise((resolve, reject) => {
      this.mfa(M, F, A, (Re) => handleReply(Re, resolve, reject))
    })
  }

  mfa (M, F, A = [], Cb = (A) => A) {
    var msg = {
      id: this.id,
      type: 'call',
      args: [M, F, A]
    }
    if (this.ws.readyState === 1) {
      this.r[this.id] = Cb
      this.id++
      console.log('Cmd', msg)
      return this.ws.send(JSON.stringify(msg))
    } else {
      console.log("wrong websocket state", this.ws.readyState)
      Cb({ error: 'wrong websocket state'})
    }
  }

  ping () {
    this.ws.send('ping') // they don't have ping support in browser O_O
    setTimeout(() => this.ping(), 3000)
  }

  onDisconnect () {
    for (var id in this.r) {
      var Cb = this.r[id]
      if (Cb) {
        Cb({ error: "websocket disconnect" })
      }
      delete this.r[id]
    }
  }

  onMessage (Ev) {
    var Data = JSON.parse(Ev.data)
    var Cb = this.r[Data.id]
    if (Cb !== undefined) {
      console.log('Re', Data)
      delete this.r[Data.id]
      Cb(Data)
    } else if (Data.event) {
      console.log('Ev', Data.event, Data)
      EventBus.$emit(Data.event, Data)
    }
  }

  onClose (Ev) {
    console.log('WS CLOSE:', Ev)
    this.onDisconnect()
    this.ws.close()
    setTimeout( () => this.connect(), 2000 )
  }

  onError (Ev) {
    console.log('WS ERROR:', Ev)
    this.onDisconnect()
  }
}
