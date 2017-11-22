<template>
<div>
  <b-row>
    <b-col><h2>Agents states man-hours</h2></b-col>
  </b-row>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <widget-date v-model="date_start" placeholder="Start date"></widget-date>
    </b-col>
    <b-col cols=3>
      <widget-date v-model="date_end" placeholder="End date"></widget-date>
    </b-col>
    <b-col>
      <widget-agent-groups v-model="groups"></widget-agent-groups>
    </b-col>
    <b-col cols=2>
      <button @click="filter" class="btn btn-outline-primary">Apply</button>
      <button @click="reset" class="btn btn-outline-success float-right">Reset</button>
    </b-col>
  </b-row>
  <widget-chart v-model="re"></widget-chart>
</div>
</template>

<script>
import Chart from '@/Report/Widget/Chart'
import ReportDate from '@/Report/Widget/Date'
import AgentGroups from '@/Report/Widget/AgentGroups'

export default {
  name: 'report-agents-states',
  components: {
    'widget-agent-groups': AgentGroups,
    'widget-date': ReportDate,
    'widget-chart': Chart
  },
  data () {
    return {
      re: {},
      date_start: undefined,
      date_end: undefined,
      groups: []
    }
  },
  methods: {
    reset () {
      this.date_start = undefined,
      this.date_end = undefined,
      this.groups = [],
      this.query()
    },
    filter () {
      this.query()
    },
    make_query() {
      return {
        date_start: this.date_start,
        date_end: this.date_end,
        groups: this.groups
      }
    },
    query: async function() {
      this.re = await this.$agent.p_mfa('ws_report', 'agents_states', [this.make_query()])
    }
  },
  created () {
    this.query()
  }
}
</script>
