<template>
<div v-bind:class="classObject">
  <b-row>
    <b-col><session-manager></session-manager></b-col>
  </b-row>
  <b-row>
    <b-col><my-statistics></my-statistics></b-col>
  </b-row>
  <b-row>
    <b-col><agents v-bind:class="{ deactiveAM: !$agent.vm.isActiveAM }"></agents></b-col>
  </b-row>
  <b-row>
    <b-col><inqueues v-bind:class="{ deactiveQM: !$agent.vm.isActiveQM }"></inqueues></b-col>
  </b-row>
</div>

</template>

<script>
import SessionManager from '@/Agent/SessionManager.vue'
import MyStatistics from '@/Agent/MyStatistics.vue'
import Agents from '@/Monitor/Agents'
import Inqueues from '@/Monitor/Inqueues'
export default {
  data () {
    return {
    }
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenMain"] = this.$agent.vm.isNarrowLayout.main
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.main
      }
    }
  },
  components: {
    'session-manager': SessionManager,
    'my-statistics': MyStatistics,
    'agents': Agents,
    'inqueues': Inqueues
  }
}
</script>
