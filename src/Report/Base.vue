<script>
import moment from 'moment'

export default {
  methods: {
    safe_query: async function (query) {
      try {
        this.query(query)
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
    durationFormatter (v) {
      return moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    },
    percentageFormatter (a, b) {
      return (a !== undefined && b !== 0) ? (100*a/b).toFixed(1)+'%' : 'NA'
    },
    nameFormatter (v) {
      return v.name
    },
    tsFormatter (v) {
      return new Moment(v, "x").format("YYYY-MM-DD HH:mm")
    }
  },
  watch: {
    query_params (value) {
      this.safe_query(value)
      return value
    }
  }
}
</script>
