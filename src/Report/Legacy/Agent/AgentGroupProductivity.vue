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
          <td class='table-sm table-header-group' style="width: 383px; max-width: 383px; min-width: 383px">
            Agent Group Information
          </td>
          <td class='table-sm table-header-group' style="width: 286px; max-width: 286px; min-width: 286px">
            Log In/Out
          </td>
          <td class='table-sm table-header-group' style="width: 506px; max-width: 506px; min-width: 506px">
            Logged In Time Breakdown
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
  import momentDurationFormatSetup from 'moment-duration-format'

  export default {
    name: 'AgentGroupProductivity',
    components: {
      'report': Report,
      'from-to': FromTo
    },
    data () {
      return {
        fields: {
          id: {
            label: 'Group Name',
            tdClass: 'table-body-blue',
            thClass: 'table-header',
            thStyle: {width: '143px'}
          },
          agents_in_grp: {
            label: 'Number of Agents',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
            //formatter: v => v ? v+' %' : 0+' %'
          },
          total_avail_time: {
            label: 'Total Avail. Time',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'}
            //formatter: v => v ? v+' %' : 0+' %'
          },
          occupancy: {
            label: 'Occupancy',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '55px'},
            formatter: v => v ? v+' %' : 0+' %'
          },
          cpt: {
            label: 'CPT (M:S)',
            tdClass: ['table-body-blue-last-in-group', 'text-align-right'],
            thClass: 'table-header-last-in-group',
            thStyle: {width: '59px'},
            formatter: v => v ? new Moment(v, "x").format("mm:ss") : 'NA'
          },
          first_from_state: {
            label: 'First Login',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '80px'},
            formatter: (v, _, item) => (v === 'init') ? Moment(item.first_event_ts, "x").format("YYYY-MM-DD HH:mm:ss") : "outside of interval"
          },
          last_state: {
            label: 'Last Logout',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '80px'},
            formatter: (v, _, item) => (v === 'terminate') ? Moment(item.last_event_ts, "x").format("YYYY-MM-DD HH:mm:ss") : "outside of interval"
          },
          total_time: {
            label: 'Logged In',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          logged_out: {
            label: 'Logged Out',
            tdClass: ['table-body-green-last-in-group', 'text-align-right'],
            thClass: 'table-header-last-in-group',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          released: {
            label: 'Released',
            tdClass: ['table-body-orange-dark', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          available: {
            label: 'Available',
            tdClass: ['table-body-orange-dark', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          idle: {
            label: 'Idle',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          ringing: {
            label: 'Ringing',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)

          },
          talk: {
            label: 'Inbound Talk',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          wrapup: {
            label: 'Wrap Up',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          out_talk: {
            label: 'Outbound Talk',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          },
          other: {
            label: 'Other',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '63px'},
            formatter: v => this.durationFormatter(v)
          }
        },
        fromTo: {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format(),
        },
        reportFields: {
          name: 'Agent Group Productivity',
          title: 'Agent Group Productivity',
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
        qry.group_by = 'group_id'
        this.sessions = await this.$agent.p_mfa('ws_report', 'agent_productivity_stats', [qry])
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
      },
      durationFormatter(v) {
        return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", {forceLength: true})
      }
    }
  }
</script>


