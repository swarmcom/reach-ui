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

function guess_http () {
  return window.location.origin + "/reach"
}

function guess_rr () {
  return window.location.origin + "/rr"
}

async function session_auth(agent) {
  try {
    let SessionKey = localStorage.getItem('session-key')
    let Agent = await agent.p_mfa('ws_agent', 'auth', [SessionKey])
    agent.vm.agent = Agent
    localStorage.setItem('session-key', Agent.session_key)
    EventBus.$emit('agent-auth', agent.isAuth())
  }
  catch (error) {
  }
  agent.vm.session_auth = true
}

export default class Agent extends WsProto {

  constructor () {
    super(cfg('reach_ws', guess_ws()))
    this.vm = new Vue({
      data: {
        session_auth: false,
        agent: undefined,
        transfer_agents: [],
        state: undefined,
        hangup_state: undefined,
        auto_logout_timer: undefined,
        activity_time: undefined,
        release_id: undefined,
        previous_state: 'released',
        storage_data: {}
      }
    }),
    Notification.requestPermission()
    EventBus.$on('agent_state', (S) => this.handleState(S.state))
    EventBus.$on('agents_state', (S) => this.handleAgents(S))
  }

  getData () {
    return this.vm
  }

  get_api () {
    return cfg('reach_http', guess_http())
  }

  get_rr_uri () {
    return cfg('reach_rr', guess_rr())
  }

  onDisconnect () {
    super.onDisconnect()
    this.handleAuth()
  }

  onConnect () {
    super.onConnect()
    session_auth(this)
  }

  // MONITOR API
  subscribe (Channel) { this.mfa('ws_admin', 'subscribe', [Channel]) }
  agents (Cb = (A) => A) { this.mfa('ws_admin', 'agents', ['all'], Cb) }
  inqueues (Cb = (A) => A) { this.mfa('ws_admin', 'inqueues', ['all'], Cb) }

  // AGENT API
  logout () {
    localStorage.removeItem('session-key')
    this.call('stop', [], () => this.handleAuth())
  }
  release (Id) {
    this.call('release', [Id])
    this.vm.release_id = Id;
  }
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
      this.call('auth', [Login, Password, false], (A) => this.handleAuth(A, Cb))
      this.call('get_transfer_agents', [], (A) => this.vm.transfer_agents = A.reply)
      this.subscribe('agents')
    }
  }

  takeover (Login, Password, Cb = (A) => A) {
    if (this.isAuth()) {
      this.handleAuth(this.vm.agent)
    } else {
      this.call('auth', [Login, Password, true], (A) => this.handleAuth(A, Cb))
      this.call('get_transfer_agents', [], (A) => this.vm.transfer_agents = A.reply)
      this.subscribe('agents')
    }
  }

  handleState (S) {
    if (S && this.vm.agent && this.vm.agent.id === S.agent_id) {
      this.vm.hangup_state = S.hangup_state
      this.vm.state = S.state
      this.autoLogout(S.state)
    }
  }

  showNotification(theBody, TheIcon, theTitle) {
    let options = {
      body: theBody,
      icon: TheIcon
    }
    let n = new Notification(theTitle, options);
  }

  autoLogout(state) {
    if(this.vm.agent.autologout > 0){
      if(state === 'release'){
        if (this.vm.auto_logout_timer != 'undefined'){
          clearTimeout(this.vm.auto_logout_timer)
          this.vm.auto_logout_timer = 'undefined'
        }
        this.vm.auto_logout_timer = setTimeout (() =>  { this.logout() }, this.vm.agent.autologout*1000)
      }
      else{
        if(this.vm.auto_logout_timer != 'undefined') {
          clearTimeout(this.vm.auto_logout_timer)
          this.vm.auto_logout_timer = 'undefined'
        }
      }
    }
  }

  handleAgents ({info}) {
    if (info.state === 'available') {
      this.vm.transfer_agents.push(info.agent)
      if (this.vm.previous_state === 'release' && info.agent.login == this.vm.agent.login)
        this.vm.activity_time = new Date() - info.time
    }
    else {
      let i = this.vm.transfer_agents.findIndex(E => E.login === info.agent.login)
      if (i >= 0) {
        this.vm.transfer_agents.splice(i, 1)
      }
      if (info.state === 'release' && info.agent.login == this.vm.agent.login)
        this.vm.activity_time = new Date() - info.time
    }
    if(info.agent.login == this.vm.agent.login) {
      this.vm.previous_state = info.state
      this.vm.release_id = info.release_id
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
  is_barge () { return this.vm && this.vm.state == 'barge' }
  can_login () { return this.vm.session_auth }
  can_call () { return this.vm && this.vm.agent.line_id && this.vm.agent.line_id != "undefined"}
  can_hangup () { return this.vm && ( this.vm.state == 'oncall' || this.vm.state == 'ringing' || this.vm.state == 'conference' || this.vm.state == 'inconference' ) }
  can_conference () { return this.vm && ( this.vm.state == 'oncall' || this.vm.state == 'conference' ) }
  can_transfer () { return this.vm && ( this.vm.state == 'oncall' || this.vm.state == 'conference' ) }

  handleAuth (Re, Cb = (A) => A) {
    if (Re && Re.reply) {
      this.vm.agent = Re.reply
      localStorage.setItem('session-key', Re.reply.session_key)
    } else {
      this.vm.agent = undefined
    }
    Cb(Re)
    EventBus.$emit('agent-auth', this.isAuth())
  }

}
