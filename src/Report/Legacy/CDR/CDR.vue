<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 250px; max-width: 250px; min-width: 250px">
            Call Identification
          </td>
          <td class='table-sm table-header-group' style="width: 868px; max-width: 868px; min-width: 868px">
            Call Details
          </td>
          <td class='table-sm table-header-group' style="width: 322px; max-width: 322px; min-width: 322px">
            Timestamps
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed; overflow-wrap: break-word;" small hover :items="sessions" :fields="fields" tbody-tr-class="pointer" @row-clicked="click">
      </b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import Moment from 'moment'

export default {
  name: 'report-CDR',
  components: {
    'report': Report,
    'from-to': FromTo
  },
  data () {
    return {
      fields: {
        uuid: {
          label: 'Call ID',
          tdClass: 'table-body-green',
          thClass: 'table-header',
          thStyle: { width: '120px' }
        },
        direction: {
          label: 'Direction',
          tdClass: 'table-body-green',
          thClass: 'table-header',
          thStyle: { width: '60px' }
        },
        media_type: {
          label: 'Media Type',
          tdClass: 'table-body-green-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '70px' }
        },
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
          label: 'Called Number / Queue',
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
        ended: { label: 'Ended By', tdClass: 'table-body-orange', thClass: 'table-header', thStyle: { width: '56px' } },
        disposition: {
          label: 'Disposition',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '83px' }
        },
        agent_disposition: {
          label: 'Agent Disposition',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '83px' },
          formatter: (_v, _, item) => item.agent_disposition.name
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
          tdClass: 'table-body-orange-dark-last-in-group',
          thClass: 'table-header-last-in-group',
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
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      reportFields: {
        name: 'CDR',
        title: 'CDR',
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
      this.sessions = await this.$agent.p_mfa('ws_report', 'cdr', [date_start, date_end])
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
