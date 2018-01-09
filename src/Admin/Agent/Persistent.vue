<template>
<div>
  <div class="row">
    <div class="col"><h3>Persistent agents</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="agents" :fields="fields">
    <template slot="actions" slot-scope="data">
      <div v-if="data.item.runtime.state">
        <b-button class="pointer" v-if="data.item.runtime.state == 'release'" size="sm" variant="warning" @click="available(data.item)">Available</b-button>
        <b-button class="pointer" v-else size="sm" variant="primary" @click="release(data.item)">Release</b-button>
        <b-button class="pointer" size="sm" variant="danger" @click="stop(data.item)">Stop</b-button>
      </div>
      <div v-else>
        <b-button class="pointer" size="sm" variant="success" @click="start(data.item)">Start</b-button>
      </div>
    </template>
  </b-table>
</div>
</template>


<script>
export default {
  name: 'admin-persistent-agents',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        login: { label: 'Login', sortable: true },
        name: { label: 'Name', sortable: true },
        runtime: { label: 'State', sortable: true, formatter: (runtime) => runtime.state },
        actions: { label: 'Actions' }
      },
      agents: []
    }
  },
  methods: {
    query: async function () {
      this.agents = await this.$agent.p_mfa('ws_admin', 'agents', ['persistent'])
    },
    available: async function (agent) {
      let re = await this.$agent.p_mfa('ws_admin', 'available', [agent.id])
    },
    release: async function (agent) {
      let re = await this.$agent.p_mfa('ws_admin', 'release', [agent.id])
    },
    stop: async function (agent) {
      let re = await this.$agent.p_mfa('ws_admin', 'stop', [agent.id])
    },
    start: async function (agent) {
      let re = await this.$agent.p_mfa('ws_admin', 'start', [agent.id])
    },
    handleState ({ tag, info }) {
      if (info.state === 'terminate') {
        let i = this.agents.findIndex(E => E.id === info.agent_id)
        if (i >= 0) {
          this.agents[i].runtime = {}
        }
      }
      else {
        let i = this.agents.findIndex(E => E.id === info.agent_id)
        if (i >= 0) {
          this.agents[i].runtime = info
        }
      }
    },
  },
  created () {
    this.query()
    this.$agent.subscribe('agents')
    this.$bus.$on('agents_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agents_state', this.handleState)
  },
}
</script>
