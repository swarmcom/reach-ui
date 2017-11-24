<template>
<b-container>
<b-row style="margin-bottom: 10px">
  <b-col>
    <widget-agent-groups v-model="agent_groups"></widget-agent-groups>
  </b-col>
</b-row>
<b-row>
  <b-col cols=3>
    <widget-date v-model="date_start" placeholder="Start date"></widget-date>
  </b-col>
  <b-col cols=3>
    <widget-date v-model="date_end" placeholder="End date"></widget-date>
  </b-col>
  <b-col cols=2>
    <button @click="apply" class="btn btn-outline-primary">Apply</button>
    <button @click="reset" class="btn btn-outline-success float-right">Reset</button>
  </b-col>
</b-row>
</b-container>
</template>

<script>
import ReportDate from '@/Report/Widget/Date'
import AgentGroups from '@/Report/Widget/AgentGroups'

export default {
  name: 'report-query',
  props: ['value'],
  components: {
    'widget-date': ReportDate,
    'widget-agent-groups': AgentGroups
  },
  data () {
    return {
      date_start: undefined,
      date_end: undefined,
      agent_groups: []
    }
  },
  methods: {
    reset () {
      this.date_start = undefined,
      this.date_end = undefined,
      this.agent_groups = [],
      this.$emit('input', this.make_query())
    },
    apply () {
      this.$emit('input', this.make_query())
    },
    make_query() {
      return {
        date_start: this.date_start,
        date_end: this.date_end,
        agent_groups: this.agent_groups.map(group => group.id)
      }
    },
  }
}
</script>
