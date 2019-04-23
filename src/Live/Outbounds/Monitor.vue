<template>
<div>
  <div class="row">
    <div class="col"><h6>Live outbound calls</h6></div>
  </div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" size="sm" />
    </b-col>
  </b-row>
  <b-table
    style="margin-top:10px"
    small
    bordered
    hover
    head-variant=light
    thead-tr-class="table-header"
    tbody-tr-class="table-body"
    sort-by="time"
    :items="data"
    :fields="fields"
  >
    <template slot="time" slot-scope="data">
      {{durationFormatter(data.item.time)}}
    </template>
    <template slot="agent" slot-scope="data">
      {{data.item.agent.name}}
    </template>
    <template slot="line_out" slot-scope="data">
      {{data.item.line_out.name}}
    </template>
    <template slot="callee" slot-scope="data">
      {{data.item.call_vars['Caller-Callee-ID-Number']}} <{{data.item.call_vars['Caller-Callee-ID-Name']}}>
    </template>
    <template slot="caller" slot-scope="data">
      {{data.item.call_vars['Caller-Caller-ID-Number']}} <{{data.item.call_vars['Caller-Caller-ID-Name']}}>
    </template>
    <template slot="actions" slot-scope="data">
      <b-button size="sm" variant="danger" @click="hangup(data.item)" class="pointer">Hangup</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  mixins: [Base],
  name: 'live-outbounds-monitor',
  components: {
  },
  data () {
    return {
      type: 'group',
      types: ['group', 'acl'],
      fields: {
        state: { label: 'State', sortable: true },
        time: { label: 'Time', sortable: true },
        agent: { lavel: 'Agent', sortable: true },
        target: { lavel: 'Target', sortable: true },
        line_out: { label: 'Line Out', sortable: true },
        callee: { label: 'Callee', sortable: true },
        caller: { label: 'Caller', sortable: true },
        actions: { label: 'Actions' }
      },
    }
  },
  methods: {
    handleState ({state}) {
      let i = this.data.findIndex(E => E.uuid === state.uuid && E.record === state.record)
      if (state.state === 'terminate') {
        if (i >= 0) {
          this.data.splice(i, 1)
        }
      } else {
        if (i >= 0) {
          this.data.splice(i, 1, state)
        } else {
          this.data.push(state)
        }
      }
    },
    query: async function (type) {
      this.data = await this.$agent.p_mfa('ws_live', 'outgoings', [type])
      await this.$agent.p_mfa('ws_live', 'subscribe', ['outgoings', type])
    },
    onTimer () {
      this.data.forEach((E, i, Arr) => { 
        E.time = E.time + 1000
        Arr.splice(i, 1, E)
      })
    },
    hangup ({record, uuid}) {
      this.$agent.p_mfa('ws_supervisor', 'hangup', [record, uuid])
    },
  },
  created () {
    this.$bus.$on('live_outgoing_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('live_outgoing_state', this.handleState)
    this.$agent.p_mfa('ws_live', 'unsubscribe', ['outgoings', this.type])
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live', 'unsubscribe', ['outgoings', old])
      this.query(value)
    },
  }
}
</script>
