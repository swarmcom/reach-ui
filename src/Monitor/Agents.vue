<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">
  <btable :fields="fields" :data="computedAgents" :filter_button=true :paginate=true></btable>
  </b-collapse>
</div>
</template>

<script>
import Btable from '../Widget/Btable'
import ToggleBar from '../Widget/ToggleBar'
import Common from '../Admin/Common'
export default {
  name: 'monitor-agents',
  widgetName: 'AGENT MANAGER',
  mixins: [Common],
  data () {
    return {
      fields: {
        agent_id: { label: 'Id', sortable: true },
        agent_login: { label: 'Login', sortable: true },
        agent_name: { label: 'Name', sortable: true },
        state: { label: 'State', sortable: true },
        time: { label: 'Time', sortable:true, formatter: (time) => this.msToHms(time) }
      },
      agents: [],
      updater: '',
      showCollapse: true
    }
  },
  methods: {
    handleState ({ tag, info }) {
      if (tag === 'ws_login') {
        this.agents.push(info)
      }
      else if (info.state === 'terminate') {
        let i = this.agents.findIndex(E => E.login === info.login)
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
    }
  },
  created () {
    this.query()
    this.$agent.subscribe('agents')
    this.$bus.$on('agents_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
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
        key.timeComputed = Math.round(key.time/1000).toString()
        key.agent_name = key.agent.name
        key.agent_login = key.agent.login
      } )
      return agents;
    }
  }
}
</script>
