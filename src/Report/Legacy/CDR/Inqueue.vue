<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
    </div>
    <div slot="report">
      <b-table style="overflow-wrap: break-word;" small hover :items="sessions" :fields="fields" tbody-tr-class="pointer" @row-clicked="click"></b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import Moment from 'moment'

export default {
  name: 'report-cdr-inqueue',
  components: {
    'report': Report,
    'from-to': FromTo
  },
  data () {
    return {
      fields: {
        queue_group: {
          label: 'Queue Group',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '80px' },
          formatter: v => v.name
        },
        queue: { 
          label: 'Queue',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '90px' },
          formatter: v => v.name
        },
        calling: {
          label: 'Calling',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '90px' }
        },
        agent_login: {
          label: 'Agent Login',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '50px' },
          formatter: (_v, _, item) => item.agent.login
        },
        agent_name: {
          label: 'Agent Name',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '83px' },
          formatter: (_v, _, item) => item.agent.name
        },
        ended_by: { label: 'Ended By', tdClass: 'table-body-orange', thClass: 'table-header', thStyle: { width: '56px' } },
        disposition: {
          label: 'Disposition',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          formatter: (_v, _, item) => item.disposition.name
        },
        client: {
          label: 'Client',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
          formatter: (_v, _, item) => item.client.name
        },
        caller: {
          label: 'Caller',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
        },
        calling: {
          label: 'Calling',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
        },
        caller_ip: {
          label: 'Caller IP',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
        },
        ts_ms: {
          label: 'Time',
          sortable: true,
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm:ss")
        },
        state_inqueue: {
          label: 'Inqueue',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          formatter: (_v, _, item) => this.durationFormatter(item.states.states.inqueue)
        },
        state_agent: {
          label: 'Agent',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          formatter: (_v, _, item) => this.durationFormatter(item.states.states.agent)
        },
        state_oncall: {
          label: 'CPT',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          formatter: (_v, _, item) => this.durationFormatter(item.states.states.oncall)
        },
        state_total: {
          label: 'Total Call Duration',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          formatter: (_v, _, item) => this.durationFormatter(item.states.total)
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      reportFields: {
        name: 'Inqueue',
        title: 'Inqueue',
        from: undefined,
        to: undefined
      },
      sessions: []
    }
  },
  methods: {
    query: async function () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      this.sessions = await this.$agent.p_mfa('ws_report', 'cdr', ['inqueue', date_start, date_end])
    },
    reset () {
      this.sessions = []
      this.fromTo = {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format()
      }
    },
    click ({ uuid }) {
      this.$router.push(`/report/events/inqueue/${uuid}`)
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  }
}
</script>
