<template>
  <report v-bind="reportFields"
          v-on:apply="query"
          v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <sla v-model="sla"></sla>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 151px; max-width: 151px; min-width: 151px">
            Queues
          </td>
          <td class='table-sm table-header-group' style="width: 649px; max-width: 649px; min-width: 649px">
            Queue Activity Details
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions"
               :fields="fields">
        <template slot="abandoned_percent" slot-scope="data">
          {{ (100*data.item.abandoned/data.item.call_count).toFixed(1) }}%
        </template>
      </b-table>
    </div>
  </report>
</template>

<script>
  import Report from '@/Report/Legacy/Report'
  import FromTo from '@/Report/Input/FromTo'
  import SLA from '@/Report/Input/SLA'
  import Moment from 'moment'

  export default {
    components: {
      'report': Report,
      'from-to': FromTo,
      'sla': SLA
    },
    data () {
      return {
        fields: {
          queue_id: {
            label: 'Queue Name',
            tdClass: 'table-body-blue-last-in-group',
            thClass: 'table-header-last-in-group',
            thStyle: {width: '151px'},
            sortable: true
          },
          call_count: {
            label: 'Total Calls Offered',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          ring_count: {
            label: 'Offered to Agent',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          answered_count: {
            label: 'Answered by Agent',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          voicemail: {
            label: 'Sent to Voicemail',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          transferred_out: {
            label: 'Transferred Out',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          abandoned: {
            label: 'Total Abandoned',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          sla_count: {
            label: 'SLA',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          abandoned_percent: {
            label: 'Abandoned [%]',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            sortable: true
          },
          cpt: {
            label: 'CPT',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '73px'},
            sortable: true,
            formatter: v => new Moment(v, "x").format("mm:ss")
          },
          asa: {
            label: 'ASA',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            formatter: v => new Moment(v, "x").format("mm:ss"),
            thStyle: {width: '70px'}
          }
        },
        fromTo: {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format(),
        },
        reportFields: {
          name: 'Queue Traffic Overview',
          title: 'Queue Traffic Overview',
          from: undefined,
          to: undefined,
          sla: undefined
        },
        sessions: [],
        sla: 10
      }
    },
    methods: {
      query: async function () {
        this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
        this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
        this.reportFields.sla = this.sla
        let qry = {}
        qry.date_start = Moment(this.fromTo.date_start).unix()
        qry.date_end = Moment(this.fromTo.date_end).unix()
        qry.group_by = 'queue_id'
        qry.sla = this.sla * 1000
        this.sessions = await this.$agent.p_mfa('ws_report', 'traffic_overview_stats', [qry])
      },
      reset () {
        this.fromTo = {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format()
        }
        this.sla = 10
      }
    }
  }
</script>

