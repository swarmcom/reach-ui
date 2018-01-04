<template>
<div v-access:supervisor-ui v-bind:class="classObject">
  <b-row>
    <b-col><records></records></b-col>
  </b-row>
</div>

</template>

<script>
import Records from '@/Recordings/Records'

export default {
  data () {
    return {
    }
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenRecordings"] = this.$agent.vm.isNarrowLayout.recordings
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.recordings,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.recordings
      }
    }
  },
  components: {
    'records': Records
  }
}
</script>