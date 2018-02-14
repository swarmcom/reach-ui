<template>
  <report v-bind="reportFields" v-on:apply="query" v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
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
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields">
        <template slot="answered_percent" slot-scope="data">
          {{ (100*data.item.answered/data.item.placed).toFixed(1) }}%
        </template>
      </b-table>
    </div>
  </report>
</template>

<script>
import Report from '@/Report/Legacy/Report'
import FromTo from '@/Report/Input/FromTo'
import Moment from 'moment'

export default {
  components: {
    'report': Report,
    'from-to': FromTo
  },
  data () {
    return {
      fields: {
        client_id: {
          label: 'Client Name',
          tdClass: 'table-body-blue-last-in-group',
          thClass: 'table-header-last-in-group',
          thStyle: { width: '151px' },
          sortable: true
        },
        placed: {
          label: 'Placed Calls',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true
        },
        answered: {
          label: 'Answered',
          tdClass: ['table-body-green', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true
        },
        answered_percent: {
          label: 'Answered [%]',
          tdClass: ['table-body-orange', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true
        },
        avg_talk_time: {
          label: 'Average Talk Time',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true,
          formatter: v => new Moment(v, "x").format("mm:ss")
        },
        total_talk_time: {
          label: 'Total Talk Time',
          tdClass: ['table-body-blue', 'text-align-right'],
          thClass: 'table-header',
          thStyle: { width: '80px' },
          sortable: true,
          formatter: v => new Moment(v, "x").format("mm:ss"),
        }
      },
      fromTo: {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format(),
      },
      reportFields: {
        name: 'Outbound Traffic Overview by Client',
        title: 'Outbound Traffic Overview by Client',
        from: undefined,
        to: undefined
      },
      sessions: []
    }
  },
  methods: {
    query: async function () {
      this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
      this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
      let qry = {}
      qry.date_start = Moment(this.fromTo.date_start).unix()
      qry.date_end = Moment(this.fromTo.date_end).unix()
      qry.group_by = 'client_id'
      this.sessions = await this.$agent.p_mfa('ws_report', 'outbound_traffic_stats', [qry])
    },
    reset () {
      this.fromTo = {
        date_start: Moment().subtract(1, 'days').format(),
        date_end: Moment().format()
      }
    }
  }
}
</script>
