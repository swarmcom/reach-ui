<script>
export default {
  methods: {
    sortCompareCustom(a, b, key) {
      switch(key) {
      case 'abandoned_percent':
        let v1 = (a.call_count !== undefined && a.call_count !== 0) ? (a.abandoned/a.call_count) : -1
        let v2 = (b.call_count !== undefined && b.call_count !== 0) ? (b.abandoned/b.call_count) : -1
        return v1 < v2 ? -1 : (v1 > v2 ? 1 : 0)
      default:
        return null
      }
    }
  }
}
</script>
