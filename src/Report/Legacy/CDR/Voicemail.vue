<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
    </div>
    <div slot="report">
      <b-table style="overflow-wrap: break-word;" small hover :items="sessions" :fields="fields" tbody-tr-class="pointer" @row-clicked="click">
      </b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import Moment from 'moment'
import Common from '@/Report/Legacy/Common'

export default {
  name: 'report-cdr-inqueue',
  mixins: [Common],
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
        client: {
          label: 'Client',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
          thStyle: { width: '83px'},
          formatter: (_v, _, item) => item.client.name
        },
        endpoint_ani: {
          label: 'Endpoint ANI',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
          thStyle: { width: '83px' }
        },
        caller_ip: {
          label: 'Caller IP',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
          thStyle: { width: '87px' }
        },
        ts_ms: {
          label: 'Offered to Reach',
          sortable: true,
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '80px' },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm:ss")
        },
        state_inqueue: {
          label: 'Inqueue',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          formatter: (_v, _, item) => this.durationFormatter(item.states.states.inqueue)
        },
        state_agent: {
          label: 'Agent/ Ringing',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          formatter: (_v, _, item) => (
            (item.direction === 'inbound') ?
              this.durationFormatter(item.states.states.agent)
            :
              this.durationFormatter(item.states.states.ringing)
          )
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
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      reportFields: {
        name: 'Voicemail',
        title: 'Voicemail',
        timeRange: '-'
      },
      sessions: []
    }
  },
  methods: {
    query: async function () {
      this.reportFields.timeRange = this.formatTimeRange(this.fromTo.date_start, this.fromTo.date_end)
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      this.sessions = await this.$agent.p_mfa('ws_report', 'cdr', ['voicemail', date_start, date_end])
    },
    reset () {
      this.sessions = []
      this.fromTo = {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      }
    },
    click ({ uuid }) {
      this.$router.push(`/report/events/voicemail/${uuid}`)
    }
  }
}
</script>
