<template>
<div>
  <div class="row">
    <div class="col"><h3>Logged in agents</h3></div>
  </div>
  <btable :fields="fields" :data="computedAgents" :add_button=false></btable>
</div>
</template>

<script>
import Btable from '../Widget/Btable'
export default {
  name: 'monitor-agents',
  data () {
    return {
      fields: {
        agent_id: { label: 'Id', sortable: true },
        agent_login: { label: 'Login', sortable: true },
        agent_name: { label: 'Name', sortable: true },
        state: { label: 'State', sortable: true },
        timeComputed: { label: 'Time', sortable:true }
      },
      agents: [],
      updater: ''
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
        let i = this.agents.findIndex(E => E.login === info.login)
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
    btable: Btable
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