<template>
  <b-container fluid style="margin-left: unset; margin-right: unset; padding-left: 0; padding-right: 0">
    <b-row style="width: 100%; margin-left: unset; margin-right: unset">
      <b-col style="width: 20%; padding: 0px 2px 0px 0px;">
        <table style="width: 100%;">
          <tr>
            <td class='report-headers' style="width: 100%; max-width: 100%; min-width: 100%">
              Input Controls
            </td>
          </tr>
          <tr>
            <td style="padding: 15px;">
              <from-to v-model="query_params" :from="initFrom" :to="initTo"></from-to>
            </td>
          </tr>
        </table>
      </b-col>
      <b-col style="width: 80%; padding: unset;">
        <table style="width: 100%;">
          <tr>
            <td class='report-headers' style="width: 100%; max-width: 100%; min-width: 100%">
              Report: CDR
            </td>
          </tr>
        </table>
        <div style="overflow-x: auto; margin: 15px">
          <table style="margin-bottom: 3px">
            <tr>
              <td class='report-title' style="width: 100%">
                CDR
              </td>
            </tr>
            <tr>
              <td class='datetime-info' style="width: 100%">
                {{from}} - {{to}}
              </td>
            </tr>
            <tr style="margin-bottom: 7px">
              <td class='timezone-info' style="width: 100%">
                Time zone: GMT
              </td>
            </tr>
          </table>
          <tr>
            <td class='table-sm table-header-group' style="width: 317px; max-width: 317px; min-width: 317px">
              Call Identification
            </td>
            <td class='table-sm table-header-group' style="width: 868px; max-width: 868px; min-width: 868px">
              Call Details
            </td>
            <td class='table-sm table-header-group' style="width: 323px; max-width: 323px; min-width: 323px">
              Timestamps
            </td>
          </tr>
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
            <template slot="player" slot-scope="data">
              <player v-if="data.item.keep_record" :href="data.item.call_record_path"></player>
            </template>
          </b-table>
        </div>
      </b-col>

    </b-row>
  </b-container>
</template>

<script>
  import FromTo from '@/Report/Input/FromTo'
  import Moment from 'moment'

  export default {
    name: 'report-CDR',
    components: {'from-to': FromTo},
    data () {
      return {
        query_params: {},
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
          //player: { label: ' ', tdClass: 'table-body-orange-last-in-group', thClass: 'table-header-last-in-group' },

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
        sessions: [],
        initFrom: Moment().subtract(3, 'days').format(),
        initTo: Moment().format()
      }
    },
    computed: {
      from: function () {
        return new Moment(this.query_params.date_start * 1000, "x").format('LL')
      },
      to: function () {
        return new Moment(this.query_params.date_end * 1000, "x").format('LL')
      }
    },
    methods: {
      query: async function (params) {
        this.sessions = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [params])
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
      },
      more: async function () {
        let params = this.query_params
        let session = this.sessions[this.sessions.length - 1]
        params.date_end = parseInt(session.ts / 1000)
        let more = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [params])
        this.sessions = this.sessions.concat(more)
      }
    },
    created () {
      this.query_params.date_start = Moment(this.initFrom).unix()
      this.query_params.date_end = Moment(this.initTo).unix()
      this.query(this.query_params)
    },
    watch: {
      query_params (value) {
        this.query(value)
        return value
      }
    }
  }
</script>

<style lang="scss">
  @import "../reports.scss";
</style>
