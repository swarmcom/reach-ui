<template>
<div>
<div class="row">
  <div class="col"><h3 style="color:#42b983">Logged in agents</h3></div>
</div>
<form id="search" style="float: right; margin-bottom: 10px;">
  Filter <input name="query" v-model="searchQuery">
</form>
<custom-table style="margin-top: 20px; margin-bottom: 20px"
  :data="computedAgents"
  :columns="columns"
  :dataArguments="dataArguments"
  :filter-key="searchQuery"
  :clickable="0">
</custom-table>
</div>
</template>

<script>
import CustomTable from '../Widget/CustomTable'
export default {
  name: 'agents',
  data () {
    return {
      searchQuery: '',
      columns: ['ID', 'State', 'Time'],
      dataArguments: ['agent_id', 'state', 'timeComputed'],
      agents: []
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
    query () {
      this.$agent.agents(Obj => this.agents = Obj.reply)
    },
    onTimer () {
      this.agents.forEach((E, i, A) => {
        E.time = E.time + 1000
        A.splice(i, 1, E)
      })
      setTimeout( this.onTimer, 1000 )
    }
  },
  mounted () {
    this.onTimer()
  },
  created () {
    this.$agent.subscribe('agents')
    this.query()
    this.$bus.$on('agents_state', (S) => this.handleState(S))
  },
  components: {
    'custom-table': CustomTable
  },
  computed: {
    computedAgents () {
      let agents = this.agents;
      agents.forEach( (key) => key.timeComputed = Math.round(key.time/1000).toString() + 's' )
      return agents;
    }
  }
}
</script>