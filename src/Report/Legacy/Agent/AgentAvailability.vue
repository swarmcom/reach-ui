<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <b-row>
        <b-col cols="6" md="4" lg="3">
          <from-to v-model="fromTo"></from-to>
        </b-col>
        <b-col cols="6" md="4" lg="3">
          <interval v-model="interval" :min_value="1"></interval>
        </b-col>
        <b-col cols="6" md="4" lg="3">
          <sla caption="SLA target answer time [s]" v-model="sla"></sla>
        </b-col>
      </b-row>
      <b-row>
        <entity-selector v-model="skills" :query=skillsQuery entity="Skills"></entity-selector>
      </b-row>
      <b-row>
        <entity-selector v-model="agentGroups" :query=agentGroupsQuery entity="Agent Groups"></entity-selector>
      </b-row>
      <b-row>
        <entity-selector v-model="agents" :query=agentsQuery entity="Agents"></entity-selector>
      </b-row>
      <b-row>
        <entity-selector v-model="queueGroups" :query=queueGroupsQuery entity="Queue Groups"></entity-selector>
      </b-row>
      <b-row>
        <entity-selector v-model="queues" :query=queuesQuery entity="Queues"></entity-selector>
      </b-row>
      <b-row>
        <entity-selector v-model="clients" :query=clientsQuery entity="Clients"></entity-selector>
      </b-row>
      <b-row>
        <b-col cols="12" md="12" lg="12" xl="12">
          <only-active v-model="onlyActive" caption="Show Only Intervals with Activity"></only-active>
        </b-col>
      </b-row>
    </div>
    <div slot="report">
      <table style="width:100%">
        <tr>
          <td class='table-sm table-header-group' style="width: 24%; min-width: 210px">
            Intervals {{reportFields.interval}} min
          </td>
          <td class='table-sm table-header-group' style="width: 76%; min-width: 648px">
            Traffic Details
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; width:100%" small hover :items="sessions" :fields="fields" :filter="hideEmpty">
      </b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import EntitySelector from '@/Report/Input/EntitySelector'
import SLA from '@/Report/Input/SLA'
import Interval from '@/Report/Input/Interval'
import OnlyActive from '@/Report/Input/OnlyActive'
import Moment from 'moment'
import Common from '@/Report/Legacy/Common'

export default {
  name: 'AgentAvailability',
  mixins: [Common],
  components: {
    'report': Report,
    'from-to': FromTo,
    'entity-selector': EntitySelector,
    'sla': SLA,
    'interval': Interval,
    'only-active': OnlyActive
  },
  data () {
    return {
      fields: {
        ts_from: {
          label: 'From',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '12%', 'min-width': '105px' },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm"),
        },
        ts_to: {
          label: 'To',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '12%', 'min-width': '105px' },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm"),
        },
        call_count: {
          label: 'Total Calls Offered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '64px' },
          sortable: true
        },
        ring_count: {
          label: 'Offered to Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '64px' },
          sortable: true
        },
        answered_count: {
          label: 'Answered by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: {width: '7%', 'min-width': '64px' },
          sortable: true
        },
        voicemail: {
          label: 'Sent to Voicemail',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '64px' },
          sortable: true
        },
        transferred_out: {
          label: 'Transferred Out',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '64px' },
          sortable: true
        },
        abandoned: {
          label: 'Total Abandoned',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '64px' },
          sortable: true
        },
        sla_count: {
          label: 'SLA',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '64px' },
          sortable: true
        },
        abandoned_percent: {
          label: 'Abandoned [%]',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '64px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined && item.call_count !== 0) ? (100*item.abandoned/item.call_count).toFixed(1)+'%' : 'NA'
        },
        cpt: {
          label: 'CPT',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '10%', 'min-width': '68px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        },
        asa: {
          label: 'ASA',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '10%', 'min-width': '68px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agentGroups: [],
      agents: [],
      queueGroups: [],
      queues: [],
      clients: [],
      skills: [],
      reportFields: {
        name: 'Agent Availability',
        title: 'Agent Availability',
        timeRange: '-',
        interval: undefined,
        sla: undefined
      },
      sessions: [],
      onlyActive: 'false',
      sla: 10,
      interval: 60,
      agentGroupsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'agent_groups')
      },
      agentsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'agents')
      },
      queueGroupsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'queue_groups')
      },
      queuesQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'queues')
      },
      clientsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'clients')
      },
      skillsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'tags')
      }
    }
  },
  methods: {
    query: async function () {
      this.reportFields.timeRange = this.formatTimeRange(this.fromTo.date_start, this.fromTo.date_end)
      this.reportFields.interval = this.interval
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let interval = this.interval * 60
      let sla = this.sla * 1000
      let qry = {}
      qry.inqueue_agent_groups = this.agentGroups.map(obj => obj.id)
      qry.agents = this.agents.map(obj => obj.id)
      qry.queue_groups = this.queueGroups.map(obj => obj.id)
      qry.queues = this.queues.map(obj => obj.id)
      qry.clients = this.clients.map(obj => obj.id)
      qry.skills_or = this.skills.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_availability_stats', [date_start, date_end, interval, sla, qry])
    },
    reset () {
      this.sessions = []
      this.agentGroups = this.agents = []
      this.queueGroups = this.queues = []
      this.clients = []
      this.skills = []
      this.fromTo = {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      }
      this.onlyActive = 'false'
      this.sla = 10
      this.interval = 60
    },
    hideEmpty (item) {
      if (this.onlyActive === 'false') return true
      else {
        if (item.call_count === 0)
          return false
        else
          return true
      }
    }
  }
}
</script>
