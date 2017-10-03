<template>
<div v-if="visible">
  <h1>Conference controls</h1>
</div>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    handleState ({ info, inqueue, call_info }) {
      if (info.state == 'conference') {
        this.visible = true
      } else {
        this.visible = false
      }
    },
    onTimer () {
    },
  },
  created () {
    this.$bus.$on('agent_state', (S) => this.handleState(S))
  },
  mounted () {
    this.onTimer()
  }
}
</script>
