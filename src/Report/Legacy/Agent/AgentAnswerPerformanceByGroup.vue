<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 187px; max-width: 187px; min-width: 187px">
            Agent
          </td>
          <td class='table-sm table-header-group' style="width: 324px; max-width: 324px; min-width: 324px">
            Activity Details
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

export default {
  name: 'AgentAnswerPerformanceByGroup',
  components: {
    'report': Report,
    'from-to': FromTo
  },
  data () {
    return {
      fields: {
        agent_id: {
          label: 'Name',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '120px' }
        },
        login: {
          label: 'Login',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '67px' }
        },
        ring_count: {
          label: 'Calls Offered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          formatter: v => v ? v : 0
        },
        answered_count: {
          label: 'Calls Answered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          formatter: v => v ? v : 0
        },
        abandoned: {
          label: 'Unanswered calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          formatter: v => v ? v : 0
        },
        percent_answered: {
          label: 'Percent Answered',
          tdClass: ['table-body-orange-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '84px' },
          formatter: (v, _, item) => (item.ring_count != 0) ? (100 * item.answered_count / item.ring_count).toFixed(1) + '%' : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      reportFields: {
        name: 'Agent Answer Performance by Group',
        title: 'Agent Answer Performance by Group',
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
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_answer_performance', [qry.date_start, qry.date_end])
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
    }
  }
}
</script>
