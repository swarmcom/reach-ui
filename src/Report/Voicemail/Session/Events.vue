<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Voicemail events</h3>
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
  mixins: [Base],
  props: {
    uuid: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        ts_start_ms: { label: 'Time', formatter: this.tsMsFormatter },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Time', formatter: this.durationFormatter },
        queue: { label: 'Queue', formatter: this.nameFormatter },
        agent: { label: 'Agent', formatter: this.nameFormatter}
      },
      events: []
    }
  },
  created () {
    this.safe_query(this.query_params)
  },
  methods: {
    query (params) {
      params.uuid = this.uuid
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'voicemail', params])
    },
  },
}
</script>
