<template>
  <div />  
</template>

<script>
import moment from 'moment'
import momentDurationFormat from 'moment-duration-format'

export default {
  data () {
    return {
      type: null,
      period: null,
      types: [],
      skip_load: false,
      data: [],
      updater: ''
    }
  },
  created () {
    this.loadCache()
    this.query(this.type, this.period)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    clearInterval(this.updater)
  },
  methods: {
    query: async function (type, period) {
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
      return this.$options.name + this.$route.fullPath
    },
    saveCache () {
      let key = this.unique_name()
      if (! this.is_cached()) {
        this.$agent.vm.live_cache[key] = {}
      }
      this.$agent.vm.live_cache[key]['type'] = this.type
      this.$agent.vm.live_cache[key]['period'] = this.period
    },
    loadCache () {
      let key = this.unique_name()
      if (this.$agent.vm.live_cache[key]) {
        // this.skip_load = true
        if (this.$agent.vm.live_cache[key]['type']) {
          this.type = this.$agent.vm.live_cache[key]['type']
        }
        if (this.$agent.vm.live_cache[key]['period']) {
          this.period = this.$agent.vm.live_cache[key]['period']
        }
      }
    },
  }
}
</script>
