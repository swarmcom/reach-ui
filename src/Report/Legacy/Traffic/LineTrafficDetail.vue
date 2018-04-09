<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <interval v-model="interval" :min_value="min_interval"></interval>
      <entity-selector v-model="lines" :query=linesQuery entity="Lines"></entity-selector>
      <sla caption="SLA target answer time [s]" v-model="sla"></sla>
      <only-active v-model="onlyActive" caption="Show Only Intervals with Activity"></only-active>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 210px; max-width: 210px; min-width: 210px">
            Intervals {{reportFields.interval}} min
          </td>
          <td class='table-sm table-header-group' style="width: 587px; max-width: 587px; min-width: 587px">
            Traffic Details
          </td>
        </tr>
      </table>
      <div style="max-height:60vh">
        <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields" :filter="hideEmpty" :sort-compare="sortCompareCustom">
        </b-table>
      </div>
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
import Common from '@/Report/Legacy/Common'
import Moment from 'moment'

export default {
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
          thStyle: { width: '103px' },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm"),
        },
        ts_to: {
          label: 'To',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '107px' },
          formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm"),
        },
        call_count: {
          label: 'Total Calls Offered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true
        },
        ring_count: {
          label: 'Offered to Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true
        },
        answered_count: {
          label: 'Answered by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true
        },
        voicemail: {
          label: 'Sent to Voicemail',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true
        },
        abandoned: {
          label: 'Total Abandoned',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true
        },
        sla_count: {
          label: 'SLA',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true
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
          thStyle: { width: '73px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'

        },
        asa: {
          label: 'ASA',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '70px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
      },
      lines: [],
      reportFields: {
        name: 'Line Traffic Detail',
        title: 'Line Traffic Detail',
        timeRange: '-',
        interval: undefined,
        sla: undefined
      },
      sessions: [],
      onlyActive: 'false',
      sla: 10,
      interval: 60,
      linesQuery: function() {
        return this.$agent.p_mfa('ws_agent', 'lines_in')
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
      let linesIDs = this.lines.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'traffic_details_stats', [date_start, date_end, interval, sla, 'line_in_id', linesIDs])
    },
    reset () {
      this.sessions = []
      this.lines = []
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
    },
    setReportFields () {
      this.reportFields.timeRange = this.formatTimeRange(this.fromTo.date_start, this.fromTo.date_end)
      this.reportFields.interval = this.interval
    }
  },
  computed: {
    min_interval() {
      // min 5 minutes interval for one day
      return parseInt(((Moment(this.fromTo.date_end).unix()) - (Moment(this.fromTo.date_start).unix())) / 17280)
    }
  }
}
</script>