<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <interval v-model="interval"></interval>
      <entity-selector v-model="clients" :query=clientsQuery entity="Clients"></entity-selector>
      <sla v-model="sla"></sla>
      <only-active v-model="onlyActive" caption="Show Only Intervals with Activity"></only-active>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 210px; max-width: 210px; min-width: 210px">
            Intervals {{reportFields.interval}} min
          </td>
          <td class='table-sm table-header-group' style="width: 649px; max-width: 649px; min-width: 649px">
            Traffic Details
          </td>
        </tr>
      </table>
      <div style="max-height:60vh">
        <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields" :filter="hideEmpty">
        </b-table>
      </div>
    </div>
  </report>
</template>

<script>
import Report from "@/Report/Legacy/Report"
import FromTo from "@/Report/Input/FromTo"
import EntitySelector from '@/Report/Input/EntitySelector'
import SLA from "@/Report/Input/SLA"
import Interval from "@/Report/Input/Interval"
import OnlyActive from "@/Report/Input/OnlyActive"
import Moment from "moment"

export default {
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
          label: "From",
          tdClass: "table-body-blue",
          thClass: "table-header",
          thStyle: { width: "103px" },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm")
        },
        ts_to: {
          label: "To",
          tdClass: "table-body-blue-last-in-group",
          thClass: "table-header-last-in-group",
          thStyle: { width: "107px" },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm")
        },
        call_count: {
          label: "Total Calls Offered",
          tdClass: ["table-body-green", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" },
          sortable: true
        },
        ring_count: {
          label: "Offered to Agent",
          tdClass: ["table-body-green", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" }
        },
        answered_count: {
          label: "Answered by Agent",
          tdClass: ["table-body-green", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" },
          sortable: true
        },
        voicemail: {
          label: "Sent to Voicemail",
          tdClass: ["table-body-green", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" },
          sortable: true
        },
        transferred_out: {
          label: "Transferred Out",
          tdClass: ["table-body-green", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" },
          sortable: true
        },
        abandoned: {
          label: "Total Abandoned",
          tdClass: ["table-body-green", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" },
          sortable: true
        },
        sla_count: {
          label: "SLA",
          tdClass: ["table-body-orange", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" },
          sortable: true
        },
        abandoned_percent: {
          label: "Abandoned [%]",
          tdClass: ["table-body-orange", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "63px" },
          formatter: (v, _, item) => (item.call_count !== undefined && item.call_count !== 0) ? (100*item.abandoned/item.call_count).toFixed(1)+'%' : 'NA'
        },
        cpt: {
          label: "CPT",
          tdClass: ["table-body-blue", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "73px" },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        },
        asa: {
          label: "ASA",
          tdClass: ["table-body-blue", "text-align-right"],
          thClass: "table-header",
          thStyle: { width: "70px" },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      fromTo: {
        date_start: Moment()
          .subtract(1, "days")
          .format(),
        date_end: Moment().format()
      },
      clients: [],
      reportFields: {
        name: "Client Traffic Detail",
        title: "Client Traffic Detail",
        from: undefined,
        to: undefined,
        interval: undefined,
        sla: undefined
      },
      sessions: [],
      onlyActive: "false",
      sla: 10,
      interval: 60,
      clientsQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'clients')
      }
    }
  },
  methods: {
    query: async function () {
      this.setReportFields()
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let interval = this.interval * 60
      let sla = this.sla * 1000
      let clientsIDs = this.clients.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'traffic_details_stats', [date_start, date_end, interval, sla, 'client_id', clientsIDs])
    },
    reset () {
      this.sessions = []
      this.clients = []
      this.fromTo = {
        date_start: Moment().subtract(1, "days").format(),
        date_end: Moment().format()
      }
      this.onlyActive = "false"
      this.sla = 10
      this.interval = 60
    },
    hideEmpty (item) {
      if (this.onlyActive === "false") return true
      else {
        if (item.call_count === 0) return false
        else return true
      }
    },
    setReportFields () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format("LL")
      this.reportFields.to = new Moment(this.fromTo.date_end).format("LL")
      this.reportFields.interval = this.interval
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  }
}
</script>
