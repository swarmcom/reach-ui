<template>
<div>
  <div class="row">
    <div class="col"><h3>Live outbound calls</h3></div>
  </div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" />
    </b-col>
  </b-row>
  <b-table style="margin-top:10px" small striped hover :items="data" :fields="fields">
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
      type: 'acl',
      types: ['acl', 'group'],
      fields: {
        state: { label: 'State' },
        time: { label: 'Time' },
        agent: { lavel: 'Agent' },
        target: { lavel: 'Target' },
        line_out: { label: 'Line Out' },
        callee: { label: 'Callee' },
        caller: { label: 'Caller' },
        actions: { label: 'Actions' }
      },
    }
  },
  methods: {
    handleState ({state}) {
      let i = this.data.findIndex(E => E.uuid === state.uuid)
      if (i >= 0) {
        if (state.state === 'terminate') {
          this.data.splice(i, 1)
        } else {
          this.data.splice(i, 1, state)
        }
      } else {
        this.data.push(state)
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
