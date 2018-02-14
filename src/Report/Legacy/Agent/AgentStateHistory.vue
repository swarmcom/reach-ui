<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 521px; max-width: 521px; min-width: 521px">
            Agent Events
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields">
      </b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import Moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

export default {
  name: 'AgentStateHistory',
  components: {
    'report': Report,
    'from-to': FromTo
  },
  data () {
    return {
      fields: {
        state_from: {
          label: 'State Entered',
          tdClass: 'table-body-orange-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '150px' },
          formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
        },
        ts_from: {
          label: 'From',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '123px' },
          formatter: v => Moment(v, "x").format("YYYY-MM-DD HH:mm:ss")
        },
        duration: {
          label: 'Duration',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '123px' },
          formatter: v => this.durationFormatter(v)
        },
        ts_to: {
          label: 'To',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '123px' },
          formatter: v => Moment(v, "x").format("YYYY-MM-DD HH:mm:ss")
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      reportFields: {
        name: 'Agent State History',
        title: 'Agent State History',
        from: undefined,
        to: undefined
      },
      sessions: []
    }
  },
  methods: {
    query: async function () {
      this.setReportFields()
      let qry = {}
      qry.date_start = Moment(this.fromTo.date_start).unix()
      qry.date_end = Moment(this.fromTo.date_end).unix()
      qry.agent_id = 3
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_state_history', [qry])
    },
    reset () {
      this.sessions = []
      this.fromTo = {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format()
      }
    },
    setReportFields () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  }
}
</script>


