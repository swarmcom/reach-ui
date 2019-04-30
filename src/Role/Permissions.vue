<template>
  <div v-access:profile-ui>
    <b-row style="margin-top: 10px">
      <b-col cols="6">
        <b-row>
          <b-col cols="6">
            <h4>Available Tabs:</h4>
          </b-col>
        </b-row>
        <b-row
          v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'ui')"
          :key="index"
        >
          <b-col v-if="names[value]">
            &nbsp;&nbsp;{{ names[value].name }}
          </b-col>
        </b-row>
        <b-row style="margin-top: 15px">
          <b-col cols="6">
            <h4>
              UI Features:
            </h4>
          </b-col>
        </b-row>
        <b-row
          v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'agent-feature')"
          :key="index"
        >
          <b-col v-if="names[value]">
            &nbsp;&nbsp;{{ names[value].name }}
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="6">
        <b-row>
          <b-col cols="6">
            <h4>
              Available Widgets:
            </h4>
          </b-col>
        </b-row>
        <b-row
          v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'widget')"
          :key="index"
        >
          <b-col v-if="names[value]">
            &nbsp;&nbsp;{{ names[value].name }}
          </b-col>
        </b-row>
        <b-row
          v-if="this.$agent.role() == 'supervisor'"
          style="margin-top: 15px"
        >
          <b-col cols="6">
            <h4>
              Call Features:
            </h4>
          </b-col>
        </b-row>
        <b-row
          v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'supervisor-feature')"
          :key="index"
        >
          <b-col v-if="names[value]">
            &nbsp;&nbsp;{{ names[value].name }}
          </b-col>
        </b-row>
        <b-row style="margin-top: 15px">
          <b-col cols="6">
            <h4>
              Agent Profile:
            </h4>
          </b-col>
        </b-row>
        <b-row
          v-for="(value, key) of isVisible(this.$agent.vm.agent.permissions, 'agent-profile')"
          :key="key"
        >
          <b-col v-if="names[value]">
            &nbsp;&nbsp;{{ names[value].name }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'AgentPermissions',
  data () {
    return {
      names: {
        "profile-ui": { name: "Profile" },
        "reports-ui": { name: "Reports" },
        "monitor-ui": { name: "Monitor" },
        "widget-my-statistics": { name: "My Statistics" },
        "supervisor-feature-control-agent-state": { name: "Control Agent State" },
        "supervisor-feature-barge": { name: "Barge" },
        "supervisor-feature-take-over": { name: "Take Over" },
        "supervisor-feature-take-call-queue": { name: "Take call from queue" },
        "supervisor-feature-hangup-call-queue": { name: "Hangup call from queue"},
        "agent-feature-my-phone": { name: "Set My Phone" },
        "agent-feature-outbound-calling": { name: "Allow Outbound" },
        "agent-feature-call-recording-on-demand": { name: "Allow On Demand Call Recording" },
        "agent-feature-transfer-agent": { name: "Transfer to Agent" },
        "agent-feature-transfer-queue": { name: "Transfer to Queue" },
        "agent-feature-transfer-number": { name: "Transfer to Number" },
        "agent-feature-conference-agent": { name: "Conference to Agent" },
        "agent-feature-conference-queue": { name: "Conference to Queue" },
        "agent-feature-conference-number": { name: "Conference to Number" },
        "agent-feature-conference-change-skills": { name: "Change Skills on Conf/Tran" },
        "agent-profile-edit-name": { name: "Name" },
        "agent-profile-edit-password": { name: "Password" },
        "agent-profile-edit-line-out": { name: "Line Out" },
        "agent-profile-edit-primary-sip": { name: "Primary SIP Contact" },
        "agent-profile-edit-additional-sip": { name: "SIP Contacts" },
        "agent-profile-edit-ring-timeout": { name: "Ring Timeout" },
        "agent-profile-edit-max-missed-calls": { name: "Max Missed Calls" },
        "agent-profile-edit-max-ring-success": { name: "Reset Max Rings On Success" },
        "agent-profile-edit-autologout": { name: "Auto Logout" },
        "agent-profile-edit-avatar": { name: "Avatar" },
        "agent-profile-edit-agent-skills": { name: "Agent Skills" }
      }
    }
  },
  methods: {
    isVisible: function (perm, type) {
      return Object.keys(perm).filter( Perm => Perm.includes(type) )
    }
  },
}
</script>
