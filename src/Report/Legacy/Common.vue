<script>
export default {
  methods: {
    sortCompareCustom(a, b, key) {
      switch(key) {
      case 'abandoned_percent':
        let v1 = (a.abandoned === undefined) ? -1 : a.abandoned
        let v2 = (b.abandoned === undefined) ? -1 : b.abandoned
        return v1 < v2 ? -1 : (v1 > v2 ? 1 : 0)
      default:
        return null
      }
    }
  }
}
</script>
