<template>
<div class="form">
  <form-text label="Agent Name" v-model="rec.name"></form-text>
  <form-text label="Login" v-model="rec.login"></form-text>
  <form-text label="Password" v-model="rec.password"></form-text>
  <agent-groups label="Agent Group" v-model="rec.group_id"></agent-groups>
  <release-groups label="Release Group" v-model="rec.release_group_id" :effective="eff.release_group_id"></release-groups>
  <lines label="Line Out" v-model="rec.line_id"></lines>
  <line-outs label="Lines Out" v-model="rec.lines"></line-outs>
  <roles label="Role" v-model="rec.role_id" :effective="eff.role_id"></roles>
  <acls label="Access list" v-model="rec.acl_group_id" :effective="eff.acl_group_id"></acls>
  <form-text label="Primary Contact" v-model="rec.uri"></form-text>
  <uris label="Additional Contacts" v-model="rec.uris"></uris>
  <form-text label="Agent Caller ID Number" v-model="rec.caller_id_number"></form-text>
  <form-text label="Ring Timeout" v-model="rec.ring_timeout" :effective="eff.ring_timeout"></form-text>
  <form-text label="Suspend Time" v-model="rec.suspend_time"></form-text>
  <form-text label="Max Missed Calls (auto release)" v-model="rec.max_ring_fails" :effective="eff.max_ring_fails"></form-text>
  <form-select-bool label="Reset Max Rings On Success" v-model="rec.reset_rings_fails" :effective="eff.reset_rings_fails"></form-select-bool>
  <form-text label="Auto Logout" v-model="rec.autologout" :effective="eff.autologout"></form-text>
  <form-bool label="Persistent" v-model="rec.persistent"></form-bool>
  <tag-group label="Skills Group" v-model="rec.tag_group_id" :effective="eff.tag_group_id"></tag-group>
  <form-file label="Avatar" uri="/avatar" v-model="rec.avatar"></form-file>
  <form-tags label="Agent Skills" placeholder="Skill..." v-model="skills" :effective="effective_skills"></form-tags>

  <div style="margin-top:20px">
    <button @click="onCommit" class="btn btn-primary">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import URIs from '@/Widget/URIs'
import FormTextEffective from '@/Widget/FormTextEffective'
import LineOuts from '@/Widget/LineOuts'

export default {
  name: 'admin-agent',
  mixins: [Common],
  components: { uris: URIs, 'form-text-effective': FormTextEffective, 'line-outs': LineOuts },
  props: ['id'],
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
      if (this.id) {
        this.rec = await this.$agent.p_mfa('ws_db_agent', 'get', [this.id])
        this.eff = await this.$agent.p_mfa('ws_db_agent', 'effective', [this.id])
        this.skills = this.skills2list(this.rec.skills)
        this.effective_skills = this.skills2list(this.eff.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_agent', 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa('ws_db_agent', 'create', [this.rec])
        }
        this.$router.go(-1)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_agent', 'delete', [this.id])
        this.$router.go(-1)
      }
    },
    onCancel () {
      this.$router.go(-1)
    },
  },
  created () {
    this.query()
  }
}
</script>
