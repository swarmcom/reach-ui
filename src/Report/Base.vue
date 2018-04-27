<template>
</template>

<script>
import moment from 'moment'
import momentDurationFormat from 'moment-duration-format'

export default {
  data () {
    return {
      skip_load: false
    }
  },
  methods: {
    safe_query: async function (query) {
      try {
        this.data = await this.query(query)
        this.saveCache()
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
    durationFormatter (v) {
      if (v) {
        return moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
      } else {
        return ''
      }
    },
    percentageFormatter (a, b) {
      return (a > 0 && b > 0) ? (100*a/b).toFixed(1)+'%' : '0%'
    },
    nameFormatter (v) {
      return v.name
    },
    tsFormatter (v) {
      return new moment(v, "x").format("YYYY-MM-DD HH:mm")
    },
    tsMsFormatter (v) {
      return new moment(v, "x").format("YYYY-MM-DD HH:mm:ss")
    },
    maybe_copy_params (Dst, Src, Params) {
      Params.forEach( k => { if (Src[k]) { Dst[k] = Src[k] } })
      return Dst
    },
    maybe_copy_int_params (Dst, Src, Params) {
      Params.forEach( k => { if (Src[k]) { Dst[k] = parseInt(Src[k]) } })
      return Dst
    },
    more: async function() {
      if (this.data.length == 0) {
        return
      }
      let params = this.query_params
      let session = this.data[this.data.length - 1]
      params.date_end = parseInt(session.ts_ms/1000)
      let more = await this.query(params)
      this.data = this.data.concat(more)
    },
    is_standalone () {
      return this.$route.query.group_by? false : true
    },
    set_query_params (params) {
      if (this.is_standalone()) {
        return params
      }
      let q = this.$route.query
      this.maybe_copy_int_params(params, q, ['date_start', 'date_end'])
      let entity = `${q.group_by}_id`
      params[entity] = parseInt(q.entity_id)
      return params
    },
    unique_name () {
      return this.$route.path
    },
    saveCache () {
      let key = this.unique_name()
      if (!this.$agent.vm.reports_cache[key]) {
        this.$agent.vm.reports_cache[key] = {}
      }
      this.$agent.vm.reports_cache[key]['query_params'] = this.query_params
      this.$agent.vm.reports_cache[key]['data'] = this.data
    },
    loadCache () {
      let key = this.unique_name()
      if (this.$agent.vm.reports_cache[key]) {
        this.skip_load = true
        this.query_params = this.$agent.vm.reports_cache[key]['query_params']
        this.data = this.$agent.vm.reports_cache[key]['data']
      }
    },
  },
  watch: {
    query_params (value) {
      if (! this.skip_load) {
        this.safe_query(value)
      }
      this.skip_load = false
      return value
    }
  },
  created () {
    this.loadCache()
  }
}
</script>
