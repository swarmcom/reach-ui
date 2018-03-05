<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <sla caption="SLA target answer time [s]" v-model="sla"></sla>
      <only-active v-model="onlyActive" caption="Show Only Active Clients"></only-active>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 151px; max-width: 151px; min-width: 151px">
            Clients
          </td>
          <td class='table-sm table-header-group' style="width: 649px; max-width: 649px; min-width: 649px">
            Inbound Activity Details
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
import SLA from '@/Report/Input/SLA'
import OnlyActive from "@/Report/Input/OnlyActive"
import Moment from 'moment'
import 'moment-duration-format'

export default {
  components: {
    'report': Report,
    'from-to': FromTo,
    'sla': SLA,
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
        call_count: {
          label: 'Total Calls Offered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: v => (v !== undefined) ? v : 0
        },
        ring_count: {
          label: 'Offered to Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        answered_count: {
          label: 'Answered by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.ring_count !== undefined) ? v : 'NA'
        },
        voicemail: {
          label: 'Sent to Voicemail',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        transferred_out: {
          label: 'Transferred Out',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        abandoned: {
          label: 'Total Abandoned',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        sla_count: {
          label: 'SLA',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        abandoned_percent: {
          label: 'Abandoned [%]',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined && item.call_count !== 0) ? (100*item.abandoned/item.call_count).toFixed(1)+'%' : 'NA'
        },
        cpt: {
          label: 'CPT',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          sortable: true,
          thStyle: { width: '73px' },
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        },
        asa: {
          label: 'ASA',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          sortable: true,
          thStyle: { width: '70px' },
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      clients: [],
      reportFields: {
        name: 'Client Traffic Overview',
        title: 'Client Traffic Overview',
        from: undefined,
        to: undefined,
        sla: undefined
      },
      sessions: [],
      sla: 10,
      onlyActive: "false",
    }
  },
  methods: {
    query: async function () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
      this.reportFields.sla = this.sla
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let sla = this.sla * 1000
      let clientsIDs = this.clients.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'traffic_overview_stats', [date_start, date_end, sla, 'client_id', clientsIDs])
      this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.getClients()
      this.fromTo = {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format()
      }
      this.sla = 10
    },
    hideEmpty (item) {
      if (this.onlyActive === "false") return true
      else {
        if (item.call_count === 0 || item.call_count === undefined) return false
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
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  },
  created () {
    this.getClients()
  }
}
</script>
