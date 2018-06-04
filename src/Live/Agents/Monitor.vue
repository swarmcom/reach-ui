<template>
<div>
  <b-row>
    <b-col><h3>Live agents by {{type}}</h3></b-col>
  </b-row>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" />
    </b-col>
  </b-row>
  <b-table small striped hover :items="data" :fields="fields">
    <template slot="login" slot-scope="data">
      {{ data.item.agent.login }}
    </template>
    <template slot="session_time" slot-scope="data">
      {{ durationFormatter(data.item.age) }}
    </template>
    <template slot="time" slot-scope="data">
      {{ durationFormatter(data.item.time) }}
    </template>
    <template slot="actions" slot-scope="data">
      <b-button v-if="data.item.state == 'release'" size="sm" variant="warning" @click="available(data.item)" class="pointer">Available</b-button>
      <b-button v-else size="sm" variant="primary" @click="release(data.item)" class="pointer">Release</b-button>
      <b-button size="sm" variant="danger" @click="stop(data.item)" class="pointer">Kill</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  mixins: [Base],
  name: 'live-agents-monitor',
  data () {
    return {
      type: 'group',
      types: ['group', 'acl', 'skills'],
      fields: {
        login: { label: 'Login' },
        session_time: { label: 'Session Time' },
        state: { label: 'State' },
        time: { label: 'State Time' },
        ws_peer: { label: 'Peer' },
        actions: { label: 'Actions' }
      },
    }
  },
  methods: {
    handleState ({ tag, state }) {
      state.time = 0
      if (tag === 'ws_login') {
        let i = this.data.findIndex(E => E.agent_id === state.agent_id)
        if (i >= 0) {
          this.data.splice(i, 1, state)
        } else {
          this.data.push(state)
        }
      }
      else if (state.state === 'terminate') {
        let i = this.data.findIndex(E => E.agent_id === state.agent_id)
        if (i >= 0) {
          this.data.splice(i, 1)
        }
      }
      else {
        let i = this.data.findIndex(E => E.agent_id === state.agent_id)
        if (i >= 0) {
          this.data.splice(i, 1, state)
        }
      }
    },
    query: async function (type) {
      this.data = await this.$agent.p_mfa('ws_live', 'agents', [type])
      await this.$agent.p_mfa('ws_live', 'subscribe', ['agents', type])
      this.saveCache()
    },
    onTimer () {
      this.data.forEach((E, i, A) => {
        E.time = E.time + 1000
        E.age = E.age + 1000
        A.splice(i, 1, E)
      })
    },
    onClick (data) {
      this.$router.push(`/agent/${data.agent_id}`)
    },
    release (agent) {
      this.$agent.mfa('ws_supervisor', 'release', [agent.agent_id])
    },
    available (agent) {
      this.$agent.mfa('ws_supervisor', 'available', [agent.agent_id])
    },
    stop (agent) {
      this.$agent.mfa('ws_supervisor', 'stop', [agent.agent_id])
    },
  },
  created () {
    this.$bus.$on('live_agent_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('live_agent_state', this.handleState)
    this.$agent.p_mfa('ws_live', 'unsubscribe', ['agents', this.type])
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live', 'unsubscribe', ['agents', old])
      this.query(value)
    },
  }
}
</script>
