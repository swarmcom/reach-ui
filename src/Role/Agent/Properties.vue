<template>
  <div
    v-access:profile-ui
    class="form"
  >
    <form-text
      v-model="rec.name"
      v-access:agent-profile-edit-name
      label="Agent Name"
    />
    <form-text
      v-model="rec.login"
      label="Login"
    />
    <form-password
      v-model="rec.password"
      v-access:agent-profile-edit-password
      label="Password"
    />
    <profile-agent-groups
      v-model="rec.group_id"
      label="Agent Group"
    />
    <profile-release-groups
      v-model="rec.release_group_id"
      label="Release Group"
      :effective="eff.release_group_id"
    />
    <profile-lines
      v-model="rec.line_id"
      v-access:agent-profile-edit-line-out
      label="Line Out"
      :effective="eff.line_id ? eff.line.name : ''"
    />
    <form-text
      v-model="rec.uri"
      v-access:agent-profile-edit-primary-sip
      label="Primary Contact"
    />
    <uris
      v-model="rec.uris"
      v-access:agent-profile-edit-additional-sip
      label="Additional Contacts"
    />
    <form-text
      v-model="rec.caller_id_number"
      label="Agent Caller ID Number"
    />
    <form-text
      v-model="rec.ring_timeout"
      v-access:agent-profile-edit-ring-timeout
      label="Ring Timeout"
      :effective="eff.ring_timeout"
    />
    <form-text
      v-model="rec.suspend_time"
      label="Suspend Time"
    />
    <form-text
      v-model="rec.max_ring_fails"
      v-access:agent-profile-edit-max-missed-calls
      label="Max Missed Calls (auto release)"
      :effective="eff.max_ring_fails"
    />
    <form-select-bool
      v-model="rec.reset_rings_fails"
      v-access:agent-profile-edit-max-ring-success
      label="Reset Max Rings On Success"
      :effective="eff.reset_rings_fails"
    />
    <form-text
      v-model="rec.autologout"
      v-access:agent-profile-edit-autologout
      label="Auto Logout"
      :effective="eff.autologout"
    />
    <form-file
      v-model="rec.avatar"
      v-access:agent-profile-edit-avatar
      label="Avatar"
      uri="/avatar"
      :file-type="'image/*'"
    />
    <form-tags
      v-model="skills"
      v-access:agent-profile-edit-agent-skills
      label="Agent Skills"
      effective-label="Agent Inherited Skills"
      placeholder="Skill..."
      :effective="effective_skills"
    />
    <div style="margin-top:20px">
      <button
        class="btn btn-primary pointer"
        @click="onCommit"
      >
        Save
      </button>
      <button
        class="btn btn-outline-primary float-right pointer"
        @click="onCancel"
      >
        Cancel
      </button>
    </div>
    <help />
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import URIs from '@/Widget/URIs'
import FormPassword from '@/Widget/FormPassword'
import ProfileAgentGroups from '@/Agent/Profile/Agent/Groups'
import ProfileReleaseGroups from '@/Agent/Profile/Release/Groups'
import ProfileLines from '@/Agent/Profile/Lines'

export default {
  name: "AgentProperties",
  components: {
    uris: URIs,
    "form-password": FormPassword,
    "profile-agent-groups": ProfileAgentGroups,
    "profile-release-groups": ProfileReleaseGroups,
    "profile-lines": ProfileLines
  },
  mixins: [Common],
  data () {
    return {
      rec: {},
      eff: {},
      skills: [],
      effective_skills: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.rec = await this.$agent.p_mfa("ws_agent", "get", [])
      this.eff = await this.$agent.p_mfa("ws_agent", "effective", [])
      this.skills = this.skills2list(this.rec.skills)
      this.effective_skills = this.skills2list(this.eff.skills)
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        await this.$agent.p_mfa("ws_agent", "update", [this.rec])
        this.$router.go(-1)
      } catch (error) {
        this.$notify({ title: "Data error:", text: error, type: "error" })
      }
    },
    onCancel () {
      this.$router.go(-1)
    }
  }
}
</script>
