<template>
</template>

<script>
import moment from 'moment'
import momentDurationFormat from 'moment-duration-format'

export default {
  data () {
    return {
      type: null,
      types: [],
      skip_load: false,
      updater: ''
    }
  },
  methods: {
    query: async function (type) {
    },
    onTimer () {
    },
    onClick (data) {
    },
    durationFormatter (value) {
      let v = parseInt(value)
      if (v >= 0) {
        return moment.duration(v).format("d[d] hh:*mm:ss", { forceLength: true })
      } else {
        return ''
      }
    },
    is_cached () {
      let key = this.unique_name()
      return (key in this.$agent.vm.live_cache)
    },
    unique_name () {
      return this.$route.fullPath
    },
    saveCache () {
      let key = this.unique_name()
      if (! this.is_cached()) {
        this.$agent.vm.live_cache[key] = {}
      }
      this.$agent.vm.live_cache[key]['type'] = this.type
    },
    loadCache () {
      let key = this.unique_name()
      if (this.$agent.vm.live_cache[key]) {
        this.skip_load = true
        this.type = this.$agent.vm.live_cache[key]['type']
      }
    },
  },
  created () {
    this.loadCache()
    this.query(this.type)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    clearInterval(this.updater)
  }
}
</script>
