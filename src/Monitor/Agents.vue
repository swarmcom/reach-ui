<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2"></b-collapse>
  <btable v-if="showCollapse" :fields="fields" :data="agents" :filter_button=true :paginate=true></btable>
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
  }
}
</script>