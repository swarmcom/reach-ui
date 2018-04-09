<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <only-active v-model="onlyActive" caption="Show Only Active Clients"></only-active>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 151px; max-width: 151px; min-width: 151px">
            Clients
          </td>
          <td class='table-sm table-header-group' style="width: 402px; max-width: 402px; min-width: 402px">
            Outbound Activity
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields" :filter="hideEmpty">
      </b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import OnlyActive from "@/Report/Input/OnlyActive"
import Moment from 'moment'
import Common from '@/Report/Legacy/Common'

export default {
  mixins: [Common],
  components: {
    'report': Report,
    'from-to': FromTo,
    'only-active': OnlyActive
  },
  data () {
    return {
      fields: {
        client_id: {
          label: 'Client Name',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '151px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        placed: {
          label: 'Placed Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true,
          formatter: v => (v !== undefined) ? v : 0
        },
        answered: {
          label: 'Answered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true,
          formatter: (v, _, item) => (item.placed !== undefined) ? v : 'NA'
        },
        answered_percent: {
          label: 'Answered [%]',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true,
          formatter: (v, _, item) => (item.placed !== undefined && item.placed !== 0) ? (100*item.answered/item.placed).toFixed(1)+'%' : 'NA'
        },
        avg_talk_time: {
          label: 'Average Talk Time',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true,
          formatter: (v, _, item) => (item.placed !== undefined) ? this.durationFormatter(v) : 'NA'
        },
        total_talk_time: {
          label: 'Total Talk Time',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true,
          formatter: (v, _, item) => (item.placed !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      clients: [],
      reportFields: {
        name: 'Outbound Traffic Overview by Client',
        title: 'Outbound Traffic Overview by Client',
        timeRange: '-'
      },
      sessions: [],
      onlyActive: "false",
    }
  },
  methods: {
    query: async function () {
      this.reportFields.timeRange = this.formatTimeRange(this.fromTo.date_start, this.fromTo.date_end)
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let clientsIDs = this.clients.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'outbound_traffic_stats', [date_start, date_end, 'client_id', clientsIDs])
      this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.getClients()
      this.fromTo = {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      }
    },
    hideEmpty (item) {
      if (this.onlyActive === "false") return true
      else {
        if (item.placed === 0 || item.placed === undefined) return false
        else return true
      }
    },
    getClients: async function () {
      this.clients = await this.$agent.p_mfa('ws_agent', 'clients')
    },
    findName (id) {
      let obj = this.clients.find(v => { return v.id === id })
      return obj.name
    },
    addMissingRows () {
      this.clients.forEach((obj) => {
        if (this.sessions.find(v => { return v.client_id === obj.id}) === undefined) {
          this.sessions.push({ client_id: obj.id })
        }
      })
    }
  },
  created () {
    this.getClients()
  }
}
</script>
