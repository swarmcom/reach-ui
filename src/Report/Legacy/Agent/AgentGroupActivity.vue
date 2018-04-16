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
          <td class='table-sm table-header-group' style="width:15%; min-width: 120px">
            Agent Group
          </td>
          <td class='table-sm table-header-group' style="width: 39%; min-width: 319px">
            Inbound Activity
          </td>
          <td class='table-sm table-header-group' style="width: 31%; min-width: 256px">
            Outbound Activity
          </td>
          <td class='table-sm table-header-group' style="width: 15%; min-width: 128px; border-right: 0px solid;">
            Total Activity
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
  name: 'AgentGroupActivity',
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
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '15%', 'min-width': '120px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        in_answered: {
          label: 'Total Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '63px' },
          formatter: v => v ? v : 0
        },
        in_talk_time: {
          label: 'Total Time',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '9%', 'min-width': '65px' },
          formatter: v => v ? this.durationFormatter(v) : this.durationFormatter(0)
        },
        in_completed: {
          label: 'Completed Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '63px' },
          formatter: v => v ? v : 0
        },
        in_transferred: {
          label: 'Transferred Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '63px' },
          formatter: v => v ? v : 0
        },
        in_avg_hold_time: {
          label: 'Avg. Hold Time',
          tdClass: ['table-body-green-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '9%', 'min-width': '65px' },
          formatter: (v, _, item) => v ? this.durationFormatter(v) : 'NA'
        },
        out_started: {
          label: 'Started Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '63px' },
          formatter: v => v ? v : 0
        },
        out_placed: {
          label: 'Sent Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '63px' },
          formatter: v => v ? v : 0
        },
        out_answered: {
          label: 'Answered Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '63px' },
          formatter: v => v ? v : 0
        },
        out_talk_time: {
          label: 'Total Time',
          tdClass: ['table-body-green-last-in-group', 'text-align-right'],
          thClass: 'table-header-last-in-group',
          thStyle: { width: '10%', 'min-width': '67px' },
          formatter: v => v ? this.durationFormatter(v) : this.durationFormatter(0)
        },
        total_calls: {
          label: 'Total Calls',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '7%', 'min-width': '63px' },
          formatter: v => v ? v : 0
        },
        total_talk_time: {
          label: 'Total Time',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '8%', 'min-width': '67px', 'border-right': '0px solid'},
          formatter: v => v ? this.durationFormatter(v) : this.durationFormatter(0)
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agentGroups: [],
      reportFields: {
        name: 'Agent Group Activity',
        title: 'Agent Group Activity',
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
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_activity_stats', [date_start, date_end, 'agent_group_id', 'agent_group_id', agentGroupsIDs])
      this.addMissingRows()
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
      let obj = this.agentGroups.find(v => { return v.id === id })
      return obj.name
    },
    addMissingRows () {
      this.agentGroups.forEach((obj) => {
        if (this.sessions.find(v => { return v.id === obj.id}) === undefined) {
          this.sessions.push({ id: obj.id })
        }
      })
    }
  }
}
</script>
