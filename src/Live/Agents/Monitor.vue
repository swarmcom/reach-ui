<template>
<div>
  <b-row>
    <b-col><h6>Live agents by {{type}}</h6></b-col>
  </b-row>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" size="sm" />
    </b-col>
  </b-row>
  <b-table
    small
    bordered
    hover
    head-variant=light
    thead-tr-class="table-header"
    tbody-tr-class="table-body"
    sort-by="agent"
    :items="data"
    :fields="fields"
  >
    <template slot="agent" slot-scope="data">
      {{ data.item.agent.login }}
    </template>
    <template slot="age" slot-scope="data">
      {{ durationFormatter(data.item.age) }}
    </template>
    <template slot="time" slot-scope="data">
      {{ durationFormatter(data.item.time) }}
    </template>
    <template slot="actions" slot-scope="data">
      <b-button v-if="data.item.state == 'release'" size="sm" variant="success" @click="available(data.item)" class="pointer">Available</b-button>
      <b-button v-else size="sm" variant="secondary" @click="release(data.item)" class="pointer">Release</b-button>
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
        agent: { label: 'Login', sortable: true },
        age: { label: 'Session Time', sortable: true },
        state: { label: 'State', sortable: true },
        time: { label: 'State Time', sortable: true },
        ws_peer: { label: 'Peer', sortable: true },
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
