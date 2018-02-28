<template>
<div style="margin-top: 10px" v-if="visible && !this.$agent.is_wrapup()">
  <b-row v-if="lua_result">
    <b-col>{{lua_result}}</b-col>
  </b-row>

  <b-row>
    <b-col cols="2">
      <div class="call-phone-center">
        <icon style="color:#838383" name="file-audio-o" scale="3"></icon>
      </div>
    </b-col>
    <b-col cols="5">
      <dl class="row agent-state-text">
        <dt class="col-sm-12 session-manager-text">{{this.title}}:</dt>
        <dd class="col-sm-5">Queue:</dd>
        <dd class="col-sm-7">{{ this.inqueue.queue.name }}</dd>
        <dd v-if="!this.$agent.is_ringing()" class="col-sm-5">Wait Time:</dd>
        <dd v-if="!this.$agent.is_ringing()" class="col-sm-7">{{ msToHms(this.$agent.vm.wait_time) }}</dd>
      </dl>
    </b-col>
    <b-col cols="5">
      <dl class="row agent-state-text">
        <dt class="col-sm-12 session-manager-text">Skills:</dt>
        <dd class="col-sm-12">Requested skills:</dd>
        <dd class="col-sm-12">
          <b-row>
            <b-col cols="6" offset="1">queue:</b-col>
            <b-row>
              <b-col cols="12" v-for="(v, k, index) in inqueue.queue.skills" :key="index">{{k}}</b-col>
            </b-row>
          </b-row>
          <b-row>
            <b-col cols="6" offset="1">queue group:</b-col>
            <b-row>
              <b-col cols="6" v-for="(v, k, index) in inqueue.queue.group.skills" :key="index">{{k}}</b-col>
            </b-row>
          </b-row>
          <b-row>
            <b-col cols="6" offset="1">line:</b-col>
            <b-row>
              <b-col cols="6" v-for="(v, k, index) in inqueue.line_in.skills" :key="index">{{k}}</b-col>
            </b-row>
          </b-row>
          <b-row>
            <b-col cols="6" offset="1">client:</b-col>
            <b-row>
              <b-col cols="12" v-for="(v, k, index) in inqueue.line_in.client.skills" :key="index">{{k}}</b-col>
            </b-row>
          </b-row>
        </dd>
        <dd class="col-sm-6">Matched Skills:</dd>
        <dd class="col-sm-6">
          <b-row>
            <b-col cols="12" v-for="(v, k, index) in this.inqueue.skills" :key="index">{{k}}</b-col>
          </b-row>
        </dd>
        <!-- <dt class="col-sm-6">Transferers:</dt>
        <dd class="col-sm-6">{{ this.inqueue.transferers.map( (agent) => agent.name ).join(", ") }}</dd> -->
      </dl>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="2">
      <div class="call-hand-center">
        <b-img v-if="this.inqueue.line_in.client.avatar" :src="$agent.get_rr_uri()+'/avatar/'+this.inqueue.line_in.client.avatar" style="width:64px;" />
        <icon v-else style="color:#838383" name="handshake-o" scale="4"></icon>
      </div>
    </b-col>
    <b-col cols="5">
      <dl class="row agent-state-text">
        <dt class="col-sm-12 session-manager-text">{{ this.inqueue.line_in.client.name }}</dt>
        <dd class="col-sm-12">{{ this.inqueue.call_vars["Caller-ANI"] }} </dd>
      </dl>
    </b-col>
  </b-row>
  <dialer v-if="dialer_visible" :original_caller='originalCaller' @dialer_input="onDialerInput"></dialer>
</div>
</template>

<script>
import Tags from '@/Widget/Tags'
import Common from '@/Admin/Common'
import Dialer from '@/Agent/Inqueue/VmCallbackDialer'
export default {
  components: {
    'tags': Tags,
    dialer: Dialer,
  },
  props: {
    uuid: String
  },
  mixins: [Common],
  data () {
    return {
      visible: false,
      title: 'Incoming Voicemail',
      inqueue: {},
      dialer_visible: false,
      call_info: {},
      lua_result: false,
      updater: undefined,
      notification: undefined
    }
  },
  computed: {
    originalCaller: function () {
      return this.inqueue.call_vars["Caller-ANI"]
    }
  },
  methods: {
    query: async function () {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_vm', this.uuid])
      this.call_info = await this.$agent.p_mfa('ws_agent', 'call_info', [this.uuid])
      let lua_re = await this.$agent.p_mfa('ws_agent', 'lua_result', [this.uuid, 'agent_urlpop'])
      this.handleInqueueLua(lua_re)
      this.visible = true
      this.show_notification()
    },
    queryCall: async function () {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_vm', this.uuid])
    },
    queryCallInfo: async function () {
      this.call_info = await this.$agent.p_mfa('ws_agent', 'call_info', [this.uuid])
    },
    onTimer () {
      if (this.inqueue.time) {
        this.inqueue.time += 1000
      }
    },
    onDialerInput () {
      this.visible = false
    },
    update_skills () {
      this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid, this.list2skills(this.skills)])
    },
    preHandleInqueueLua (Re) {
      this.handleInqueueLua(Re.value)
    },
    handleInqueueLua (LuaRe) {
      if (LuaRe && typeof LuaRe == 'object') {
        let [Type, Value] = LuaRe
        if (Type == "embed") {
          this.lua_result = Value
        } else if (Type == "window") {
          window.open(Value, "Reach")
        }
      }
    },
    show_notification () {
      if (!("Notification" in window)) {
        return
      } else if (Notification.permission === "granted" && this.inqueue.line_in) {
        //let body = `Number: ${this.call_info['Caller-Destination-Number']}\nClient: ${this.inqueue.line_in.client.name}\nQueue: ${this.inqueue.queue.name}`
        //this.notification = new Notification("Incoming call", { body: body })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    },
    handleState ({ state }) {
      this.inqueue.state = state.state
      if (state.state === 'conference') {
        this.queryCall()
      }
      else if (state.state === 'oncall') {
        this.title = 'Voicemail Processing'
        this.dialer_visible = true
        this.queryCallInfo()
      }
    }
  },
  created () {
    this.$bus.$on('agent_state', this.handleState)
    this.$bus.$on('inqueue_lua', this.preHandleInqueueLua)
    this.query()
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    if (this.notification) {
      this.notification.close()
    }
    this.$bus.$off('agent_state', this.handleState)
    this.$bus.$off('inqueue_lua', this.preHandleInqueueLua)
    clearInterval(this.updater)
  },
  watch: {
    'inqueue.state' (New, Old) {
      if (New == 'oncall' && this.notification) {
        this.notification.close()
      }
    }
  }
}
</script>
