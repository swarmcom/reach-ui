<template>
  <div>
    <b-row
      v-if="enabled.group_by"
      style="margin-bottom: 10px"
    >
      <b-col cols="3">
        <b-form-select
          v-model="group_by"
          :options="group_by_options"
        />
      </b-col>
    </b-row>
    <b-row
      v-if="enabled.agents"
      style="margin-bottom: 10px"
    >
      <b-col>
        <widget-agents v-model="agents" />
      </b-col>
    </b-row>
    <b-row
      v-if="enabled.agent_groups"
      style="margin-bottom: 10px"
    >
      <b-col>
        <widget-agent-groups v-model="agent_groups" />
      </b-col>
    </b-row>
    <b-row
      v-if="enabled.queues"
      style="margin-bottom: 10px"
    >
      <b-col>
        <widget-queues v-model="queues" />
      </b-col>
    </b-row>
    <b-row
      v-if="enabled.queue_groups"
      style="margin-bottom: 10px"
    >
      <b-col>
        <widget-queue-groups v-model="queue_groups" />
      </b-col>
    </b-row>
    <b-row
      v-if="enabled.clients"
      style="margin-bottom: 10px"
    >
      <b-col>
        <widget-clients v-model="clients" />
      </b-col>
    </b-row>
    <b-row
      v-if="enabled.line_ins"
      style="margin-bottom: 10px"
    >
      <b-col>
        <widget-line-ins v-model="line_ins" />
      </b-col>
    </b-row>
    <b-row
      v-if="enabled.line_outs"
      style="margin-bottom: 10px"
    >
      <b-col>
        <widget-line-outs v-model="line_outs" />
      </b-col>
    </b-row>

    <b-row>
      <b-col
        v-if="enabled.range"
        cols="2"
      >
        <widget-date
          v-model="date_start"
          placeholder="Start date"
        />
      </b-col>
      <b-col
        v-if="enabled.range"
        cols="2"
      >
        <widget-date
          v-model="date_end"
          placeholder="End date"
        />
      </b-col>
      <b-dropdown
        v-if="enabled.range"
        cols="1"
        text="Range"
      >
        <b-dropdown-item @click="select_range('today')">
          Today
        </b-dropdown-item>
        <b-dropdown-item @click="select_range('this_week')">
          This Week
        </b-dropdown-item>
        <b-dropdown-item @click="select_range('this_month')">
          This Month
        </b-dropdown-item>
        <b-dropdown-item @click="select_range('last_7')">
          Last 7 days
        </b-dropdown-item>
        <b-dropdown-item @click="select_range('last_30')">
          Last 30 days
        </b-dropdown-item>
      </b-dropdown>
      <b-col
        v-if="enabled.step"
        cols="1"
      >
        <input
          v-model="step"
          type="text"
          class="form-control"
          placeholder="step"
          value="step"
        >
      </b-col>
      <b-col
        v-if="enabled.empty_intervals"
        cols="2"
      >
        <b-form-select v-model="empty_intervals">
          <option value="true">
            true
          </option>
          <option value="false">
            false
          </option>
        </b-form-select>
      </b-col>
      <b-col
        v-if="enabled.sla"
        cols="1"
      >
        <input
          v-model="sla"
          type="text"
          class="form-control"
          placeholder="sla"
          value="sla"
        >
      </b-col>
      <b-col cols="1">
        <button
          class="btn btn-outline-primary"
          @click="apply"
        >
          Apply
        </button>
      </b-col>
      <b-col cols="1">
        <button
          class="btn btn-outline-success"
          @click="reset"
        >
          Reset
        </button>
      </b-col>
    </b-row>
    <b-modal
      v-model="showError"
      header-bg-variant="danger"
      header-text-variant="light"
      title="Parameters error"
      ok-only
    >
      {{ error }}
    </b-modal>
  </div>
</template>

<script>
import ReportDate from '@/Report/Widget/Date'
import AgentGroups from '@/Report/Widget/AgentGroups'
import Agents from '@/Report/Widget/Agents'
import Queues from '@/Report/Widget/Queues'
import QueueGroups from '@/Report/Widget/QueueGroups'
import Clients from '@/Report/Widget/Clients'
import LineIns from '@/Report/Widget/LineIns'
import LineOuts from '@/Report/Widget/LineOuts'
import moment from 'moment'

function maybe_copy_params(Dst, Src, Params) {
  Params.forEach( k => { if (Src[k]) { Dst[k] = Src[k] } })
  return Dst
}

