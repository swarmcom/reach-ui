<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <div>Agents:</div>
      <div style="padding-bottom: 30px">
      <b-form-select class="pointer" size="sm" v-model="agent" @change="setAgent">
            <option v-for="agent in agents" :value="agent" :key="agent.id">{{agent.name}}</option>
      </b-form-select>
      </div>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 521px; max-width: 521px; min-width: 521px">
            Agent Events
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
import momentDurationFormatSetup from 'moment-duration-format'
import Common from '@/Report/Legacy/Common'

export default {
  name: 'AgentStateHistory',
  mixins: [Common],
  components: {
    'report': Report,
    'from-to': FromTo,
    'entity-selector': EntitySelector
  },
  data () {
    return {
      fields: {
        state_from: {
          label: 'State Entered',
          tdClass: 'table-body-orange-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '150px' },
          formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
        },
        ts_from: {
          label: 'From',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '123px' },
          formatter: v => Moment(v, "x").format("YYYY-MM-DD HH:mm:ss")
        },
        duration: {
          label: 'Duration',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '123px' },
          formatter: v => this.durationFormatter(v)
        },
        ts_to: {
          label: 'To',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '123px' },
          formatter: v => Moment(v, "x").format("YYYY-MM-DD HH:mm:ss")
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      agents: [],
      agent: {},
      reportFields: {
        name: 'Agent State History',
        title: 'Agent State History',
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
      let qry = {}
      qry.date_start = Moment(this.fromTo.date_start).unix()
      qry.date_end = Moment(this.fromTo.date_end).unix()
      qry.agent_id = this.agent.id
      this.sessions = await this.$agent.p_mfa('ws_report', 'agent_state_history', [qry])
    },
    reset () {
      this.sessions = []
      this.agent = -1
      this.fromTo = {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      }
    },
    setReportFields () {
      this.reportFields.timeRange = this.formatTimeRange(this.fromTo.date_start, this.fromTo.date_end)
      this.reportFields.title = 'Agent State History for agent: ' + this.agent.name
    },
    getAgents: async function () {
      this.agents = await this.$agent.p_mfa('ws_agent', 'agents')
    },
    setAgent (value) {
      this.agent = value
    }
  },
  created () {
    this.getAgents()
  }
}
</script>


