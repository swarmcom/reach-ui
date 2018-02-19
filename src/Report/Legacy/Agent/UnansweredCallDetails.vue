<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <entity-selector v-model="agentGroups" :query=agentGroupsQuery entity="Agent Groups"></entity-selector>
    </div>
    <div slot="report">
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields">
        <template slot="show_details" slot-scope="row">
          <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
          <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2">
            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <b-row class="mb-2">
              <b-col sm="3" class="text-sm-right">
                <b>Records:</b>
              </b-col>
              <b-col>{{ row.item.records }}</b-col>
            </b-row>
            <b-button size="sm" @click="row.toggleDetails">Hide Details</b-button>
          </b-card>
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

export default {
  name: 'UnansweredCallDetails',
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
          thStyle: { width: '520px' },
          sortable: true,
          formatter: (v, _, item) => this.findName(v) + ' has ' + item.abandoned + ' unanswered calls'
        },
        show_details: {
          label: '',
          tdClass: 'table-body-blue',
          thClass: 'table-header',
          thStyle: { width: '0px' }

        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      agentGroups: [],
      agents: [],
      reportFields: {
        name: 'Unanswered Call Details',
        title: 'Unanswered Call Details',
        from: undefined,
        to: undefined
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
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format()
      }
    },
    setReportFields () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
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
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    },
    getAgents: async function () {
      this.agents = await this.$agent.p_mfa('ws_db_agent', 'suggest', [''])
    }
  },
  created () {
    this.getAgents()
  }
}
</script>

