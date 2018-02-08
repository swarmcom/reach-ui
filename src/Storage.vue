<template>
</template>

<script>
export default {
  methods: {
    getLocal (K) {
      return this.$agent.vm.storage_data[this.$options.name][K]
    },
    setLocal (K, V) {
      this.$agent.vm.storage_data[this.$options.name][K] = V
      return this
    },
    loadLocal (Ks) {
      Ks.forEach( (K) => this[K] = this.getLocal(K) )
      return this
    },
    saveLocal (Ks) {
      Ks.forEach( (K) => this.setLocal(K, this[K]) )
      return this
    },
    eraseLocal (Ks) {
      Ks.forEach( (K) => delete this.$agent.vm.storage_data[this.$options.name][K] )
      return this
    },
    writeLocal () {
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return this
    },
    maybeInitLocal () {
      if (! this.local()) {
        this.initLocal()
      }
      return this
    },
    initLocal() {
      this.$agent.vm.storage_data[this.$options.name] = {}
      return this
    },
    local() {
      return this.$agent.vm.storage_data[this.$options.name]
    }
  }
}
</script>
