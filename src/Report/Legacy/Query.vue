<template>
<b-container>
  <b-row v-if="enabled.agent_groups" style="margin-bottom: 10px">
    <b-col>
      <widget-agent-groups v-model="agent_groups"></widget-agent-groups>
    </b-col>
  </b-row>
  <b-row v-if="enabled.agents" style="margin-bottom: 10px">
    <b-col>
      <widget-agents v-model="agents"></widget-agents>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols=3 v-if="enabled.range">
      <widget-date v-model="date_start" placeholder="Start date"></widget-date>
    </b-col>
    <b-col cols=3 v-if="enabled.range">
      <widget-date v-model="date_end" placeholder="End date"></widget-date>
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

export default {
  name: 'report-query',
  props: ['value', 'enable'],
  components: {
    'widget-date': ReportDate,
    'widget-agent-groups': AgentGroups,
    'widget-agents': Agents
  },
  data () {
    return {
      enabled: {},
      date_start: undefined,
      date_end: undefined,
      agent_groups: [],
      agents: []
    }
  },
  methods: {
    reset () {
      this.date_start = undefined,
      this.date_end = undefined,
      this.agent_groups = [],
      this.agents = [],
      this.$emit('input', this.make_query())
    },
    apply () {
      this.$emit('input', this.make_query())
    },
    make_query() {
      let Q = {}
      if (this.enabled.range && this.date_start) { Q.date_start = parseInt(this.date_start) }
      if (this.enabled.range && this.date_end) { Q.date_end = parseInt(this.date_end) }
      if (this.enabled.agents && this.agents.length > 0 ) { Q.agents = this.agents }
      if (this.enabled.agent_groupss && this.agent_groups > 0 ) { Q.agent_groups = this.agent_groups }
      return Q
    },
  },
  created () {
    let enabled = this.enable.split(":")
    enabled.forEach((v) => this.enabled[v] = true)
  }
}
</script>
