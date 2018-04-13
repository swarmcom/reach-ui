<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <b-row>
        <b-col cols="6" md="4" lg="3">
          <from-to v-model="fromTo"></from-to>
        </b-col>
      </b-row>
      <b-row>
        <entity-selector v-model="agentGroups" :query=agentGroupsQuery entity="Agent Groups"></entity-selector>
      </b-row>
    </div>
    <div slot="report">
      <table style="width:100%">
        <tr>
          <td class='table-sm table-header-group' style="width: 37%; min-width: 187px">
            Agent
          </td>
          <td class='table-sm table-header-group' style="width: 63%; min-width: 324px">
            Activity Details
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; width:100%;" small hover :items="sessions" :fields="fields">
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
  name: 'AgentAnswerPerformanceByGroup',
  mixins: [Common],
  components: {
    'report': Report,
    'from-to': FromTo,
    'entity-selector': EntitySelector,
  },
  data () {
    return {
      fields: {
        agent_id: {
          label: 'Name',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '24%', 'min-width': '120px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        login: {
          label: 'Login',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '13%', 'min-width': '67px' },
          sortable: true,
          formatter: (_v, _, item) => this.findLogin(item.agent_id)
        },
        ring_count: {
          label: 'Calls Offered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '15%', 'min-width': '80px' },
          sortable: true,
          formatter: v => v ? v : 0
        },
        answered_count: {
          label: 'Calls Answered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '15%', 'min-width': '80px' },
          sortable: true,
          formatter: v => v ? v : 0
        },
        abandoned: {
          label: 'Unanswered calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '15%', 'min-width': '80px' },
          sortable: true,
          formatter: v => v ? v : 0
        },
        percent_answered: {
          label: 'Percent Answered',
          tdClass: ['table-body-orange-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '18%', 'min-width': '84px' },
          sortable: true,
          formatter: (v, _, item) => (item.ring_count != 0) ? (100 * item.answered_count / item.ring_count).toFixed(1) + '%' : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agentGroups: [],
      agents: [],
      reportFields: {
        name: 'Agent Answer Performance by Group',
        title: 'Agent Answer Performance by Group',
        timeRange: '-'
      },
      sessions: [],
      agentGroupsQuery: function () {
        let profiles = this.$agent.p_mfa('ws_agent', 'agent_groups')
        profiles.then ( p => p.push({ name: 'No Profile', id: -1 }))
        return profiles
      }
    }
  },
  methods: {
    query: async function () {
      this.setReportFields()
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let agentGroupsIDs = this.agentGroups.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_answer_performance', [date_start, date_end, agentGroupsIDs])
      this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.agentGroups = []
      this.getAgents()
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
      return (obj !== undefined) ? obj.name : "removed entity"
    },
    findLogin (id) {
      let obj = this.agents.find(v => { return v.id === id })
      return (obj !== undefined) ? obj.login : "removed entity"
    },
    addMissingRows () {
      let agentGroupsIDs = this.agentGroups.map(obj => obj.id)
      this.agents.forEach(obj => {
        if (agentGroupsIDs.includes(obj.group_id)) {
          if (this.sessions.find(v => { return v.agent_id === obj.id}) === undefined ) {
            this.sessions.push({ agent_id: obj.id })
          }
        }
      })
    },
    getAgents: async function () {
      this.agents = await this.$agent.p_mfa('ws_agent', 'agents')
    }
  },
  created () {
    this.getAgents()
  }
}
</script>
