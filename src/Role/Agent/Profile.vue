<template>
<div v-access:profile-ui class="form" v-bind:class="classObject">
  <form-text v-access:agentName-edit label="Agent Name" v-model="rec.name"></form-text>
  <form-text label="Login" v-model="rec.login"></form-text>
  <form-text v-access:agentPassword-edit label="Password" v-model="rec.password"></form-text>
  <agent-groups label="Agent Group" v-model="rec.group_id"></agent-groups>
  <release-groups label="Release Group" v-model="rec.release_group_id" :effective="eff.release_group_id"></release-groups>
  <lines v-access:agentLineOut-visible label="Line Out" v-model="rec.line_id"></lines>
  <form-text v-access:primarySip-edit label="Primary Contact" v-model="rec.uri"></form-text>
  <uris v-access:additionalSip-visible label="Additional Contacts" v-model="rec.uris"></uris>
  <form-text label="Agent Caller ID Number" v-model="rec.caller_id_number"></form-text>
  <form-text v-access:ringTimeout-edit label="Ring Timeout" v-model="rec.ring_timeout" :effective="eff.ring_timeout"></form-text>
  <form-text label="Suspend Time" v-model="rec.suspend_time"></form-text>
  <form-text v-access:maxMissedCalls-edit label="Max Missed Calls (auto release)" v-model="rec.max_ring_fails" :effective="eff.max_ring_fails"></form-text>
  <form-select-bool v-access:maxRingsSuccess-edit label="Reset Max Rings On Success" v-model="rec.reset_rings_fails" :effective="eff.reset_rings_fails"></form-select-bool>
  <form-text v-access:autoLogout-visible label="Auto Logout" v-model="rec.autologout" :effective="eff.autologout"></form-text>
  <form-file v-access:avatar-visible label="Avatar" uri="/avatar" v-model="rec.avatar" :fileType="'image/*'"></form-file>
  <form-tags v-access:agentSkills-visible label="Agent Skills" placeholder="Skill..." v-model="skills" :effective="effective_skills"></form-tags>
  <div style="margin-top:20px">
    <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary  float-right pointer">Cancel</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import URIs from '@/Widget/URIs'
import FormTextEffective from '@/Widget/FormTextEffective'

export default {
  name: 'agent-profile',
  components: { uris: URIs, 'form-text-effective': FormTextEffective },
  mixins: [Common],
  data () {
    return {
      rec: {},
      eff: {},
      skills: [],
      effective_skills: []
    }
  },
  methods: {
    query: async function () {
      this.rec = await this.$agent.p_mfa('ws_agent', 'get', [])
      this.eff = await this.$agent.p_mfa('ws_agent', 'effective', [])
      this.skills = this.skills2list(this.rec.skills)
      this.effective_skills = this.skills2list(this.eff.skills)
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        await this.$agent.p_mfa('ws_agent', 'update', [this.rec])
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onCancel () {
      this.$router.go(-1)
    }
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenProfile"] = this.$agent.vm.isNarrowLayout.profile
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.profile,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.profile
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
