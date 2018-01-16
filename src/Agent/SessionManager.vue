<template>
<div>
  <toggle-bar style="cursor: move"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseSessionManager" class="mt-2">
    <b-row>
      <b-col cols="12" md="6" lg="3" order="2" order-lg="1">
        <agent-state></agent-state>
        <my-profile></my-profile>
      </b-col>
      <b-col cols="12" lg="9" order="1" order-lg="2">
        <b-row class="col-12">
          <b-col cols="12" md="8">
            <dialer v-if="this.$agent.is_idle()"></dialer>
          </b-col>
          <b-col cols="12">
            <inqueue></inqueue>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Inqueue from '@/Agent/Inqueue'
import Dialer from '@/Agent/Dialer'
import Release from '@/Agent/Widget/Release'
import AgentState from '@/Agent/AgentState'
import MyProfile from '@/Agent/MyProfile'
export default {
  widgetName: 'SESSION MANAGER',
  storageName: 'sessionManager',
  data () {
    return {
      showCollapse: true,
    }
  },
  methods: {
    logout () { this.$agent.logout() },
  },
  created () {
    if (this.$agent.vm.storage_data.sessionManagerCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.sessionManagerCollapsed
  },
  components: {
    inqueue: Inqueue,
    dialer: Dialer,
    release: Release,
    'agent-state': AgentState,
    'my-profile': MyProfile,
  },
}
</script>