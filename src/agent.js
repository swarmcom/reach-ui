import Vue from 'vue'
import WsProto from '@/ws-proto.js'
import {EventBus} from '@/event-bus.js'
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
    if (SessionKey) {
      let Agent = await agent.p_mfa('ws_agent', 'auth', [SessionKey])
      agent.vm.agent = Agent
      localStorage.setItem('session-key', Agent.session_key)
      EventBus.$emit('agent-auth', agent.isAuth())
    }
  }
  catch (error) {
    console.log("failed to login with session keyy", error)
  }
  agent.vm.session_auth = true
}

async function update_agent(agent) {
  agent.vm.agent = await agent.p_mfa('ws_agent', 'get', [])
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
        storage_data: {},
        layoutSM: { isActiveAM: false, isActiveQM: false, isActiveMS: true},
        isNarrowLayout: { admin: true, main: true, profile: true, monitor: true, recordings: true }
      }
    }),
    this.loadDataStorage("reach-ui")
    Notification.requestPermission()
    EventBus.$on('agent_update', () => update_agent(this))
    EventBus.$on('agent_state', (S) => this.handleState(S.state))
    EventBus.$on('agents_state', (S) => this.handleAgents(S))
  }

  loadDataStorage(name) {
    if(localStorage.getItem(name)) {
      this.vm.storage_data = JSON.parse(localStorage.getItem(name));
      if (this.vm.storage_data.narrowScreenMain != undefined)
        this.vm.isNarrowLayout.main = this.vm.storage_data.narrowScreenMain
      if (this.vm.storage_data.narrowScreenAdmin != undefined)
        this.vm.isNarrowLayout.admin = this.vm.storage_data.narrowScreenAdmin
      if (this.vm.storage_data.narrowScreenProfile != undefined)
        this.vm.isNarrowLayout.profile = this.vm.storage_data.narrowScreenProfile
      if (this.vm.storage_data.narrowScreenMonitor != undefined)
        this.vm.isNarrowLayout.monitor = this.vm.storage_data.narrowScreenMonitor
      if (this.vm.storage_data.narrowScreenRecordings != undefined)
        this.vm.isNarrowLayout.recordings = this.vm.storage_data.narrowScreenRecordings
      if (this.vm.storage_data.isActiveAM != undefined)
        this.vm.layoutSM.isActiveAM = this.vm.storage_data.isActiveAM
      if (this.vm.storage_data.isActiveMS != undefined)
        this.vm.layoutSM.isActiveMS = this.vm.storage_data.isActiveMS
    }
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

  avatar_uri (avatar) {
    return this.get_rr_uri()+'/avatar/'+avatar
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
    this.connect()
  }

  release (Id) {
    this.call('release', [Id])
    this.vm.release_id = Id;
  }
  default_release () { this.call('release', []) }
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
      this.vm.release_id = S.release_id
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
      let i = this.vm.transfer_agents.findIndex(E => E.id === info.agent.id)
      if (i < 0) {
        this.vm.transfer_agents.push(info.agent)
      }
    }
    else {
      let i = this.vm.transfer_agents.findIndex(E => E.id === info.agent.id)
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
  is_barge () { return this.vm && this.vm.state == 'barge' }
  is_conference () { return this.vm && ( this.vm.state == 'conference' || this.vm.state == 'inconference' ) }
  can_login () { return this.vm.session_auth }
  can_call () { return this.vm && this.vm.agent.line_id && this.vm.agent.line_id != "undefined"}
  can_hangup () { return this.vm && ( this.vm.state == 'hold' || this.vm.state == 'oncall' || this.vm.state == 'outgoing' || this.vm.state == 'ringing' || this.vm.state == 'conference' || this.vm.state == 'inconference' || this.vm.state == 'test') }
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
