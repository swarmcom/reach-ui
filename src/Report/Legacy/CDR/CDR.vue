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
          <td class='table-sm table-header-group' style="width: 313px; max-width: 313px; min-width: 313px">
            Call Identification
          </td>
          <td class='table-sm table-header-group' style="width: 868px; max-width: 868px; min-width: 868px">
            Call Details
          </td>
          <td class='table-sm table-header-group' style="width: 322px; max-width: 322px; min-width: 322px">
            Timestamps
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions"
               :fields="fields" tbody-tr-class="pointer" @row-clicked="click">
        <template slot="ts_ms" slot-scope="data">
          {{ data.value }}
        </template>
        <template slot="state_total" slot-scope="data">
          {{ format_ms(data.item.states.total) }}
        </template>
        <template slot="state_inqueue" slot-scope="data">
          {{ format_ms(data.item.states.states.inqueue) }}
        </template>
        <template slot="queue" slot-scope="data">
          {{ data.item.queue.name }}
        </template>
        <template slot="state_agent" slot-scope="data">
          {{ format_ms(data.item.states.states.agent) }}
        </template>
        <template slot="state_oncall" slot-scope="data">
          {{ format_ms(data.item.states.states.oncall) }}
        </template>
        <template slot="line_in" slot-scope="data">
          {{ maybe_name(data.item.line_in) }}
        </template>
        <template slot="client" slot-scope="data">
          {{ maybe_name(data.item.client) }}
        </template>
        <template slot="agent_login" slot-scope="data">
          {{ data.item.agent.login }}
        </template>
        <template slot="agent_name" slot-scope="data">
          {{ data.item.agent.name }}
        </template>
        <template slot="caller_ip" slot-scope="data">
          {{ data.item.caller_ip }}
        </template>
        <template slot="caller" slot-scope="data">
          {{ data.item.caller }}
        </template>
        <template slot="calling" slot-scope="data">
          {{ data.item.calling }}
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
    name: 'report-CDR',
    components: {
      'report': Report,
      'from-to': FromTo
    },
    data () {
      return {
        fields: {
          uuid: {label: 'Call ID', tdClass: 'table-body-green', thClass: 'table-header', thStyle: {width: '113px'}},
          segment: {label: 'Segment', tdClass: 'table-body-green', thClass: 'table-header', thStyle: {width: '45px'}},
          last_segment: {
            label: 'Last Segment',
            tdClass: 'table-body-green',
            thClass: 'table-header',
            thStyle: {width: '45px'}
          },
          direction: {
            label: 'Direction',
            tdClass: 'table-body-green',
            thClass: 'table-header',
            thStyle: {width: '55px'}
          },
          media: {
            label: 'Media Type',
            tdClass: 'table-body-green-last-in-group',
            thClass: 'table-header-last-in-group',
            thStyle: {width: '55px'}
          },

          queue_group: {
            label: 'Queue Group',
            tdClass: 'table-body-orange',
            thClass: 'table-header',
            thStyle: {width: '80px'}
          },
          queue: {label: 'Queue', tdClass: 'table-body-orange', thClass: 'table-header', thStyle: {width: '90px'}},
          calling: {
            label: 'Called Number / Queue',
            tdClass: 'table-body-orange',
            thClass: 'table-header',
            thStyle: {width: '90px'}
          },
          agent_login: {
            label: 'Agent Login',
            tdClass: 'table-body-orange',
            thClass: 'table-header',
            thStyle: {width: '50px'}
          },
          agent_name: {
            label: 'Agent Name',
            tdClass: 'table-body-orange',
            thClass: 'table-header',
            thStyle: {width: '83px'}
          },
          ended: {label: 'Ended By', tdClass: 'table-body-orange', thClass: 'table-header', thStyle: {width: '56px'}},
          disposition: {
            label: 'Disposition',
            tdClass: 'table-body-orange',
            thClass: 'table-header',
            thStyle: {width: '83px'}
          },
          agent_disposition: {
            label: 'Agent Disposition',
            tdClass: 'table-body-orange',
            thClass: 'table-header',
            thStyle: {width: '83px'}
          },
          //line_in: { label: 'Line In', tdClass: 'table-body-orange', thClass: 'table-header' },
          client: {
            label: 'Client',
            tdClass: 'table-body-orange-dark',
            thClass: 'table-header',
            thStyle: {width: '83px'}
          },
          caller: {
            label: 'Endpoint ANI',
            tdClass: 'table-body-orange-dark',
            thClass: 'table-header',
            thStyle: {width: '83px'}
          },
          caller_ip: {
            label: 'Originating Caller ID',
            tdClass: 'table-body-orange-dark-last-in-group',
            thClass: 'table-header-last-in-group',
            thStyle: {width: '87px'}
          },
          ts_ms: {
            label: 'Offered to Reach',
            sortable: true,
            formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm:ss"),
            tdClass: "table-body-blue",
            thClass: ['table-header'],
            thStyle: {width: '80px'}
          },
          state_inqueue: {label: 'Inqueue', tdClass: 'table-body-blue', thClass: 'table-header'},
          state_agent: {label: 'Agent', tdClass: 'table-body-blue', thClass: 'table-header'},
          state_oncall: {label: 'CPT', tdClass: 'table-body-blue', thClass: 'table-header'},
          state_total: {label: 'Total Call Duration', tdClass: 'table-body-blue', thClass: 'table-header'}
        },
        fromTo: {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format(),
        },
        reportFields: {
          name: 'CDR',
          title: 'CDR',
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
        this.sessions = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [qry])
      },
      reset () {
        this.fromTo = {
          date_start: Moment().subtract(1, 'days').format(),
          date_end: Moment().format()
        }
      },
      click ({uuid}) {
        this.$router.push(`/report/events/inqueue/${uuid}`)
      },
      format_ms (ms) {
        if (Number.isInteger(ms)) {
          return (ms / 1000).toFixed(1)
        } else {
          return ""
        }
      },
      maybe_name (item) {
        if (typeof item === 'object') {
          return item.name
        } else {
          return ''
        }
      }
    }
  }
</script>

