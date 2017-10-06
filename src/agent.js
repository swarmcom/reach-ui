import Vue from 'vue'
import WsProto from './ws-proto.js'
import {EventBus} from './event-bus.js'
import config from 'config'

function cfg(key, default_value) {
  return config[key] ? config[key] : default_value
}

function guess_ws () {
  let proto = window.location.protocol == "http:" ? "ws://" : "wss://"
  let port = window.location.port ? ":" + window.location.port : ""
  return proto + window.location.hostname + port + "/reach/ws"
}

export default class Agent extends WsProto {

  constructor () {
    super(cfg('reach_ws', guess_ws()))
    this.vm = new Vue({
      data: {
        agent: undefined,
        transfer_agents: [],
        state: undefined,
        hangup_state: undefined
      }
    }),
    EventBus.$on('agent_state', (S) => this.handleState(S.state))
    EventBus.$on('agents_state', (S) => this.handleAgents(S))
  }

  getData () {
    return this.vm
  }

  onDisconnect () {
    super.onDisconnect()
    this.handleAuth()
  }

  // MONITOR API
  subscribe (Channel) { this.mfa('ws_admin', 'subscribe', [Channel]) }
  agents (Cb = (A) => A) { this.mfa('ws_admin', 'agents', ['all'], Cb) }
  inqueues (Cb = (A) => A) { this.mfa('ws_admin', 'inqueues', ['all'], Cb) }

  // AGENT API
  logout () { this.call('stop', [], () => this.handleAuth()) }
  release (Id) { this.call('release', [Id]) }
  available () { this.call('available') }
  hangup () { this.call('hangup') }
  hold () { this.call('hold') }
  unhold () { this.call('unhold') }
  make_call (Target) { this.call('call', [Target]) }
  record (Cmd) { this.call('record', [Cmd]) }
  play (UUID) { this.call('record', ['play', UUID]) }
  end_wrapup () { this.call('end_wrapup') }

  transfer_to_agent (Agent) { this.call('transfer_to_agent', [Agent]) }
  transfer_to_queue (Queue) { this.call('transfer_to_queue', [Queue]) }
  transfer_to_uri (Uri) { this.call('transfer_to_uri', [Uri]) }
  conference_to_agent (Agent) { this.call('conference_to_agent', [Agent]) }
  conference_to_queue (Queue) { this.call('conference_to_queue', [Queue]) }
  conference_to_uri (Uri) { this.call('conference_to_uri', [Uri]) }

  login (Login, Password, Cb = (A) => A) {
    if (this.isAuth()) {
      this.handleAuth(this.vm.agent)
    } else {
      this.call('auth', [Login, Password], (A) => this.handleAuth(A, Cb))
      this.call('get_transfer_agents', [], (A) => this.vm.transfer_agents = A.reply)
      this.subscribe('agents')
    }
  }

  handleState (S) {
    if (S && this.vm.agent && this.vm.agent.id === S.agent_id) {
      this.vm.hangup_state = S.hangup_state
      this.vm.state = S.state
    }
  }

  handleAgents ({info}) {
    if (info.state === 'available') {
      this.vm.transfer_agents.push(info.agent)
    }
    else {
      let i = this.vm.transfer_agents.findIndex(E => E.login === info.agent.login)
      if (i >= 0) {
        this.vm.transfer_agents.splice(i, 1)
      }
    }
  }

  isAuth () { return this.vm.agent !== undefined }

  is_active () { return (this.vm.state !== 'release' || this.vm.state !== 'available') }
  is_idle() { return (this.vm.state == 'release' || this.vm.state == 'available') }
  is_ringing () { return this.vm && this.vm.state == 'ringing' }
  is_oncall () { return this.vm && this.vm.state == 'oncall' }
  is_wrapup () { return this.vm && this.vm.state == 'wrapup' }
  is_hold () { return this.vm && this.vm.state == 'hold' }
  is_onsession() { return this.vm && ( this.vm.state == 'oncall' || this.vm.state == 'conference' || this.vm.state == 'inconference' ) }
  can_call () { return this.vm && this.vm.agent.line_id && this.vm.agent.line_id != "undefined"}
  can_hangup () { return this.vm && ( this.vm.state == 'oncall' || this.vm.state == 'ringing' || this.vm.state == 'conference' || this.vm.state == 'inconference' ) }
  can_conference () { return this.vm && ( this.vm.state == 'oncall' || this.vm.state == 'conference' ) }
  can_transfer () { return this.vm && ( this.vm.state == 'oncall' || this.vm.state == 'conference' ) }

  handleAuth (Re, Cb = (A) => A) {
    if (Re && Re.reply) {
      this.vm.agent = Re.reply
    } else {
      this.vm.agent = undefined
    }
    Cb(Re)
    EventBus.$emit('agent-auth', this.isAuth())
  }

}
