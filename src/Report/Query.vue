<template>
<div>
  <b-row v-if="enabled.group_by" style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="group_by" :options="group_by_options" @change="change_group_by"/>
    </b-col>
  </b-row>
  <b-row v-if="enabled.agents" style="margin-bottom: 10px">
    <b-col>
      <widget-agents v-model="agents"></widget-agents>
    </b-col>
  </b-row>
  <b-row v-if="enabled.agent_groups" style="margin-bottom: 10px">
    <b-col>
      <widget-agent-groups v-model="agent_groups"></widget-agent-groups>
    </b-col>
  </b-row>
  <b-row v-if="enabled.queues" style="margin-bottom: 10px">
    <b-col>
      <widget-queues v-model="queues"></widget-queues>
    </b-col>
  </b-row>
  <b-row v-if="enabled.queue_groups" style="margin-bottom: 10px">
    <b-col>
      <widget-queue-groups v-model="queue_groups"></widget-queue-groups>
    </b-col>
  </b-row>
  <b-row v-if="enabled.clients" style="margin-bottom: 10px">
    <b-col>
      <widget-clients v-model="clients"></widget-clients>
    </b-col>
  </b-row>
  <b-row v-if="enabled.line_ins" style="margin-bottom: 10px">
    <b-col>
      <widget-line-ins v-model="line_ins"></widget-line-ins>
    </b-col>
  </b-row>
  <b-row v-if="enabled.line_outs" style="margin-bottom: 10px">
    <b-col>
      <widget-line-outs v-model="line_outs"></widget-line-outs>
    </b-col>
  </b-row>

  <b-row>
    <b-col cols=3 v-if="enabled.range">
      <widget-date v-model="date_start" placeholder="Start date"></widget-date>
    </b-col>
    <b-col cols=3 v-if="enabled.range">
      <widget-date v-model="date_end" placeholder="End date"></widget-date>
    </b-col>
    <b-col cols=1 v-if="enabled.step">
      <input type="text" class="form-control" v-model="step" placeholder="step" value="step">
    </b-col>
    <b-col cols=1 v-if="enabled.sla">
      <input type="text" class="form-control" v-model="sla" placeholder="sla" value="sla">
    </b-col>
    <b-col cols=1>
      <button @click="apply" class="btn btn-outline-primary">Apply</button>
    </b-col>
    <b-col cols=1>
      <button @click="reset" class="btn btn-outline-success">Reset</button>
    </b-col>
  </b-row>
  <b-modal header-bg-variant="danger" header-text-variant="light" title="Parameters error" ok-only v-model="showError">{{ error }}</b-modal>
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

function maybe_copy_params(Dst, Src, Params) {
  Params.forEach( k => { if (Src[k]) { Dst[k] = Src[k] } })
  return Dst
}

export default {
  name: 'report-query',
  props: ['value', 'enable', 'group-by', 'require-range'],
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
      group_by: null
    }
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
      this.$emit('input', this.make_query())
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
      if (this.requireRange && (! this.date_start || ! this.date_end)) {
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
      if (this.enabled.agent_groupss && this.agent_groups > 0 ) { Q.agent_groups = this.agent_groups.map(group => group.id) }
      if (this.enabled.queues && this.queues.length > 0 ) { Q.queues = this.queues.map(queue => queue.id) }
      if (this.enabled.queue_groupss && this.queue_groups > 0 ) { Q.queue_groups = this.queue_groups.map(group => group.id) }
      if (this.enabled.clients && this.clients.length > 0 ) { Q.clients = this.clients.map(client => client.id) }
      if (this.enabled.line_ins && this.line_ins.length > 0 ) { Q.line_ins = this.line_ins.map(line_in => line_in.id) }
      if (this.enabled.line_outs && this.line_outs.length > 0 ) { Q.line_outs = this.line_outs.map(line_out => line_out.id) }
      if (this.enabled.step && this.step > 0 ) { Q.step = parseInt(this.step) }
      if (this.enabled.sla && this.sla > 0 ) { Q.sla = parseInt(this.sla) }
      if (this.enabled.group_by && this.group_by) { Q.group_by = this.group_by }
      return Q
    },
    change_group_by (value) {
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
    make_selected (value) {
      if (this.selected) {
        this.enabled[this.selected] = false
      }
      this.enabled[value] = true
      this.selected = value
    }
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
    if (this.requireRange == "") {
      this.requireRange = true
    }
    maybe_copy_params(this, this.value, ['date_start', 'date_end', 'step', 'sla'])
  }
}
</script>
