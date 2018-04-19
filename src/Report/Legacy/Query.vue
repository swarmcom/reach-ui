<template>
<b-container>
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
</b-container>
</template>

<script>
import ReportDate from '@/Report/Widget/Date'
import AgentGroups from '@/Report/Widget/AgentGroups'
import Agents from '@/Report/Widget/Agents'
import Queues from '@/Report/Widget/Queues'
import QueueGroups from '@/Report/Widget/QueueGroups'
import Clients from '@/Report/Widget/Clients'

export default {
  name: 'report-query',
  props: ['value', 'enable'],
  components: {
    'widget-date': ReportDate,
    'widget-agent-groups': AgentGroups,
    'widget-agents': Agents,
    'widget-queue-groups': QueueGroups,
    'widget-queues': Queues,
    'widget-clients': Clients
  },
  data () {
    return {
      enabled: {},
      date_start: undefined,
      date_end: undefined,
      agent_groups: [],
      agents: [],
      queue_groups: [],
      queues: [],
      clients: [],
      step: 60,
      sla: 10
    }
  },
  methods: {
    reset () {
      this.date_start = undefined,
      this.date_end = undefined,
      this.agent_groups = [],
      this.agents = [],
      this.queue_groups = [],
      this.queues = [],
      this.clients = [],
      this.step = 60
      this.sla = 10
      this.$emit('input', this.make_query())
    },
    apply () {
      this.$emit('input', this.make_query())
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
      if (this.enabled.step && this.step > 0 ) { Q.step = parseInt(this.step) }
      if (this.enabled.sla && this.sla > 0 ) { Q.sla = parseInt(this.sla) }
      return Q
    },
  },
  created () {
    let enabled = this.enable.split(":")
    enabled.forEach((v) => this.enabled[v] = true)
  }
}
</script>
