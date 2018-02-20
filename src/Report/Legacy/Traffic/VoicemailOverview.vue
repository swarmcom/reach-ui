<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <sla v-model="sla"></sla>
      <only-active v-model="onlyActive" caption="Show Only Active Queues"></only-active>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 151px; max-width: 151px; min-width: 151px">
            Queues
          </td>
          <td class='table-sm table-header-group' style="width: 649px; max-width: 649px; min-width: 649px">
            Voicemail Activity Details
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

export default {
  name: 'VoicemailOverview',
  components: {
    'report': Report,
    'from-to': FromTo,
    'sla': SLA,
    'only-active': OnlyActive
  },
  data () {
    return {
      fields: {
        queue_id: {
          label: 'Queue Name',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '151px' },
          sortable: true,
          formatter: v => this.findName(v)
        },
        call_count: {
          label: 'Total Queued',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: v => (v !== undefined) ? v : 0
        },
        answered: {
          label: 'Answered by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        returned: {
          label: 'Returned by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.ring_count !== undefined) ? v : 'NA'
        },
        returned_percent: {
          label: '% Returned by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        answered_caller: {
          label: 'Answered by Caller',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? v : 'NA'
        },
        answered_caller_percent: {
          label: '% Answered by Caller',
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
        sla_voicemail: {
          label: 'Voicemail SLA',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined && item.call_count !== 0) ? (100*item.abandoned/item.call_count).toFixed(1)+'%' : 'NA'
        },
        asa: {
          label: 'ASA',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '73px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        },
        avg_time_to_callback: {
          label: 'Avg. Time to Callback',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '70px' },
          sortable: true,
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      queues: [],
      reportFields: {
        name: 'Voicemail Overview',
        title: 'Voicemail Overview',
        from: undefined,
        to: undefined,
        sla: undefined
      },
      sessions: [],
      sla: 10,
      onlyActive: "false"
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
      let slaVM = this.sla * 1000
      let queuesIDs = this.queues.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'vm_overview_stats', [date_start, date_end, sla, slaVM, queuesIDs])
      this.addMissingRows()
    },
    reset () {
      this.sessions = []
      this.getQueues()
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
    getQueues: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'queues')
    },
    findName (id) {
      let obj = this.queues.find(v => { return v.id === id })
      return obj.name
    },
    addMissingRows () {
      this.queues.forEach((obj) => {
        if (this.sessions.find(v => { return v.queue_id === obj.id}) === undefined) {
          this.sessions.push({ queue_id: obj.id })
        }
      })
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  },
  created () {
    this.getQueues()
  }
}
</script>
