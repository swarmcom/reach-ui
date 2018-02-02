<template>
  <b-container fluid style="margin-left: unset; margin-right: unset; padding-left: 0; padding-right: 0; margin-top: 15px">
    <b-row style="width: 100%; margin-left: unset; margin-right: unset">
      <b-col style="width: 20%; max-width: 20%; padding: 0px 2px 0px 0px;">
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
              Report: Outbound Overview by Client
            </td>
          </tr>
        </table>
        <div style="overflow-x: auto; margin: 15px">
          <table style="margin-bottom: 3px">
            <tr>
              <td class='report-title' style="width: 100%">
                Outbound Overview by Client
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
            <td class='table-sm table-header-group' style="width: 155px; max-width: 155px; min-width: 155px">
              Clients
            </td>
            <td class='table-sm table-header-group' style="width: 402px; max-width: 402px; min-width: 402px">
              Outbound Activity
            </td>
          </tr>
          <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields">
            <template slot="answered_percent" slot-scope="data">
              {{ (100*data.item.answered/data.item.placed).toFixed(1) }}%
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
    name: 'OutboundOverviewByClient',
    components: {'from-to': FromTo},
    data () {
      return {
        query_params: {},
        fields: {
          client_id: {
            label: 'Client Name',
            tdClass: 'table-body-blue-last-in-group',
            thClass: 'table-header-last-in-group',
            thStyle: {width: '151px'},
            sortable: true
          },
          placed: {
            label: 'Placed Calls',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '80px'},
            sortable: true
          },
          answered: {
            label: 'Answered',
            tdClass: ['table-body-green', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '80px'},
            sortable: true
          },
          answered_percent: {
            label: 'Answered [%]',
            tdClass: ['table-body-orange', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '80px'},
            sortable: true
          },
          avg_talk_time: {
            label: 'Average Talk Time',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '80px'},
            sortable: true,
            formatter: v => new Moment(v, "x").format("mm:ss")
          },
          total_talk_time: {
            label: 'Total Talk Time',
            tdClass: ['table-body-blue', 'text-align-right'],
            thClass: 'table-header',
            thStyle: {width: '80px'},
            sortable: true,
            formatter: v => new Moment(v, "x").format("mm:ss"),
          }
        },
        sessions: [],
        initFrom: Moment().subtract(1, 'days').format(),
        initTo: Moment().format(),
        initSLA: 10
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
        this.sessions = await this.$agent.p_mfa('ws_report', 'outbound_traffic_stats', [params])
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
      this.query_params.group_by = 'client_id'
      this.query(this.query_params)
    },
    watch: {
      query_params (value) {
        let qry = {}
        qry.date_start = value.date_start
        qry.date_end = value.date_end
        qry.group_by = 'client_id'
        this.query(qry)
        return qry
      }
    }
  }
</script>

<style lang="scss">
  @import "../../reports";
</style>
