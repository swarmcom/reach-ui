<template>
<b-container>
  <b-row style="margin-bottom: 10px">
    <b-col>
      <widget-agent-groups v-model="agent_groups"></widget-agent-groups>
    </b-col>
  </b-row>
  <b-row style="margin-bottom: 10px">
    <b-col>
      <widget-agents v-model="agents"></widget-agents>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols=3>
      <widget-date v-model="date_start" placeholder="Start date"></widget-date>
    </b-col>
    <b-col cols=3>
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
  props: ['value'],
  components: {
    'widget-date': ReportDate,
    'widget-agent-groups': AgentGroups,
    'widget-agents': Agents
  },
  data () {
    return {
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
      return {
        date_start: this.date_start,
        date_end: this.date_end,
        agent_groups: this.agent_groups.map(group => group.id),
        agents: this.agents.map(agent => agent.id)
      }
    },
  }
}
</script>
