<template>
<call v-if="call_visible" :uuid="uuid"></call>
</template>

<script>
import Call from './Inqueue/Call'

export default {
  data () {
    return {
      call_visible: false,
      uuid: undefined
    }
  },
  methods: {
    handleState ({ state }) {
      if (state.state == "available" || state.state == "release") {
        this.call_visible = false
        this.uuid = undefined
      } else {
        if (state.inqueue.inqueue_call) {
          this.call_visible = true
          this.uuid = state.inqueue.inqueue_call
        }
      }
    }
  },
  created () {
    this.$bus.$on('agent_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agent_state', this.handleState)
  },
  components: {
    call: Call
  },
}
</script>
