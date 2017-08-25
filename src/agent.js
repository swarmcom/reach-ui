import { EventBus } from './event_bus.js';

export default class Agent {
	constructor() {
		this.id = 1
		this.r = {}
		this.agent_auth = undefined
		this.connect()
		setTimeout( () => this.ping(), 30000)
	}

	connect() {
		this.ws = new WebSocket("ws://localhost:8937/ws")
		this.ws.onmessage = Ev => this.onMessage(Ev)
		this.ws.onclose = Ev => this.onClose(Ev)
		this.ws.onerror = Ev => this.onError(Ev)
	}

	login(Login, Password, Cb = (A) => A) {
		this.call("auth", [Login, Password], (A) => this.handleAuth(A, Cb))
	}

	logout() {
		this.call("stop", [], () => this.handleAuth())
	}

	release() {
		this.call("release")
	}

	available() {
		this.call("available")
	}

	hangup() {
		this.call("hangup")
	}

	isAuth() {
		return this.agent_auth !== undefined
	}

	handleAuth(A = undefined, Cb = (A) => A) {
		this.agent_auth = A
		Cb(A)
		EventBus.$emit('agent-auth', this.isAuth())
	}

	call(F, A = [], Cb = (A) => A) {
		var msg = {
			id: this.id,
			type: "call",
			args: [F, A]
		}
		this.r[this.id] = Cb
		this.id++
		return this.ws.send(JSON.stringify(msg))
	}

	ping() {
		this.ws.send("ping") // they don't have ping support in browser O_O
		setTimeout( () => this.ping(), 30000)
	}

	onMessage(Ev) {
		var Data = JSON.parse(Ev.data)
		console.log("IN:", Data)
		var Cb = this.r[Data.id]
		if(Cb !== undefined) {
			delete this.r[Data.id]
			Cb(Data.reply)
		} else if (Data.event) {
			EventBus.$emit(Data.event, Data)
		}
	}

	onClose(Ev) {
		console.log("CONN CLOSE:", Ev)
		this.handleAuth()
		this.connect()
	}

	onError(Ev) {
		console.log("CONN ERROR:", Ev)
		this.handleAuth()
		this.connect()
	}

}
