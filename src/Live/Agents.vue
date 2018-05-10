<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents</h3></div>
  </div>
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
      <b-button v-if="data.item.state == 'release'" size="sm" variant="warning" @click="available(data.item)">Available</b-button>
      <b-button v-else size="sm" variant="primary" @click="release(data.item)">Release</b-button>
      <b-button size="sm" variant="danger" @click="stop(data.item)">Kill</b-button>
    </template>
  </b-table>
</div>
</template>

<script>
import moment from 'moment'
import momentDurationFormat from 'moment-duration-format'

export default {
  data () {
    return {
      fields: {
        login: { label: 'Login' },
        session_time: { label: 'Session Time' },
        state: { label: 'State' },
        time: { label: 'State Time' },
        ws_peer: { label: 'Peer' },
        actions: { label: 'Actions' }
      },
      data: [],
      updater: ''
    }
  },
  methods: {
    handleState ({ tag, state }) {
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
    query: async function () {
      this.data = await this.$agent.p_mfa('ws_live', 'agents', ['acl'])
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
    durationFormatter (v) {
      if (v) {
        return moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
      } else {
        return ''
      }
    },
  },
  created () {
    this.query()
    this.$agent.p_mfa('ws_live', 'subscribe', ['agents', 'acl'])
    this.$bus.$on('live_agent_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    this.$bus.$off('live_agent_state', this.handleState)
    this.$agent.p_mfa('ws_live', 'unsubscribe', ['agents', 'acl'])
    clearInterval(this.updater)
  },
}
</script>
