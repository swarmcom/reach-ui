<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <interval v-model="interval" :min_value="1"></interval>
      <entity-selector v-model="queues" :query=queuesQuery entity="Queues"></entity-selector>
      <sla caption="SLA target answer time [s]" v-model="sla"></sla>
      <sla caption="Voicemail SLA target answer time [s]" v-model="vmSla"></sla>
      <only-active v-model="onlyActive" caption="Show Only Intervals with Activity"></only-active>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 210px; max-width: 210px; min-width: 210px">
            Intervals {{reportFields.interval}} min
          </td>
          <td class='table-sm table-header-group' style="width: 649px; max-width: 649px; min-width: 649px">
            Voicemail Activity Details
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
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import EntitySelector from '@/Report/Input/EntitySelector'
import SLA from '@/Report/Input/SLA'
import Interval from '@/Report/Input/Interval'
import OnlyActive from '@/Report/Input/OnlyActive'
import Moment from 'moment'

export default {
  name: 'VoicemailDetail',
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
        vm_left: {
          label: 'Total Queued',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: v => (v !== undefined) ? v : 0
        },
        vm_answered: {
          label: 'Answered by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_left !== undefined) ? v : 'NA'
        },
        vm_callback_placed: {
          label: 'Returned by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_answered !== undefined) ? v : 'NA'
        },
        returned_percent: {
          label: '% Returned by Agent',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_answered !== undefined && item.vm_answered !== 0) ? (100*item.vm_callback_placed/item.vm_answered).toFixed(1)+'%' : 'NA'

        },
        vm_callback_answered: {
          label: 'Answered by Caller',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_callback_placed !== undefined) ? v : 'NA'
        },
        answered_caller_percent: {
          label: '% Answered by Caller',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_answered !== undefined && item.vm_answered !== 0) ? (100*item.vm_callback_answered/item.vm_answered).toFixed(1)+'%' : 'NA'
        },
        sla_count: {
          label: 'SLA',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_answered !== undefined) ? v : 'NA'
        },
        vm_sla_count: {
          label: 'Voicemail SLA',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '63px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_callback_placed !== undefined) ? v : 'NA'
        },
        asa: {
          label: 'ASA',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '73px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_answered !== undefined) ? this.durationFormatter(v) : 'NA'
        },
        avg_time_to_callback: {
          label: 'Avg. Time to Callback',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '70px' },
          sortable: true,
          formatter: (v, _, item) => (item.vm_callback_placed !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      queues: [],
      reportFields: {
        name: 'Voicemail Detail',
        title: 'Voicemail Detail',
        from: undefined,
        to: undefined,
        sla: undefined,
        vmSla: undefined
      },
      sessions: [],
      onlyActive: 'false',
      sla: 10,
      vmSla: 10,
      interval: 60,
      queuesQuery: function () {
        return this.$agent.p_mfa('ws_agent', 'queues')
      }      
    }
  },
  methods: {
    query: async function () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
      this.reportFields.interval = this.interval
      let date_start = Moment(this.fromTo.date_start).unix()
      let date_end = Moment(this.fromTo.date_end).unix()
      let interval = this.interval * 60
      let sla = this.sla * 1000
      let vmSla = this.vmSla * 1000
      let queuesIDs = this.queues.map(obj => obj.id)
      this.sessions = await this.$agent.p_mfa('ws_report', 'vm_details_stats', [date_start, date_end, interval, sla, vmSla, queuesIDs])
    },
    reset () {
      this.sessions = []
      this.queues = []
      this.fromTo = {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format()
      }
      this.onlyActive = 'false'
      this.sla = 10
      this.vmSla = 10
      this.interval = 60
    },
    hideEmpty (item) {
      if (this.onlyActive === 'false') return true
      else {
        if (item.vm_left === 0 || item.vm_left === undefined) return false
        else return true
      }
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  }
}
</script>
