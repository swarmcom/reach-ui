<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 383px; max-width: 383px; min-width: 383px">
            Agent Group Information
          </td>
          <td class='table-sm table-header-group' style="width: 286px; max-width: 286px; min-width: 286px">
            Log In/Out
          </td>
          <td class='table-sm table-header-group' style="width: 507px; max-width: 507px; min-width: 507px">
            Logged In Time Breakdown
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

export default {
  name: 'AgentGroupProductivity',
  components: {
    'report': Report,
    'from-to': FromTo,
    'entity-selector': EntitySelector
  },
  data () {
    return {
      fields: {
        id: {
          label: 'Group Name',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '143px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        agents_in_grp: {
          label: 'Number of Agents',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' }
        },
        total_avail_time: {
          label: 'Total Avail. Time',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => v ? this.durationFormatter(v) : 'NA'
        },
        occupancy: {
          label: 'Occupancy',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '55px' },
          formatter: v => v ? v + ' %' : 0 + ' %'
        },
        cpt: {
          label: 'CPT (M:S)',
          tdClass: ['table-body-blue-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '59px' },
          formatter: v => v ? this.durationFormatter(v) : 'NA'
        },
        first_event_state: {
          label: 'First Login',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          formatter: (v, _, item) => (v === 'init') ? Moment(item.first_event_ts, "x").format("YYYY-MM-DD HH:mm:ss") : "outside of interval"
        },
        last_event_state: {
          label: 'Last Logout',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          formatter: (v, _, item) => (v === 'terminate') ? Moment(item.last_event_ts, "x").format("YYYY-MM-DD HH:mm:ss") : "outside of interval"
        },
        total_time: {
          label: 'Logged In',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => this.durationFormatter(v)
        },
        logged_out: {
          label: 'Logged Out',
          tdClass: ['table-body-green-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '63px' },
          formatter: (v, _, item) => this.durationFormatter(item.total_avail_time - item.total_time)
        },
        released: {
          label: 'Released',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => this.durationFormatter(v)
        },
        suspended: {
          label: 'Suspended',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => this.durationFormatter(v)
        },
        idle: {
          label: 'Idle',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => this.durationFormatter(v)
        },
        ringing: {
          label: 'Ringing',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => this.durationFormatter(v)

        },
        talk_total: {
          label: 'Inbound Talk',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: (v, _, item) => this.durationFormatter((v - item.oubound_talk < 0) ? 0 : v - item.oubound_talk)
        },
        wrapup: {
          label: 'Wrap Up',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => this.durationFormatter(v)
        },
        oubound_talk: {
          label: 'Outbound Talk',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: v => this.durationFormatter(v)
        },
        other: {
          label: 'Other',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          formatter: (_v, _, item) => this.durationFormatter(item.init + item.grace)
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      agents: [],
      agentGroups: [],
      intervalLength: 0,
      reportFields: {
        name: 'Agent Group Productivity',
        title: 'Agent Group Productivity',
        from: undefined,
        to: undefined
      },
      sessions: []
    }
  },
  methods: {
    query: async function () {
      this.setReportFields()
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let agentGroupsIDs = this.agentGroups.map(obj => obj.id)
      this.intervalLength = (date_end - date_start)*1000
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_productivity_stats', [date_start, date_end, 'agent_group_id', 'agent_group_id', agentGroupsIDs])
      this.addMissingRows()
      this.enrichData()
    },
    reset () {
      this.sessions = []
      this.agentGroups = []
      this.intervalLength = 0
      this.fromTo = {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format()
      }
    },
    setReportFields () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
    },
    findName (id) {
      let obj = this.agentGroups.find(v => { return v.id === id })
      return obj.name
    },
    enrichData () {
      this.sessions.forEach(row => {
        const agentsCount = this.agents.filter(a => a.group_id == row.id).length;
        row.agents_in_grp = agentsCount
        row.total_avail_time = agentsCount * this.intervalLength
      })
    },
    addMissingRows () {
      this.agentGroups.forEach(obj => {
        if (this.sessions.find(v => { return v.id === obj.id}) === undefined) {
          this.sessions.push({ id: obj.id, total_time: 0 })
        }
      })
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    },
    getAgents: async function () {
      this.agents = await this.$agent.p_mfa('ws_agent', 'agents')
    },
    getAgentGroups: async function () {
      this.agentGroups = await this.$agent.p_mfa('ws_agent', 'agent_groups')
    }
  },
  created () {
    this.getAgents()
    this.getAgentGroups()
  }
}
</script>
