<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerProfiles" class="mt-2">
    <div class="row">
      <div class="col-2">
        <div class="row toggle-bar-custom">
          <div class="title">Profile Name</div>
        </div>
        <b-form-select size="sm" v-model="selectedProfile" style="margin-top:10px">
          <option v-for="group in this.groups" :value=group.name>{{group.name}}</option>
        </b-form-select>
      </div>
      <div class="col-10">
        <div class="row toggle-bar-custom" style="margin-left:1px">
          <div class="title">Agent States</div>
        </div>
        <b-table style="margin-top:10px" small striped hover
          :items="computedAgentsStats"
          :fields="fieldsStats">
        </b-table>
      </div>
    </div>
  </b-collapse>
</div>
</template>
<script>
import ToggleBar from '../../Widget/ToggleBar'
export default {
  name: 'monitor-agents-profiles',
  storageName: 'agentManagerStates',
  widgetName: 'AGENT PROFILES',
  props: {
    agents: Array,
    groups: Array
  },
  data () {
    return {
      fieldsStats: {
        totalAgents: { label: 'Total Agents', sortable: false },
        released: { label: 'Released', sortable: false },
        idle: { label: 'Idle', sortable: false },
        ringing: { label: 'Ringing', sortable: false },
        insession: { label: 'In Session', sortable: false },
        wrapup: { label: 'Wrap-up', sortable: false },
        occup: { label: 'Occup', sortable: false },
        cpt: { label: 'CPT', sortable: false },
        calls: { label: 'Calls', sortable: false },
      },
      selectedProfile: 'Any Profile',
      showCollapse: true
    }
  },
  created () {
    if (this.$agent.vm.storage_data.agentManagerStatesCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentManagerStatesCollapsed
  },
  components: {
    toggleBar: ToggleBar
  },
  computed: {
    computedAgentsStats () {
      let agents = []
      let object = { "totalAgents":0, "released": 0, "idle": 0, "ringing": 0, "insession": 0, "wrapup": 0}
      this.agents.forEach( (key) => {
        if(key.agent.group != undefined){
          if(this.selectedProfile != key.agent.group.name && this.selectedProfile != 'Any Profile')
            return
        }
        else if(this.selectedProfile != 'Any Profile'){
          return
        }
        object.totalAgents++
        switch (key.state){
          case "release":
            object.released++
            break;
          case "available":
            object.idle++
            break;
          case "ringing":
            object.ringing++
            break;
          case "oncall":
            object.insession++
            break;
          case "wrapup":
            object.wrapup++
            break;
        }
      } )
      agents.push(object)
      return agents;
    }
  }
}
</script>