<template>
<div>
<div class="row">
  <div class="col"><h3>Logged in agents</h3></div>
</div>
<div class="row" v-for="agent in agents">
  <div class="col-2">{{ agent.login }}</div>
  <div class="col-2">{{ agent.state }}</div>
  <div class="col-2">{{ Math.round(agent.time/1000) }}s</div>
</div>
</div>
</template>

<script>
export default {
  name: 'agents',
  data () {
    return {
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
      this.$agent.agents(List => this.agents = List)
    },
    onTimer() {
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
    this.$bus.$on('agent-auth', (S) => this.handleState(S))
  }
}
</script>