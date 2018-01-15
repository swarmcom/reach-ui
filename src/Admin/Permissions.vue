<template>
<div class="container">
  <b-row style="margin-bottom: 10px"><h3>Permissions:</h3></b-row>
  <div v-if="ui == 'supervisor'" v-for="(perm, index) of perms_check" style="margin-top: 5px">
    <b-row v-if="index === 0"><b>Content</b></b-row>
    <b-row v-if="index === 0"> <b-col>Displayed Tabs: </b-col></b-row>
    <b-row v-if="index === 4"> <b>Accessible Widgets: </b></b-row>
    <b-row v-if="index === 7"><b>Agent Groups:</b></b-row>
    <b-row v-if="index === (7+groups.length)"><b>Queues:</b></b-row>
    <b-row v-if="index === (7+groups.length + queues.length)"><b>Supervisor Privileges:</b></b-row>
    <b-row v-if="index === (13+groups.length + queues.length)"> <b>Features: </b></b-row>
    <b-row v-if="index === (17+groups.length + queues.length)"><b-col> Conference/Transfer Privileges</b-col></b-row>
    <b-form-checkbox v-if="canShow(index)" v-model="perm.value" v-on:change="onChangeCheck(perm, $event)">
      {{perm.displayName}}
    </b-form-checkbox>
  </div>
  <div v-if="ui == 'agent'" v-for="(perm, index) of perms_check" style="margin-top: 5px">
    <b-row v-if="index === 0"><b>Content</b></b-row>
    <b-row v-if="index === 0"> <b-col>Displayed Tabs: </b-col></b-row>
    <b-row v-if="index === 1"> <b>Accessible Widgets: </b></b-row>
    <b-row v-if="index === 4"> <b>Features: </b></b-row>
    <b-row v-if="index === 7"><b-col> Conference/Transfer Privileges</b-col></b-row>
    <b-row v-if="index === 14"><b> Administrative Control:</b></b-row>
    <b-form-checkbox v-model="perm.value" v-on:change="onChangeCheck(perm, $event)">
      {{perm.displayName}}
    </b-form-checkbox>
  </div>
</div>
</template>

