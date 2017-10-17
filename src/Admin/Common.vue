<script>
export default {
  methods: {
    object2list (Obj) {
      return Object.keys(Obj).map( K => { return { "key": K, "value": Obj[K] } } )
    },
    list2object (List) {
      let Re = {}
      List.forEach(Obj => Re[Obj.key] = Obj.value)
      return Re
    },
    defined (V) {
      return V == "undefined" ? '' : V
    }
  }
}
</script>
