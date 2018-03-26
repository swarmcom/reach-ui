<template>
<div v-bind:class="classObject"></div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenProfile"] = this.$agent.vm.isNarrowLayout.help
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.help,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.help
      }
    }
  }
}
</script>