<script>
export default {
  name: 'admin-role-permissions',
  props: ['id','ui'],
  data () {
    return {
      name: undefined,
      permissions: [],
      perms_check: []
    }
  },
  methods: {
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get', [])
      this.perms_check = []
      if (this.ui == 'supervisor') {
        this.perms_check.push({displayName: "Main", name: "main-ui", value: false})
        this.perms_check.push({displayName: "Monitor", name: "monitor-ui", value: false})
        this.perms_check.push({displayName: "Recordings", name: "recordings-ui", value: false})
        this.perms_check.push({displayName: "Reports", name: "reports-ui", value: false})
        this.perms_check.push({displayName: "Agent Manager", name: "agentManager-widget", value: false})
        this.perms_check.push({displayName: "Queue Manager", name: "queueManager-widget", value: false})
        this.perms_check.push({displayName: "My Statistics", name: "myStatistics-widget", value: false})
        this.groups.forEach( (key) => {
          this.perms_check.push({displayName: key.name, name: key.name+'-groups', value: false})
        })
        this.queues.forEach( (key) => {
            this.perms_check.push({displayName: key.name, name: key.name+'-queues', value: false})
        })
        this.perms_check.push({displayName: "Control Agent State", name: "controlAgentState-feature", value: false})
        this.perms_check.push({displayName: "Barge", name: "barge-feature", value: false})
        this.perms_check.push({displayName: "Whisper", name: "whisper-feature", value: false})
        this.perms_check.push({displayName: "Take Over", name: "takeOver-feature", value: false})
        this.perms_check.push({displayName: "Take call from queue", name: "takeCallQueue-feature", value: false})
        this.perms_check.push({displayName: "Hangup call from queue", name: "hangupCallQueue-feature", value: false})
        this.perms_check.push({displayName: "Set My Phone", name: "myPhone-feature", value: false})
        this.perms_check.push({displayName: "Allow Outbound", name: "outbound-feature", value: false})
        this.perms_check.push({displayName: "Allow On Demand Call Recording", name: "CROnDemand-feature", value: false})
        this.perms_check.push({displayName: "Transfer to Agent", name: "transAgent-feature", value: false})
        this.perms_check.push({displayName: "Transfer to Queue", name: "transQueue-feature", value: false})
        this.perms_check.push({displayName: "Transfer to Number", name: "transNumber-feature", value: false})
        this.perms_check.push({displayName: "Conference to Agent", name: "confAgent-feature", value: false})
        this.perms_check.push({displayName: "Conference to Queue", name: "confQueue-feature", value: false})
        this.perms_check.push({displayName: "Conference to Number", name: "confNumber-feature", value: false})
        this.perms_check.push({displayName: "Change Skills on Conf/Tran", name: "transConfChangeSkills-feature", value: false})
      }
      else if (this.ui == 'agent') {
        this.perms_check = [
            {displayName: "Profile", name: "profile-ui", value: false},
            {displayName: "Agent Manager", name: "agentManager-widget", value: false},
            {displayName: "Queue Manager", name: "queueManager-widget", value: false},
            {displayName: "My Statistics", name: "myStatistics-widget", value: false},
            {displayName: "Set My Phone", name: "myPhone-feature", value: false},
            {displayName: "Allow Outbound", name: "outbound-feature", value: false},
            {displayName: "Allow On Demand Call Recording", name: "CROnDemand-feature", value: false},
            {displayName: "Transfer to Agent", name: "transAgent-feature", value: false},
            {displayName: "Transfer to Queue", name: "transQueue-feature", value: false},
            {displayName: "Transfer to Number", name: "transNumber-feature", value: false},
            {displayName: "Conference to Agent", name: "confAgent-feature", value: false},
            {displayName: "Conference to Queue", name: "confQueue-feature", value: false},
            {displayName: "Conference to Number", name: "confNumber-feature", value: false},
            {displayName: "Change Skills on Conf/Tran", name: "transConfChangeSkills-feature", value: false},
            {displayName: "Agent Name", name: "agentName-edit", value: false},
            {displayName: "Password", name: "agentPassword-edit", value: false},
            {displayName: "Line Out", name: "agentLineOut-visible", value: false},
            {displayName: "Primary SIP Contact", name: "primarySip-edit", value: false},
            {displayName: "SIP Contacts", name: "additionalSip-visible", value: false},
            {displayName: "Ring Timeout", name: "ringTimeout-edit", value: false},
            {displayName: "Max Missed Calls(auto release)", name: "maxMissedCalls-edit", value: false},
            {displayName: "Reset Max Rings On Success", name: "maxRingsSuccess-edit", value: false},
            {displayName: "Auto Logout", name: "autoLogout-visible", value: false},
            {displayName: "Avatar", name: "avatar-visible", value: false},
            {displayName: "Agent Skills", name: "agentSkills-visible", value: false}
        ]
      }
      this.permissions = await this.$agent.p_mfa('ws_db_permission', 'get', [this.id])
        this.permissions.forEach( (key) =>
          {
            let i = this.perms_check.findIndex(E => E.name === key.name)
            if (i >= 0) {
              this.perms_check[i].value = true
              this.perms_check[i].id = key.id
            }
          }
        )
    },
    onChangeCheck: async function(perm, checked) {
      if(checked) {
        let permission = await this.$agent.p_mfa('ws_db_permission', 'create', [this.id, {
            name: perm.name
        }])
        perm.id = permission.id
        this.permissions.push(permission)
      }
      else {
        await this.$agent.p_mfa('ws_db_permission', 'delete', [perm.id])
        let id = this.permissions.findIndex(Obj => Obj.id === perm.id)
        if (id >= 0) {
          this.permissions.splice(id, 1)
        }
      }
    },
    canShow(index) {
      if(this.ui == 'supervisor') {
        let main_perm = 13+this.groups.length + this.queues.length
        if ( !this.perms_check[0].value && index >= main_perm)
          return false
        else if ( !this.perms_check[1].value && index >= 4 && index < main_perm)
          return false
        else
          return true
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
