<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <b-row>
        <b-col cols="10" md="6" lg="4">
          <from-to v-model="fromTo"></from-to>
        </b-col>
      </b-row>
      <b-row>
        <entity-selector v-model="agents" :query=agentsQuery entity="Agents"></entity-selector>
      </b-row>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 383px; max-width: 383px; min-width: 383px">
            Agent
          </td>
          <td class='table-sm table-header-group' :style='dispColGroupWidth'>
            Disposition Breakdown
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
  name: 'AgentCallDisposition',
  mixins: [Common],
  components: {
    'report': Report,
    'from-to': FromTo,
    'entity-selector': EntitySelector
  },
  data () {
    return {
      fields: [],
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agents: [],
      reportFields: {
        name: 'Agent Call Disposition',
        title: 'Agent Call Disposition',
        timeRange: '-'
      },
      dispColGroupWidth: undefined,
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
      let data = await this.$agent.p_mfa('ws_report', 'agent_call_disposition', [date_start, date_end, agentsIDs])
      this.generateTableColumns(data)
      this.sessions = data
    },
    reset () {
      this.sessions = []
      this.fields = []
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
    findProfileName (id) {
      let obj = this.agents.find(v => { return v.id === id })
      return (obj.group.name !== undefined) ? obj.group.name : "No Profile"
    },
    generateTableColumns (data) {
      this.fields = [
        {
          key: 'agent_id',
          label: 'Name',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '120px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        {
          key: 'agent_group',
          label: 'Agent Group',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '120px' },
          formatter: (_v, _, item) => this.findProfileName(item.agent_id)
        },
        {
          key: 'login',
          label: 'Login',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '70px' },
          formatter: (_v, _, item) => this.findLogin(item.agent_id)
        },
        {
          key: 'calls',
          label: 'Total Calls Handled',
          tdClass: ['table-body-blue-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '73px' },
          sortable: true,
          formatter: v => v ? v : 0
        }
      ]
      let dispFields = [], dispKeys = new Set(), dispColGroupWidth = 2
      data.forEach(function (row, index) {
        Object.keys(row.dispositions).forEach(function (key) {
          if (!dispKeys.has(key)) {
            dispKeys.add(key)
            let field = {
              key: key,
              label: key,
              tdClass: [
                'table-body-orange', 'text-align-right'],
              thClass: 'table-header',
              thStyle: { width: '70px' },
              formatter: (_v, _, item) => (item.dispositions[key] !== undefined) ? item.dispositions[key] : 0
            }
            dispFields.push(field)
            dispColGroupWidth += 70
          }
        })
      })
      this.dispColGroupWidth = {
        'width': dispColGroupWidth+'px',
        'max-width': dispColGroupWidth+'px',
        'min-width': dispColGroupWidth+'px'
      }
      this.fields = this.fields.concat(dispFields)
    }
  }
}
</script>

