<template>
<div v-bind:class="classObject">
  <h3>Persistent agents</h3>
  <div>
    Persistent agents are configured by the Persistent parameter on the Agent configuration. All persistent agents are displayed here. Persistent agents are treated as ALWAYS logged in and available. They will not be subject to auto logout or auto release cases. However, the suspend and wrap up modes will still apply to this agent. Note that a user that has the permissions to do so can set the state of a persistent agent manually from this page. This allows for a mechanism to stop using a persistent agent for a period of time without the need to remove this agent record from the system.
  </div>
  <h3 style="margin-top: 20px">All skills</h3>
  <div>
    Add skills to the system by typing in the skill name in the entry box and pressing return. Once added, a full list of the skills built in the system can be seen by using the drop down. Remove skills from the system by clicking on the skill name to the right of the drop down selector. Note that once a skill is built in the system here, it can be referenced throughout the system by name. Example configuration referenceing these skills includes skill groups, queue, queue group, agent, agent group, line, client, etc.
  </div>
  <h3 style="margin-top: 20px">Inbound routing</h3>
  <div>
    Add, Delete or reorder inbound routing pattern matches. Each pattern can be added to try to match the destination number of the offered call or to try to match some specific part of the caller's information. The pattern to match is standard regex capable. So, the pattern could be something as simple as a static number like 21005 or could be as complex as a full regex pattern such as [2-9]1. The routing entries here will be searched top to bottom until a match is found. Once a match is found, the inbound call will be sent to the specified line.
  </div>
</div>
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
