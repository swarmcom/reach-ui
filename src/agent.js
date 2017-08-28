import Vue from 'vue'
import WsProto from './ws-proto.js'
import {EventBus} from './event-bus.js'
import sys_config from './config.js'

function config(key, default_value) {
  return sys_config[key] ? sys_config[key] : default_value
}

export default class Agent extends WsProto {

  constructor () {
    super(config('reach_ws', 'ws://localhost:8937/ws'))
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

  // MONITOR API
  subscribe (Channel) { this.mfa('ws_admin', 'subscribe', [Channel]) }
  agents (Cb = (A) => A) { this.mfa('ws_admin', 'agents', ['all'], Cb) }
  inqueues (Cb = (A) => A) { this.mfa('ws_admin', 'inqueues', ['all'], Cb) }

  // CRUD API
  get_agents (Cb = (A) => A) { this.mfa('ws_admin', 'get_agents', [], Cb) }
  get_agent (Id, Cb = (A) => A) { this.mfa('ws_admin', 'get_agent', [Id], Cb) }
  update_agent (Obj, Cb = (A) => A) { this.mfa('ws_admin', 'update_agent', [Obj], Cb)  }
  delete_agent (Id, Cb = (A) => A) { this.mfa('ws_admin', 'delete_agent', [Id], Cb) }

  get_queues (Cb = (A) => A) { this.mfa('ws_admin', 'get_queues', [], Cb) }
  get_queue (Id, Cb = (A) => A) { this.mfa('ws_admin', 'get_queue', [Id], Cb) }
  update_queue (Obj, Cb = (A) => A) { this.mfa('ws_admin', 'update_queue', [Obj], Cb) }
  delete_queue (Id, Cb = (A) => A) { this.mfa('ws_admin', 'delete_queue', [Id], Cb) }

  get_profiles (Cb = (A) => A) { this.mfa('ws_admin', 'get_profiles', [], Cb) }
  get_profile (Id, Cb = (A) => A) { this.mfa('ws_admin', 'get_profile', [Id], Cb) }
  update_profile (Obj, Cb = (A) => A) { this.mfa('ws_admin', 'update_profile', [Obj], Cb) }
  delete_profile (Id, Cb = (A) => A) { this.mfa('ws_admin', 'delete_profile', [Id], Cb) }

  get_groups (Cb = (A) => A) { this.mfa('ws_admin', 'get_groups', [], Cb) }
  get_group (Id, Cb = (A) => A) { this.mfa('ws_admin', 'get_group', [Id], Cb) }
  update_group (Obj, Cb = (A) => A) { this.mfa('ws_admin', 'update_group', [Obj], Cb) }
  delete_group (Id, Cb = (A) => A) { this.mfa('ws_admin', 'delete_group', [Id], Cb) }

  // AGENT API
  logout () { this.call('stop', [], () => this.handleAuth()) }
  release () { this.call('release')  }
  available () { this.call('available') }
  hangup () { this.call('hangup') }

  isAuth () { return this.vm.agent_auth !== undefined }

  login (Login, Password, Cb = (A) => A) {
    if (this.isAuth()) {
      this.handleAuth(this.vm.agent_auth)
    } else {
      this.call('auth', [Login, Password], (A) => this.handleAuth(A, Cb))
    }
  }

  handleState (S) {
    if (S && this.vm.agent_auth && this.vm.agent_auth.login === S.login) {
      this.vm.hangup_state = S.hangup_state
      this.vm.state = S.state
    }
  }

  handleAuth (AuthInfo = undefined, Cb = (A) => A) {
    this.vm.agent_auth = AuthInfo
    Cb(AuthInfo)
    EventBus.$emit('agent_auth', this.isAuth())
  }

}
