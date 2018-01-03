<template>
<div>
  <div class="row">
    <div class="col"><h3>Persistent agents</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="agents" :fields="fields">
    <template slot="actions" slot-scope="data">
      <div v-if="data.item.runtime.state">
        <b-button v-if="data.item.runtime.state == 'release'" size="sm" variant="warning" @click="available(data.item)">Available</b-button>
        <b-button v-else size="sm" variant="primary" @click="release(data.item)">Release</b-button>
        <b-button size="sm" variant="danger" @click="stop(data.item)">Stop</b-button>
      </div>
      <div v-else>
        <b-button size="sm" variant="success" @click="start(data.item)">Start</b-button>
      </div>
    </template>
  </b-table>
  <b-row>
    <b-col>
 Persistent agents are configured by the Persistent parameter on the Agent configuration. All persistent agents are displayed here. Persistent agents are treated as ALWAYS logged in and available. They will not be subject to auto logout or auto release cases. However, the suspend and wrap up modes will still apply to this agent. Note that a user that has the permissions to do so can set the state of a persistent agent manually from this page. This allows for a mechanism to stop using a persistent agent for a period of time without the need to remove this agent record from the system.
    </b-col>
  </b-row>
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
