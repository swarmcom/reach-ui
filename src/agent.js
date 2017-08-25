import { EventBus } from './event_bus.js'
import WsProto from './ws-proto.js'
import Vue from 'vue'

export default class Agent extends WsProto {
  constructor () {
    super('ws://localhost:8937/ws')
    this.vm = new Vue({
      data: {
        agent_auth: undefined,
        state: undefined,
        hangup_state: undefined
      }
    }),
    EventBus.$on('agent_state', (S) => this.handleState(S.info))
  }

  getData () {
    return this.vm
  }

  onDisconnect () {
    this.handleAuth()
  }

  handleState (S) {
    this.vm.hangup_state = S.hangup_state
    this.vm.state = S.state
  }

  handleAuth (A = undefined, Cb = (A) => A) {
    this.vm.agent_auth = A
    Cb(A)
    EventBus.$emit('agent-auth', this.isAuth())
  }

  login (Login, Password, Cb = (A) => A) {
    this.call('auth', [Login, Password], (A) => this.handleAuth(A, Cb))
  }

  logout () {
    this.call('stop', [], () => this.handleAuth())
  }

  release () {
    this.call('release')
  }

  available () {
    this.call('available')
  }

  hangup () {
    this.call('hangup')
  }

  isAuth () {
    return this.vm.agent_auth !== undefined
  }
}
