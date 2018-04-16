<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <b-row>
        <b-col cols="10" md="6" lg="4">
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
          <td class='table-sm table-header-group' style="width: 26%; min-width: 297px">
            Agent Information
          </td>
          <td class='table-sm table-header-group' style="width: 26%; min-width: 286px">
            Log In/Out
          </td>
          <td class='table-sm table-header-group' style="width: 48%; min-width: 507px; border-right:0px solid;">
            Logged In Time Breakdown
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
  name: 'AgentProductivityByGroup',
  mixins: [Common],
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
          thStyle: {  width: '9%', 'min-width': '120px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        login: {
          label: 'Login',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: (_v, _, item) => this.findLogin(item.id)
        },
        occupancy: {
          label: 'Occupancy',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '5%', 'min-width': '55px' },
          formatter: v => v ? v + ' %' : 0 + ' %'
        },
        cpt: {
          label: 'CPT (M:S)',
          tdClass: ['table-body-blue-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '6%', 'min-width': '59px' },
          formatter: v => v ? this.durationFormatter(v) : 'NA'
        },
        first_event_state: {
          label: 'First Login',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '80px' },
          formatter: (v, _, item) => (v === 'init') ? Moment(item.first_event_ts, "x").format("YYYY-MM-DD HH:mm:ss") : "outside of interval"
        },
        last_event_state: {
          label: 'Last Logout',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '80px' },
          formatter: (v, _, item) => (v === 'terminate') ? Moment(item.last_event_ts, "x").format("YYYY-MM-DD HH:mm:ss") : "outside of interval"
        },
        total_time: {
          label: 'Logged In',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: v => this.durationFormatter(v)
        },
        logged_out: {
          label: 'Logged Out',
          tdClass: ['table-body-green-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: (v, _, item) => this.durationFormatter(this.computeLoggedOutTime(item.total_time))
        },
        released: {
          label: 'Released',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: v => this.durationFormatter(v)
        },
        suspended: {
          label: 'Suspended',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: v => this.durationFormatter(v)
        },
        idle: {
          label: 'Idle',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: v => this.durationFormatter(v)
        },
        ringing: {
          label: 'Ringing',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: {width: '6%', 'min-width': '63px' },
          formatter: v => this.durationFormatter(v)

        },
        talk_total: {
          label: 'Inbound Talk',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: (v, _, item) => this.durationFormatter((v - item.oubound_talk < 0) ? 0 : v - item.oubound_talk)
        },
        wrapup: {
          label: 'Wrap Up',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: v => this.durationFormatter(v)
        },
        oubound_talk: {
          label: 'Outbound Talk',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px' },
          formatter: v => this.durationFormatter(v)
        },
        other: {
          label: 'Other',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '6%', 'min-width': '63px', 'border-right': '0px solid' },
          formatter: (_v, _, item) => this.durationFormatter(item.init + item.grace)
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agentGroups: [],
      agents: [],
      intervalLength: 0,
      reportFields: {
        name: 'Agent Productivity by Group',
        title: 'Agent Productivity by Group',
        timeRange: '-'
      },
      sessions: [],
      agentGroupsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'agent_groups')
      }
    }
  },
  methods: {
    query: async function () {
      this.setReportFields()
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      this.intervalLength = (date_end - date_start)*1000
      let agentGroupsIDs = this.agentGroups.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_productivity_stats', [date_start, date_end, 'agent_id', 'agent_group_id', agentGroupsIDs])
      this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.agentGroups = []
      this.intervalLength = 0,
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
          if (this.sessions.find(v => { return v.id === obj.id}) === undefined ) {
            this.sessions.push({ id: obj.id, total_time: 0 })
          }
        }
      })
    },
    computeLoggedOutTime (loggedInTime) {
      return (this.intervalLength - loggedInTime)
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
