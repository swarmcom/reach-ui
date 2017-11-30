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
    skills2list (Obj) {
      return Object.keys(Obj).map( key => key )
    },
    list2skills (List) {
      let Re = {}
      List.forEach(Key => Re[Key] = true)
      return Re
    },
    defined (V) {
      return V == "undefined" ? '' : V
    }
  }
}
</script>
