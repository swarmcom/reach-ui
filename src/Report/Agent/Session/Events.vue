<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Agent session events</h3>
      </div>
    </div>
    <b-table
      style="margin-top:10px"
      small
      striped
      hover
      :items="data"
      :fields="fields"
    />
  </div>
</template>

<script>
import Base from '@/Report/Base'
export default {
  name: 'ReportEventsAgent',
  mixins: [Base],
  props: {
    uuid: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      data: [],
      fields: {
        ts_ms: { label: 'Time', sortable: true, formatter: this.tsFormatter },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Duration', formatter: this.durationFormatter }
      }
    }
  },
  created () {
    this.safe_query()
  },
  methods: {
    query () {
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'agent', { uuid: this.uuid }])
    },
  },
}
</script>
