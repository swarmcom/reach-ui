<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <b-row>
        <b-col cols="10" md="6" lg="3" style="min-width: 250px; max-width:250px;">
          <from-to v-model="fromTo"></from-to>
        </b-col>
        <entity-selector v-model="agentGroups" :query=agentGroupsQuery entity="Agent Groups"></entity-selector>
      </b-row>
    </div>
    <div slot="report">
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields">
        <template slot="show_details" slot-scope="row">
          <b-button size="sm" @click="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed; overflow-wrap: break-word;" small hover :items="row.item.records" :fields="fields_row">
          </b-table>
        </template>
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
  name: 'UnansweredCallDetails',
  mixins: [Common],
  components: {
    'report': Report,
    'from-to': FromTo,
    'entity-selector': EntitySelector
  },
  data () {
    return {
      fields: {
        agent_id: {
          label: 'Name',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '720px' },
          sortable: true,
          formatter: (v, _, item) => this.findName(v) + ' has ' + item.unanswered + ' unanswered calls'
        },
        show_details: {
          label: '',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '136px' },
        }
      },
      fields_row: {
        uuid: { label: 'Call ID', tdClass: 'table-body-green', thClass: 'table-header', thStyle: { width: '113px' } },
        media_type: {
          label: 'Media Type',
          tdClass: 'table-body-green-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '72px' }
        },
        queue_group: {
          label: 'Queue Group',
          formatter: qg => qg ? qg.name : '',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '90px' }
        },
        queue: {
          label: 'Queue',
          formatter: q => q ? q.name : '',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '90px' }
        },
        calling: {
          label: 'Called Number / Queue',
          tdClass: 'table-body-orange',
          thClass: 'table-header',
          thStyle: { width: '90px' }
        },
        client: {
          label: 'Client',
          formatter: client => client.name,
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
          thStyle: { width: '90px' }
        },
        endpoint_ani: {
          label: 'Endpoint ANI',
          tdClass: 'table-body-orange-dark',
          thClass: 'table-header',
          thStyle: { width: '90px' }
        },
        caller_ip: {
          label: 'Originating Caller ID',
          tdClass: 'table-body-orange-dark-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '87px' }
        },
        ts_ms: {
          label: 'Offered to Reach',
          sortable: true,
          tdClass: "table-body-blue",
          thClass: ['table-header'],
          thStyle: { width: '130px' },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm:ss")
        },
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agentGroups: [],
      agents: [],
      reportFields: {
        name: 'Unanswered Call Details',
        title: 'Unanswered Call Details',
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
      let agentGroupsIDs = this.agentGroups.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_unanswered', [date_start, date_end, agentGroupsIDs])
      // this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.agentGroups = []
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
        if (this.sessions.find(v => { return v.id === obj.id }) === undefined) {
          this.sessions.push({ id: obj.id })
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

