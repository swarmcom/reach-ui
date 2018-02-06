<template>
  <report v-bind="reportFields"
          v-on:apply="query"
          v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
      <interval v-model="interval"></interval>
      <sla v-model="sla"></sla>
      <only-active v-model="onlyActive"></only-active>
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
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields" :filter="hideEmpty">
        <template slot="abandoned_percent" slot-scope="data">
          {{ (data.item.call_count != 0) ? (100*data.item.abandoned/data.item.call_count).toFixed(1)+'%' : 'NA' }}
        </template>
      </b-table>
    </div>
  </report>
</template>

<script>
  import Report from '@/Report/Legacy/Report'
  import FromTo from '@/Report/Input/FromTo'
  import SLA from '@/Report/Input/SLA'
  import Interval from '@/Report/Input/Interval'
  import OnlyActive from '@/Report/Input/OnlyActive'
  import Moment from 'moment'

  export default {
    components: {
      'report': Report,
      'from-to': FromTo,
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
            thStyle: {width: '103px'},
            formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm"),
          },
          ts_to: {
            label: 'To',
            tdClass: 'table-body-blue-last-in-group',
            thClass: 'table-header-last-in-group',
            thStyle: {width: '107px'},
            formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm"),
          },
          call_count: {
            label: 'Total Calls Offered',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          ring_count: {
            label: 'Offered to Agent',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          answered_count: {
            label: 'Answered by Agent',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          voicemail: {
            label: 'Sent to Voicemail',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          transferred_out: {
            label: 'Transferred Out',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          abandoned: {
            label: 'Total Abandoned',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          sla_count: {
            label: 'SLA',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          abandoned_percent: {
            label: 'Abandoned [%]',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
          },
          cpt: {
            label: 'CPT',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '73px'},
            formatter: v => v ? new Moment(v, "x").format("mm:ss") : 'NA'

          },
          asa: {
            label: 'ASA',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '70px'},
            formatter: v => v ? new Moment(v, "x").format("mm:ss") : 'NA'
          }
        },
        fromTo: {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format(),
        },
        reportFields: {
          name: 'Client Traffic Detail',
          title: 'Client Traffic Detail',
          from: undefined,
          to: undefined,
          interval: undefined,
          sla: undefined
        },
        sessions: [],
        onlyActive: 'false',
        sla: 10,
        interval: 60
      }
    },
    methods: {
      query: async function () {
        this.setReportFields()
        let qry = {}
        qry.date_start = Moment(this.fromTo.date_start).unix()
        qry.date_end = Moment(this.fromTo.date_end).unix()
        qry.interval = this.interval * 60
        qry.sla = this.sla * 1000
        this.sessions = await this.$agent.p_mfa('ws_report', 'traffic_details_stats', [qry])
      },
      reset () {
        this.sessions = []
        this.fromTo = {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format()
        }
        this.onlyActive ='false'
        this.sla = 10
        this.interval = 60
      },
      hideEmpty(item) {
        if (this.onlyActive === 'false') return true
        else {
          if (item.call_count === 0)
            return false
          else
            return true
        }
      },
      setReportFields() {
        this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
        this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
        this.reportFields.interval = this.interval
      }
    }
  }
</script>
