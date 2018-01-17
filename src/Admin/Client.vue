<template>
<div class="form">
  <form-text label="Client Name" v-model="rec.name"></form-text>
  <disposition-groups label="Disposition Group" v-model="rec.disposition_group_id"></disposition-groups>
  <luas label="Lua script" v-model="rec.lua_id"></luas>
  <mohs label="Music on hold" v-model="rec.moh_id"></mohs>
  <prompts label="Announce" v-model="rec.announce_id"></prompts>
  <form-select-bool label="Allow Voicemail" v-model="rec.allow_voicemail"></form-select-bool>
  <prompts label="Voicemail prompt" v-model="rec.voicemail_prompt_id"></prompts>
  <form-call-recording label="Call recording" v-model="rec.enable_call_recording"></form-call-recording>
  <form-select-bool label="Override Caller ID on Line In" v-model="rec.override_clid_line_in"></form-select-bool>
  <form-select-bool label="Override Caller ID on Line Out" v-model="rec.override_clid_line_out"></form-select-bool>
  <form-text label="Caller ID Name" v-model="rec.caller_id_name"></form-text>
  <form-text label="Caller ID Number" v-model="rec.caller_id_number"></form-text> 
  <form-file label="Client Avatar" uri="/avatar" v-model="rec.avatar"></form-file>
  <form-tags label="Client Skills" placeholder="Skill..." v-model="skills"></form-tags>
  <div style="margin-top: 20px">
    <button @click="onCommit" class="btn btn-primary pointer">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary pointer">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right pointer">Delete</button>
  </div>

  <help></help>
</div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'
import FormCallRecording from '@/Widget/FormCallRecording'

export default {
  name: 'admin-client',
  props: ['id'],
  mixins: [Common, Obj],
  components: { 'form-call-recording': FormCallRecording },
  data () {
    return {
      rec: {},
      skills: [],
      module: 'ws_db_client',
      redirect: '/clients'
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa(this.module, 'get', [this.id])
        this.skills = this.skills2list(this.rec.skills)
      }
    },
    onCommit: async function () {
      this.rec.skills = this.list2skills(this.skills)
      try {
        if (this.id) {
          await this.$agent.p_mfa(this.module, 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa(this.module, 'create', [this.rec])
        }
        this.$router.push(this.redirect)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
  }
}
</script>
