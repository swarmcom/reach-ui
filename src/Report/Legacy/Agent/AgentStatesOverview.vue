<template>
  <report v-bind="reportFields"
          v-on:apply="query"
          v-on:reset="reset">
    <div slot="input-controls">
      <timestamp v-model="ts"></timestamp>
    </div>
    <div slot="report">
      <table>
        <tr>
          <td class='table-sm table-header-group' style="width: 549px; max-width: 549px; min-width: 549px">
            Agent States at {{ formatedTs }}
          </td>
        </tr>
      </table>
      <b-table style="min-width: 6px; max-width: 6px; table-layout: fixed" small hover :items="sessions" :fields="fields">
      </b-table>
    </div>
  </report>
</template>

<script>
  import Report from '@/Report/Legacy/Report'
  import Ts from '@/Report/Input/Ts'
  import Moment from 'moment'

  export default {
    name: 'AgentStatesOverview',
    components: {
      'report': Report,
      'timestamp': Ts
    },
    data () {
      return {
        fields: {
          agent_id: {
            label: 'Name',
            tdClass: 'table-body-blue',
            thClass: 'table-header',
            thStyle: {width: '123px'}
          },
          login: {
            label: 'Login',
            tdClass: 'table-body-blue-last-in-group',
            thClass: 'table-header-last-in-group',
            thStyle: {width: '123px'}
          },
          state_from: {
            label: 'State',
            tdClass: ['table-body-green-last-in-group', 'text-align-right'],
            thClass: ['table-header-last-in-group', 'text-align-right'],
            thStyle: {width: '303px'},
            formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
          }
        },
        ts: Moment().format(),
        reportFields: {
          name: 'Agent States Overview',
          title: 'Agent States Overview',
          time: undefined
        },
        sessions: []
      }
    },
    computed: {
      formatedTs: function () {
        return new Moment(this.ts).format("YYYY-MM-DD HH:mm:ss")
      }
    },
    methods: {
      query: async function () {
        this.setReportFields()
        let time = Moment(this.ts).unix()
        this.sessions = await this.$agent.p_mfa('ws_report', 'agent_states_for_ts', [time, []])
      },
      reset () {
        this.sessions = []
        this.ts = Moment().format()
      },
      setReportFields() {
        //this.reportFields.from = new Moment(this.fromTo.date_start).format('LL')
        //this.reportFields.to = new Moment(this.fromTo.date_end).format('LL')
      }
    }
  }
</script>



