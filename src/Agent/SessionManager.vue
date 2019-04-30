<template>
  <div>
    <toggle-bar style="cursor: move" />
    <b-collapse
      id="collapseSessionManager"
      v-model="showCollapse"
      class="mt-2 itemDragable"
    >
      <b-row>
        <b-col
          cols="12"
          md="6"
          lg="3"
          order="2"
          order-lg="1"
        >
          <agent-state />
        </b-col>
        <b-col
          cols="12"
          lg="9"
          order="1"
          order-lg="2"
        >
          <b-row class="col-12">
            <b-col
              cols="12"
              md="8"
            >
              <dialer v-if="this.$agent.is_idle()" />
            </b-col>
            <b-col cols="12">
              <inqueue />
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
import AgentState from '@/Agent/AgentState'
import Storage from '@/Storage'

export default {
  widgetName: 'Session manager',
  name: 'SessionManager',
  components: {
    inqueue: Inqueue,
    dialer: Dialer,
    'agent-state': AgentState
  },
  mixins: [Storage],
  data () {
    return {
      showCollapse: true,
    }
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    },
  },
  created () {
    this.maybeInitLocal().loadLocal('showCollapse')
  },
  methods: {
    logout () { this.$agent.logout() },
  },
}
</script>
