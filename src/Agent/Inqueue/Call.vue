<template>
<div v-if="visible">

<b-row v-if="lua_result" style="margin-bottom: 20px">
  <b-col>{{lua_result}}</b-col>
</b-row>

<b-row><b-col><h2>Call info:</h2></b-col></b-row>

<b-row>
  <b-col cols=2>
    <b-button variant="outline-danger" size="sm">
      {{ this.inqueue.state }}:
      {{ Math.round(this.inqueue.time/1000) }}
    </b-button>
    <b-button variant="outline-warning" size="sm">
      {{ this.inqueue.effective_time.weight }}
    </b-button>
  </b-col>
  <b-col>
    <b-button variant="outline-dark" size="sm">
      "{{ this.call_info['Caller-Caller-ID-Name'] }}" &lt;{{ this.call_info['Caller-Caller-ID-Number'] }}&gt;
    </b-button>
    <icon name="long-arrow-right" class="align-middle" scale=1></icon>
    <b-button variant="outline-dark" size="sm">
      {{ this.call_info['Caller-Destination-Number'] }}
    </b-button>
    <icon name="long-arrow-right" class="align-middle" scale=1></icon>
    <b-button variant="outline-dark" size="sm">
      {{ this.inqueue.line_in.name }}
    </b-button>
    <icon name="long-arrow-right" class="align-middle" scale=1></icon>
    <b-button variant="outline-dark" size="sm">
      {{ this.inqueue.line_in.client.name }}
    </b-button>
    <icon name="long-arrow-right" class="align-middle" scale=1></icon>
    <b-button variant="outline-dark" size="sm">
      {{ this.inqueue.queue.name }}
    </b-button>
    <icon name="long-arrow-right" class="align-middle" scale=1></icon>
    <b-button variant="outline-dark" size="sm">
      {{ this.inqueue.agent.name }}
    </b-button>
  </b-col>
</b-row>

<b-row style="margin-top: 10px">
  <b-col>
    {{ this.inqueue.transferers.map( (agent) => agent.name ).join(", ") }}
  </b-col>
</b-row>

<b-row style="margin-top: 10px">
  <b-col>
    <tags v-model="skills" v-on:input="update_skills()" placeholder="Call effective tags..."></tags>
  </b-col>
</b-row>

<b-row style="margin-top: 20px">
  <b-col>
    <h4 v-if="this.$agent.is_oncall()">Actions:</h4>
    <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
    <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-info">Hold</button>
    <b-button v-if="this.$agent.is_oncall()" @click="record" variant="outline-danger" :disabled="inqueue.keep_record">Record</b-button>
    <disposition v-bind:uuid="this.uuid" :active="inqueue.disposition_id" v-on:input="update_disposition"></disposition>
  </b-col>

  <b-col v-if="this.$agent.can_transfer()">
    <h4>Transfer to:</h4>
    <div class="form-inline">
      <transfer-agent></transfer-agent>&nbsp;
      <transfer-queue></transfer-queue>&nbsp;
      <transfer-uri v-if="this.$agent.can_call()" class="form-control"></transfer-uri>
    </div>
  </b-col>

  <b-col v-if="this.$agent.can_conference()">
    <h4>Conference with:</h4>
    <div class="form-inline">
      <conference-agent></conference-agent>&nbsp;
      <conference-queue></conference-queue>&nbsp;
      <conference-uri v-if="this.$agent.can_call()" class="form-control"></conference-uri>
    </div>
  </b-col>
</b-row>

</div><!-- container -->
</template>

<script>
import TransferAgent from '@/Agent/Widget/TransferAgent'
import TransferQueue from '@/Agent/Widget/TransferQueue'
import TransferUri from '@/Agent/Widget/TransferUri'
import ConferenceAgent from '@/Agent/Widget/ConferenceAgent'
import ConferenceQueue from '@/Agent/Widget/ConferenceQueue'
import ConferenceUri from '@/Agent/Widget/ConferenceUri'
import Common from '@/Admin/Common'
import Disposition from '@/Agent/Widget/Disposition'
import Tags from '@/Widget/Tags'

export default {
  components: {
    'transfer-agent': TransferAgent,
    'transfer-queue': TransferQueue,
    'transfer-uri': TransferUri,
    'conference-agent': ConferenceAgent,
    'conference-queue': ConferenceQueue,
    'conference-uri': ConferenceUri,
    'tags': Tags,
    'disposition': Disposition
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
      this.skills = this.skills2list(skills)
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
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      this.inqueue.keep_record = true
    },
    end_wrapup () { this.$agent.end_wrapup() },
    transfer_to_agent (Agent) { this.$agent.transfer_to_agent(Agent) },
    transfer_to_queue (Queue) { this.$agent.transfer_to_queue(Queue) },
    transfer_to_uri (Uri) { this.$agent.transfer_to_uri(Uri) },
    conference_to_agent (Agent) { this.$agent.conference_to_agent(Agent) },
    conference_to_queue (Queue) { this.$agent.conference_to_queue(Queue) },
    conference_to_uri (Uri) { this.$agent.conference_to_uri(Uri) },
    preHandleInqueueLua (Re) {
      this.handleInqueueLua(Re.value)
    },
    handleInqueueLua (LuaRe) {
      if (LuaRe && typeof(LuaRe) == 'object') {
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
      } else if (Notification.permission === "granted" && this.call_info.line_in) {
        let body = `Number: ${this.call_info['Caller-Destination-Number']}\nClient: ${this.inqueue.line_in.client.name}\nQueue: ${this.inqueue.queue.name}`
        this.notification = new Notification("Incoming call", {body: body})
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    },
    handleState ({state}) {
      this.inqueue.state = state.state
    },
    update_disposition (id) {
      this.inqueue.disposition_id = id
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