export default {
  name: 'ReportQuery',
  components: {
    'widget-date': ReportDate,
    'widget-agents': Agents,
    'widget-agent-groups': AgentGroups,
    'widget-queues': Queues,
    'widget-queue-groups': QueueGroups,
    'widget-clients': Clients,
    'widget-line-ins': LineIns,
    'widget-line-outs': LineOuts,
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    enable: {
      type: String,
      default: ""
    },
    groupBy: {
      type: String,
      default: ""
    },
    requireRange: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      enabled: {},
      showError: false,
      error: '',
      inbound_group_by_options: [
        { value: 'client', text: 'Client' },
        { value: 'agent', text: 'Agent' },
        { value: 'agent_group', text: 'Agent Group' },
        { value: 'queue', text: 'Queue' },
        { value: 'queue_group', text: 'Queue Group' },
        { value: 'line_in', text: 'Line In' }
      ],
      outbound_group_by_options: [
        { value: 'client', text: 'Client' },
        { value: 'agent', text: 'Agent' },
        { value: 'agent_group', text: 'Agent Group' },
        { value: 'line_out', text: 'Line Out' }
      ],
      activity_group_by_options: [
        { value: 'agent', text: 'Agent' },
        { value: 'agent_group', text: 'Agent Group' },
        { value: 'client', text: 'Client' },
      ],
      productivity_group_by_options: [
        { value: 'agent', text: 'Agent' },
        { value: 'agent_group', text: 'Agent Group' },
      ],
      selected: null,
      date_start: null,
      date_end: null,
      agent_groups: [],
      agents: [],
      queue_groups: [],
      queues: [],
      clients: [],
      line_ins: [],
      line_outs: [],
      step: 60,
      sla: 10,
      empty_intervals: false,
      group_by: null
    }
  },
  watch: {
    group_by (value) {
      switch(value) {
        case 'client':
          this.make_selected('clients')
          break
        case 'agent':
          this.make_selected('agents')
          break
        case 'agent_group':
          this.make_selected('agent_groups')
          break
        case 'queue':
          this.make_selected('queues')
          break
        case 'queue_group':
          this.make_selected('queue_groups')
          break
        case 'line_in':
          this.make_selected('line_ins')
          break
        case 'line_out':
          this.make_selected('line_outs')
          break
        default:
          this.selected = null
      }
    },
  },
  created () {
    if (this.enable) {
      let enabled = this.enable.split(":")
      enabled.forEach((v) => this.enabled[v] = true)
    }
    switch (this.groupBy) {
      case "outbound":
        this.group_by_options = this.outbound_group_by_options
        break
      case "activity":
        this.group_by_options = this.activity_group_by_options
        break
      case "productivity":
        this.group_by_options = this.productivity_group_by_options
        break
      default:
        this.group_by_options = this.inbound_group_by_options
    }
    maybe_copy_params(this, this.value, [
      'group_by', 'date_start', 'date_end', 'step', 'sla',
      'agents', 'agent_groups', 'queues', 'queue_groups', 'clients', 'line_ins', 'line_outs'
    ])
  },
  methods: {
    reset () {
      this.selected = null
      this.date_start = null
      this.date_end = null
      this.agent_groups = []
      this.agents = []
      this.queue_groups = []
      this.queues = []
      this.clients = []
      this.line_ins = []
      this.line_outs = []
      this.step = 60
      this.sla = 10
      this.group_by = null
      this.$emit('reset', this.make_query())
    },
    apply () {
      if (this.validate()) {
        this.$emit('input', this.make_query())
      }
    },
    validate () {
      if (this.enabled.group_by && ! this.group_by) {
        this.show_error("Please select report group")
        return false
      }
      if (this.requireRange == "" && (! this.date_start || ! this.date_end)) {
        this.show_error("Please specify a date range")
        return false
      }
      return true
    },
    show_error (Error) {
      this.error = Error
      this.showError = true
    },
    make_query() {
      let Q = {}
      if (this.enabled.range && this.date_start) { Q.date_start = parseInt(this.date_start) }
      if (this.enabled.range && this.date_end) { Q.date_end = parseInt(this.date_end) }
      if (this.enabled.agents && this.agents.length > 0 ) { Q.agents = this.agents.map(agent => agent.id) }
      if (this.enabled.agent_groups && this.agent_groups.length > 0 ) { Q.agent_groups = this.agent_groups.map(group => group.id) }
      if (this.enabled.queues && this.queues.length > 0 ) { Q.queues = this.queues.map(queue => queue.id) }
      if (this.enabled.queue_groups && this.queue_groups.length > 0 ) { Q.queue_groups = this.queue_groups.map(group => group.id) }
      if (this.enabled.clients && this.clients.length > 0 ) { Q.clients = this.clients.map(client => client.id) }
      if (this.enabled.line_ins && this.line_ins.length > 0 ) { Q.line_ins = this.line_ins.map(line_in => line_in.id) }
      if (this.enabled.line_outs && this.line_outs.length > 0 ) { Q.line_outs = this.line_outs.map(line_out => line_out.id) }
      if (this.enabled.step && this.step > 0 ) { Q.step = parseInt(this.step) }
      if (this.enabled.sla && this.sla > 0 ) { Q.sla = parseInt(this.sla) }
      if (this.enabled.group_by && this.group_by) { Q.group_by = this.group_by }
      if (this.enabled.empty_intervals) { Q.empty_intervals = this.empty_intervals === 'true' }
      return Q
    },
    make_selected (value) {
      if (this.selected) {
        this.enabled[this.selected] = false
      }
      this.enabled[value] = true
      this.selected = value
    },
    select_range (value) {
      let now = moment()
      switch (value) {
        case "today":
          this.date_end = now.unix()
          this.date_start = now.subtract(1, 'days')
          break
        case "this_week":
          this.date_end = now.unix()
          this.date_start = now.startOf('week')
          break
        case "this_month":
          this.date_end = now.unix()
          this.date_start = now.startOf('month')
          break
        case "last_7":
          this.date_end = now.unix()
          this.date_start = now.subtract(7, 'days')
          break
        case "last_30":
          this.date_end = now.unix()
          this.date_start = now.subtract(30, 'days')
          break

        default:
          break
      }
    }
  }
}
</script>
