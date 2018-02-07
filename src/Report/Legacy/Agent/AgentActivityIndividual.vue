<template>
  <report v-bind="reportFields"
          v-on:apply="query"
          v-on:reset="reset">
    <div slot="input-controls">
      <from-to v-model="fromTo"></from-to>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 187px; max-width: 187px; min-width: 187px">
            Agent
          </td>
          <td class='table-sm table-header-group' style="width: 319px; max-width: 319px; min-width: 319px">
            Inbound Activity
          </td>
          <td class='table-sm table-header-group' style="width: 256px; max-width: 256px; min-width: 256px">
            Outbound Activity
          </td>
          <td class='table-sm table-header-group' style="width: 128px; max-width: 128px; min-width: 128px">
            Total Activity
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields">
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
  import Moment from 'moment'

  export default {
    name: 'AgentActivityIndividual',
    components: {
      'report': Report,
      'from-to': FromTo
    },
    data () {
      return {
        fields: {
          id: {
            label: 'Name',
            tdClass: 'table-body-blue',
            thClass: 'table-header',
            thStyle: {width: '120px'}
          },
          login: {
            label: 'Login',
            tdClass: 'table-body-blue-last-in-group',
            thClass: 'table-header-last-in-group',
            thStyle: {width: '67px'}
          },
          in_answered: {
            label: 'Total Calls',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? v : 0
          },
          in_talk_time: {
            label: 'Total Time',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? Moment(v, "x").format("mm:ss") : Moment(0, "x").format("mm:ss")
          },
          in_completed: {
            label: 'Completed Calls',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? v : 0
          },
          in_transferred: {
            label: 'Transferred Calls',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? v : 0
          },
          in_avg_hold_time: {
            label: 'Avg. Hold Time',
            tdClass: ['table-body-green-last-in-group', 'text-align-right'],
            thClass: 'table-header-last-in-group',
            thStyle: {width: '67px'},
            formatter: v => v ? new Moment(v, "x").format("mm:ss") : 'NA'
          },
          out_started: {
            label: 'Started Calls',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? v : 0
          },
          out_placed: {
            label: 'Sent Calls',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? v : 0
          },
          out_answered: {
            label: 'Answered Calls',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? v : 0
          },
          out_talk_time: {
            label: 'Total Time',
            tdClass: ['table-body-green-last-in-group', 'text-align-right'],
            thClass: 'table-header-last-in-group',
            thStyle: {width: '67px'},
            formatter: v => v ? Moment(v, "x").format("mm:ss") : Moment(0, "x").format("mm:ss")

          },
          total_calls: {
            label: 'Total Calls',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? v : 0
          },
          total_talk_time: {
            label: 'Total Time',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => v ? Moment(v, "x").format("mm:ss") : Moment(0, "x").format("mm:ss")
          }
        },
        fromTo: {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format(),
        },
        reportFields: {
          name: 'Agent Activity Individual',
          title: 'Agent Activity Individual',
          from: undefined,
          to: undefined
        },
        sessions: []
      }
    },
    methods: {
      query: async function () {
        this.setReportFields()
        let qry = {}
        qry.date_start = Moment(this.fromTo.date_start).unix()
        qry.date_end = Moment(this.fromTo.date_end).unix()
        qry.group_by = 'agent_id'
        this.sessions = await this.$agent.p_mfa('ws_report', 'agent_activity_stats', [qry])
      },
      reset () {
        this.sessions = []
        this.fromTo = {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format()
        }
      },
      setReportFields() {
        this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
        this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
      }
    }
  }
</script>
