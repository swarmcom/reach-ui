<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <timestamp v-model="ts"></timestamp>
      <entity-selector v-model="skills" :query=skillsQuery entity="Skills"></entity-selector>
      <entity-selector v-model="agentGroups" :query=agentGroupsQuery entity="Agent Groups"></entity-selector>
      <entity-selector v-model="agents" :query=agentsQuery entity="Agents"></entity-selector>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 549px; max-width: 549px; min-width: 549px">
            Agent States at {{ formatedTs }}
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
import Ts from '@/Report/Input/Ts'
import EntitySelector from '@/Report/Input/EntitySelector'
import Moment from 'moment'

export default {
  name: 'AgentStatesOverview',
  components: {
    'report': Report,
    'timestamp': Ts,
    'entity-selector': EntitySelector
  },
  data () {
    return {
      fields: {
        agent_id: {
          label: 'Name',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '123px' },
          formatter: v => this.findName(v)
        },
        login: {
          label: 'Login',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '123px' },
          formatter: (_v, _, item) => this.findLogin(item.agent_id)
        },
        state_from: {
          label: 'State',
          tdClass: ['table-body-green-last-in-group', 'text-align-right'],
          thClass: ['table-header-last-in-group', 'text-align-right'],
          thStyle: { width: '303px' },
          formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
        }
      },
      ts: Moment().format(),
      agentGroups: [],
      agents: [],
      allAgents: [],
      skills: [],
      reportFields: {
        name: 'Agent States Overview',
        title: 'Agent States Overview',
        time: undefined
      },
      sessions: [],
      agentGroupsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'agent_groups')
      },
      agentsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'agents')
      },
      skillsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'tags')
      }
    }
  },
  computed: {
    formatedTs: function () {
      return new Moment(this.ts).format("YYYY-MM-DD HH:mm:ss")
    }
  },
  methods: {
    query: async function () {
      this.setReportFields()
      let time = Moment(this.ts).unix()
      let qry = {}
      qry.agent_groups = this.agentGroups.map(obj => obj.id)
      qry.agents = this.agents.map(obj => obj.id)
      qry.skills_or = this.skills.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_states_for_ts', [time, qry])
    },
    reset () {
      this.sessions = []
      this.agentGroups = this.agents = []
      this.skills = []
      this.ts = Moment().format()
    },
    findName (id) {
      let obj = this.allAgents.find(v => { return v.id === id })
      return obj.name
    },
    findLogin (id) {
      let obj = this.allAgents.find(v => { return v.id === id })
      return obj.login
    },
    setReportFields () {
      //this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      //this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
    },
    getAgents: async function () {
      this.allAgents = await this.$agent.p_mfa('ws_agent', 'agents')
    }
  },
  created () {
    this.getAgents()
  }
}
</script>
