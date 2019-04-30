<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Outbound session events</h3>
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
    <b-btn @click="$router.go(-1)">
      Back
    </b-btn>
  </div>
</template>

<script>
import Base from '@/Report/Base'

export default {
  mixins: [Base],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        ts_ms: { label: 'Time', formatter: this.tsMsFormatter },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Time', formatter: this.durationFormatter }
      },
    }
  },
  created () {
    this.safe_query(this.query_params)
  },
  methods: {
    query (params) {
      params.uuid = this.id
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'outgoing', params])
    },
  },
}
</script>
