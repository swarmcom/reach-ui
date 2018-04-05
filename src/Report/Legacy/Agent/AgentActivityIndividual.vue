<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <entity-selector v-model="agents" :query=agentsQuery entity="Agents"></entity-selector>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 187px; max-width: 187px; min-width: 187px">
            Agent
          </td>
          <td class='table-sm table-header-group' style="width: 319px; max-width: 319px; min-width: 319px">
            Inbound Activity
          </td>
          <td class='table-sm table-header-group' style="width: 256px; max-width: 256px; min-width: 256px">
            Outbound Activity
          </td>
          <td class='table-sm table-header-group' style="width: 128px; max-width: 128px; min-width: 128px">
            Total Activity
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
import EntitySelector from '@/Report/Input/EntitySelector'
import Moment from 'moment'
import Common from '@/Report/Legacy/Common'

export default {
  mixins: [Common],
  name: 'AgentActivityIndividual',
  components: {
    'report': Report,
    'from-to': FromTo,
    'entity-selector': EntitySelector
  },
  data () {
    return {
      fields: {
        id: {
          label: 'Name',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '120px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        login: {
          label: 'Login',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '67px' },
          formatter: (_v, _, item) => this.findLogin(item.id)
        },
        in_answered: {
          label: 'Total Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? v : 0
        },
        in_talk_time: {
          label: 'Total Time',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? this.durationFormatter(v) : this.durationFormatter(0)
        },
        in_completed: {
          label: 'Completed Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? v : 0
        },
        in_transferred: {
          label: 'Transferred Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? v : 0
        },
        in_avg_hold_time: {
          label: 'Avg. Hold Time',
          tdClass: ['table-body-green-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '67px' },
          formatter: (v, _, item) => v ? this.durationFormatter(v) : 'NA'
        },
        out_started: {
          label: 'Started Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? v : 0
        },
        out_placed: {
          label: 'Sent Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? v : 0
        },
        out_answered: {
          label: 'Answered Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? v : 0
        },
        out_talk_time: {
          label: 'Total Time',
          tdClass: ['table-body-green-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '67px' },
          formatter: v => v ? this.durationFormatter(v) : this.durationFormatter(0)
        },
        total_calls: {
          label: 'Total Calls',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? v : 0
        },
        total_talk_time: {
          label: 'Total Time',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? this.durationFormatter(v) : this.durationFormatter(0)
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agents: [],
      reportFields: {
        name: 'Agent Activity Individual',
        title: 'Agent Activity Individual',
        timeRange: '-'
      },
      sessions: [],
      agentsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'agents')
      }
    }
  },
  methods: {
    query: async function () {
      this.setReportFields()
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let agentsIDs = this.agents.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_activity_stats', [date_start, date_end, 'agent_id', 'agent_id', agentsIDs])
      this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.agents = []
      this.fromTo = {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      }
    },
    setReportFields () {
      this.reportFields.timeRange = this.formatTimeRange(this.fromTo.date_start, this.fromTo.date_end)
    },
    findName (id) {
      let obj = this.agents.find(v => { return v.id === id })
      return obj.name
    },
    findLogin (id) {
      let obj = this.agents.find(v => { return v.id === id })
      return obj.login
    },
    addMissingRows () {
      this.agents.forEach((obj) => {
        if (this.sessions.find(v => { return v.id === obj.id}) === undefined) {
          this.sessions.push({ id: obj.id })
        }
      })
    }
  }
}
</script>
