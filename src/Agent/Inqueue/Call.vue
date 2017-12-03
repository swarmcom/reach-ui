<template>
<div style="margin-top: 10px" v-if="visible && !this.$agent.is_wrapup()">

<!--<div class="row"><div class="col session-manager-text"><b>Incoming Call:</b> </div></div>-->

<b-row v-if="lua_result">
  <b-col>{{lua_result}}</b-col>
</b-row>

<b-row>
  <b-col cols="2">
    <div class="call-phone-center"><icon style="color:#838383" name="mobile" scale="4"></icon></div>
    <div class="call-hand-center"><icon style="color:#838383" name="handshake-o" scale="4"></icon></div>
  </b-col>
  <b-col cols="10">
    <dl class="row agent-state-text">
      <dt class="col-sm-12 session-manager-text">Incoming Call:</dt>
      <dd class="col-sm-4">Queue:</dt>
      <dd class="col-sm-8">{{ this.inqueue.queue.name }}</dd>
      <dd v-if="!this.$agent.is_ringing()" class="col-sm-4">Wait Time:</dt>
      <dd v-if="!this.$agent.is_ringing()" class="col-sm-8">{{ msToHms(this.$agent.vm.wait_time) }}</dd>
      <dt class="col-sm-12 session-manager-text">Skills:</dt>
      <dd class="col-sm-4">Matched Skills:</dt>
      <dd class="col-sm-8">
        <b-row>
          <b-col cols="12" v-for="(v, k, index) in this.inqueue.skills" key="index">{{k}}</b-col>
        </b-row>
      </dd>
      <dt class="col-sm-12 session-manager-text">Customer Service:</dt>
      <dd class="col-sm-4">From:</dt>
      <dd class="col-sm-8">
        "{{ this.call_info['Caller-Caller-ID-Name'] }}" &lt;{{ this.call_info['Caller-Caller-ID-Number'] }}&gt;
      </dd>
      <dd class="col-sm-4">To:</dt>
      <dd class="col-sm-8">{{ this.call_info['Caller-Destination-Number'] }}</dd>
      <dd class="col-sm-4">Client:</dt>
      <dd class="col-sm-8">{{ this.inqueue.line_in.client.name }}</dd>
      <!--<dt class="col-sm-3">State:</dt>
      <dd class="col-sm-9">{{ this.inqueue.state }}</dd>
      <dt class="col-sm-3">Weight:</dt>
      <dd class="col-sm-9">{{ this.inqueue.effective_time.time }}</dd>-->
      <dd class="col-sm-4">Transferers:</dt>
      <dd class="col-sm-8">{{ this.inqueue.transferers.map( (agent) => agent.name ).join(", ") }}</dd>
    </dl>
  </b-col>
</b-row>
<!--<div v-if="!this.$agent.is_conference()" class="row" style="margin-top: 10px">
  <div class="col-12">
    <div class="row"><div class="col session-manager-text"><b>Skills Editor:</b> </div></div>
    <tags v-model="skills" v-on:input="update_skills()" placeholder="Call effective tags..."></tags>
  </div>
</div>-->
</div><!-- container -->
</template>

<script>
import Skills from '@/Agent/Widget/Skills'
import Tags from '@/Widget/Tags'
import Common from '@/Admin/Common'
export default {
  components: {
    'tags': Tags
  },
  props: {
    uuid: String
  },
  mixins: [Common],
  data () {
    return {
      visible: false,
      inqueue: {},
      call_info: {},
      skills: {},
      lua_result: false,
      updater: undefined,
      notification: undefined
    }
  },
  methods: {
    query: async function () {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', this.uuid])
      this.call_info = await this.$agent.p_mfa('ws_agent', 'call_info', [this.uuid])
      let lua_re = await this.$agent.p_mfa('ws_agent', 'lua_result', [this.uuid, 'agent_urlpop'])
      this.handleInqueueLua(lua_re)
      let skills = await this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid])
      this.skills = this.object2list(skills)
      this.visible = true
      this.show_notification()
    },
    onTimer() {
      if (this.inqueue.time) {
        this.inqueue.time += 1000
      }
    },
    update_skills () {
      this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid, this.list2skills(this.skills)])
    },
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      this.inqueue.keep_record = true
    },
    preHandleInqueueLua (Re) {
      this.handleInqueueLua(Re.value)
    },
    handleInqueueLua (Re) {
      if (typeof(Re) == 'object') {
        let [Type, Value] = Re
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
        let body = `Number: ${this.call_info['Caller-Destination-Number']}\nClient: ${this.inqueue.line_in.client.name}\nQueue: ${this.inqueue.queue.name}`
        this.notification = new Notification("Incoming call", {body: body})
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    },
    handleState ({state}) {
      this.inqueue.state = state.state
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
  },
}
</script>
