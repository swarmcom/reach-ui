<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <sla caption="SLA target answer time [s]" v-model="sla"></sla>
      <only-active v-model="onlyActive" caption="Show Only Active Queues"></only-active>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 151px; max-width: 151px; min-width: 151px">
            Queue Groups
          </td>
          <td class='table-sm table-header-group' style="width: 587px; max-width: 587px; min-width: 587px">
            Queue Group Activity Details
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields" :filter="hideEmpty" :sort-compare="sortCompareCustom">
      </b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import SLA from '@/Report/Input/SLA'
import OnlyActive from "@/Report/Input/OnlyActive"
import Common from '@/Report/Legacy/Common'
import Moment from 'moment'

export default {
  name: 'QueueGroupTrafficOverview',
  mixins: [Common],
  components: {
    'report': Report,
    'from-to': FromTo,
    'sla': SLA,
    'only-active': OnlyActive
  },
  data () {
    return {
      fields: {
        queue_group_id: {
          label: 'Queue Group Name',
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
      queues: [],
      reportFields: {
        name: 'Queue Group Traffic Overview',
        title: 'Queue Group Traffic Overview',
        timeRange: '-',
        sla: undefined
      },
      sessions: [],
      sla: 10,
      onlyActive: "false"
    }
  },
  methods: {
    query: async function () {
      this.reportFields.timeRange = this.formatTimeRange(this.fromTo.date_start, this.fromTo.date_end)
      this.reportFields.sla = this.sla
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let sla = this.sla * 1000
      let queueGroupIDs = this.queueGroups.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'traffic_overview_stats', [date_start, date_end, sla, 'queue_group_id', queueGroupIDs])
      this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.getQueueGroups()
      this.fromTo = {
        date_start: Moment().startOf('day').toDate(),
        date_end: Moment().toDate()
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
    getQueueGroups: async function () {
      this.queueGroups = await this.$agent.p_mfa('ws_agent', 'queue_groups')
    },
    findName (id) {
      let obj = this.queueGroups.find(v => { return v.id === id })
      return obj.name
    },
    addMissingRows () {
      this.queueGroups.forEach((obj) => {
        if (this.sessions.find(v => { return v.queue_group_id === obj.id}) === undefined) {
          this.sessions.push({ queue_group_id: obj.id })
        }
      })
    }
  },
  created () {
    this.getQueueGroups()
  }
}
</script>
