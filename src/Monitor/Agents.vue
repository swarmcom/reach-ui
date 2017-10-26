<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">
    <div class="row">
      <div class="col"><h5>Agents Stats</h5></div>
    </div>
    <b-table style="margin-top:10px" small striped hover
      :items="computedAgentsStats"
      :fields="fieldsStats">
    </b-table>
    <div class="row">
      <div class="col"><h5>Logged in agents</h5></div>
    </div>
    <b-table style="margin-top:10px" small striped hover
      :items="computedAgents"
      :fields="fields"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @sort-changed="onSortingChanged">
      <template slot="actions" slot-scope="data">
        <b-button v-if="data.item.state == 'release'" size="sm" variant="warning" @click="available(data.item)">Available</b-button>
        <b-button v-else size="sm" variant="primary" @click="release(data.item)">Release</b-button>
        <b-button size="sm" variant="danger" @click="stop(data.item)">Kill</b-button>
      </template>
    </b-table>
  </b-collapse>
</div>
</template>

<script>
import Btable from '../Widget/Btable'
import ToggleBar from '../Widget/ToggleBar'
import Common from '../Admin/Common'
export default {
  name: 'monitor-agents',
  storageName: 'agentManager',
  widgetName: 'AGENT MANAGER',
  mixins: [Common],
  data () {
    return {
      fields: {
        agent_id: { label: 'Id', sortable: true },
        agent_login: { label: 'Login', sortable: true },
        agent_name: { label: 'Name', sortable: true },
        state: { label: 'State', sortable: true },
        agent_skills: { label: 'Skills', sortable: true },
        agent_uri: { label: 'Agent Phone', sortable: true },
        timeComputed: { label: 'Time', sortable:true },
        actions: { label: 'Actions' }
      },
      fieldsStats: {
        total_agents: { label: 'Total Agents', sortable: true },
        released: { label: 'Released', sortable: true },
        idle: { label: 'Idle', sortable: true },
        ringing: { label: 'Ringing', sortable: true },
        insession: { label: 'In Session', sortable: true },
        wrapup: { label: 'Wrap-up', sortable: true }
      },
      agents: [],
      updater: '',
      sortBy: 'agent_id',
      sortDesc: false,
      showCollapse: true
    }
  },
  methods: {
    handleState ({ tag, info }) {
      if (tag === 'ws_login') {
        let i = this.agents.findIndex(E => E.agent_id === info.agent_id)
        if (i >= 0) {
          this.agents.splice(i, 1, info)
        } else {
          this.agents.push(info)
        }
      }
      else if (info.state === 'terminate') {
        let i = this.agents.findIndex(E => E.agent_id === info.agent_id)
        if (i >= 0) {
          this.agents.splice(i, 1)
        }
      }
      else {
        let i = this.agents.findIndex(E => E.agent_id === info.agent_id)
        if (i >= 0) {
          this.agents.splice(i, 1, info)
        }
      }
    },
    query: async function() {
      this.agents = await this.$agent.p_mfa('ws_admin', 'agents', ['all'])
    },
    onTimer () {
      this.agents.forEach((E, i, A) => {
        E.time = E.time + 1000
        A.splice(i, 1, E)
      })
    },
    onClick (data) {
      this.$router.push(`/admin/agent/${data.agent_id}`)
    },
    release (agent) {
      this.$agent.mfa('ws_supervisor', 'release', [agent.agent_id])
    },
    onSortingChanged (ctx){
      console.log("sorting dsfnaskjdh"+ctx.sortBy)
      this.$agent.vm.storage_data[this.$options.storageName+'SortBy'] = ctx.sortBy
      this.$agent.vm.storage_data[this.$options.storageName+'SortDesc'] = ctx.sortDesc
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
    available (agent) {
      this.$agent.mfa('ws_supervisor', 'available', [agent.agent_id])
    },
    stop (agent) {
      this.$agent.mfa('ws_supervisor', 'stop', [agent.agent_id])
    }
  },
  created () {
    this.query()
    this.$agent.subscribe('agents')
    this.$bus.$on('agents_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
    if (this.$agent.vm.storage_data.agentManagerCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentManagerCollapsed
    if (this.$agent.vm.storage_data.agentManagerSortBy != undefined)
      this.sortBy = this.$agent.vm.storage_data.agentManagerSortBy
    if (this.$agent.vm.storage_data.agentManagerSortDesc != undefined)
      this.sortDesc = this.$agent.vm.storage_data.agentManagerSortDesc
  },
  beforeDestroy () {
    this.$bus.$off('agents_state', this.handleState)
    clearInterval(this.updater)
  },
  components: {
    btable: Btable,
    toggleBar: ToggleBar
  },
  computed: {
    computedAgents () {
      let agents = this.agents;
      agents.forEach( (key) => {
        key.timeComputed = this.msToHms(Math.round(key.time).toString())
        key.agent_name = key.agent.name
        key.agent_login = key.agent.login
        key.agent_skills = (Object.keys(key.agent.skills)).toString()
        key.agent_uri = key.agent.uri
      } )
      return agents;
    },
    computedAgentsStats () {
      let agents = []
      let object = { "total_agents":0, "released": 0, "idle": 0, "ringing": 0, "insession": 0, "wrapup": 0}
      object.total_agents = this.agents.length
      this.agents.forEach( (key) => {
        console.log(key.state)
        switch (key.state){
          case "release":
            object.released++
            break;
          case "available":
            object.idle++
            break;
          case "ringing":
            object.ringing++
            break;
          case "oncall":
            object.insession++
            break;
          case "wrapup":
            object.wrapup++
            break;
        }
      } )
      agents.push(object)
      return agents;
    }
  }
}
</script>
