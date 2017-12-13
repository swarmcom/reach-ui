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
    },
    skills2list (Obj) {
      return Object.keys(Obj).map( key => key )
    },
    list2skills (List) {
      let Re = {}
      List.forEach(Key => Re[Key] = true)
      return Re
    },
    msToHms: function (d) {
      let duration = Number(d)

      let s = Math.floor((duration/1000)%60)
      let m = Math.floor((duration/(1000*60))%60)
      let h = Math.floor(duration/(1000*60*60));

      let hDisplay = h > 0 ? (h <= 9 ? "0"+h : h) + ":" : "00:"
      let mDisplay = m > 0 ? (m <= 9 ? "0"+m : m) + ":" : "00:"
      let sDisplay = s > 0 ? (s <= 9 ? "0"+s : s) : "00"
      return hDisplay + mDisplay + sDisplay
    },
    msToMs: function (d) {
      let duration = Number(d)
      let s = Math.floor((duration/1000)%60)
      let m = Math.floor(duration/(1000*60))

      let mDisplay = m > 0 ? (m <= 9 ? "0"+m : m) + ":" : "00:"
      let sDisplay = s > 0 ? (s <= 9 ? "0"+s : s) : "00"
      return mDisplay + sDisplay
    }
  }
}
</script>
