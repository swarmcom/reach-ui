<template>
<div v-access:profile-ui class="form" v-bind:class="classObject">
  <form-text v-if="showComponent('agentName-edit')" label="Agent Name" v-model="rec.name"></form-text>
  <form-text label="Login" v-model="rec.login"></form-text>
  <form-text v-if="showComponent('agentPassword-edit')" label="Password" v-model="rec.password"></form-text>
  <agent-groups label="Agent Group" v-model="rec.group_id"></agent-groups>
  <release-groups label="Release Group" v-model="rec.release_group_id" :effective="eff.release_group_id"></release-groups>
  <lines v-if="showComponent('agentLineOut-visible')" label="Line Out" v-model="rec.line_id"></lines>
  <form-text v-if="showComponent('primarySip-edit')" label="Primary Contact" v-model="rec.uri"></form-text>
  <uris v-if="showComponent('additionalSip-visible')" label="Additional Contacts" v-model="rec.uris"></uris>
  <form-text label="Agent Caller ID Number" v-model="rec.caller_id_number"></form-text>
  <form-text v-if="showComponent('ringTimeout-edit')" label="Ring Timeout" v-model="rec.ring_timeout" :effective="eff.ring_timeout"></form-text>
  <form-text label="Suspend Time" v-model="rec.suspend_time"></form-text>
  <form-text v-if="showComponent('maxMissedCalls-edit')" label="Max Missed Calls (auto release)" v-model="rec.max_ring_fails" :effective="eff.max_ring_fails"></form-text>
  <form-select-bool v-if="showComponent('maxRingsSuccess-edit')" label="Reset Max Rings On Success" v-model="rec.reset_rings_fails" :effective="eff.reset_rings_fails"></form-select-bool>
  <form-text v-if="showComponent('autoLogout-edit')" label="Auto Logout" v-model="rec.autologout" :effective="eff.autologout"></form-text>
  <form-file v-if="showComponent('avatar-visible')" label="Avatar" uri="/avatar" v-model="rec.avatar"></form-file>
  <form-tags v-if="showComponent('agentSkills-visible')" label="Agent Skills" placeholder="Skill..." v-model="skills" :effective="effective_skills"></form-tags>
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
        this.$router.push('/main')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onCancel: async function () {
      this.$router.push('/main')
    },
      showComponent(name) {
      if(this.$agent.vm.agent.permissions && this.$agent.vm.agent.permissions[name])
        return true
      else
        return false
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
