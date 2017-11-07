<template>
<div class="form">
  <form-text label="Line-In Name" v-model="rec.name"></form-text>
  <form-text label="Line-In Description" v-model="rec.description"></form-text>
  <disposition-groups label="Dispositions" v-model="rec.disposition_group_id" :effective="eff.disposition_group_id"></disposition-groups>
  <luas label="Entry Lua Script" v-model="rec.entry_lua_id" :effective="eff.entry_lua_id"></luas>
  <luas label="Exit Lua Script" v-model="rec.exit_lua_id" :effective="eff.exit_lua_id"></luas>
  <luas label="Agent Lua Script" v-model="rec.uri_lua_id" :effective="eff.uri_lua_id"></luas>
  <queues label="Queue" v-model="rec.queue_id"></queues>
  <clients label="Client" v-model="rec.client_id"></clients>
  <prompts label="Welcome Message" v-model="rec.announce_id" :effective="eff.announce_id"></prompts>
  <form-select-bool label="Allow Voicemail" v-model="rec.allow_voicemail"></form-select-bool>
  <form-select-bool label="Enable call recording" v-model="rec.enable_call_recording" :effective="eff.enable_call_recording"></form-select-bool>
  <prompts label="Voicemail Prompt" v-model="rec.voicemail_prompt_id" :effective="eff.voicemail_prompt_id"></prompts>
  <form-select-bool label="Override Caller ID" v-model="rec.override_clid" :effective="eff.override_clid"></form-select-bool>
  <form-text label="Caller ID Name" v-model="rec.caller_id_name" :effective="eff.caller_id_name"></form-text>
  <form-text label="Caller ID Number" v-model="rec.caller_id_number" :effective="eff.caller_id_number"></form-text>
  <div style="margin-top: 20px">
    <button @click="onCommit" class="btn btn-primary">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from './Common'
import Obj from './Object'

export default {
  name: 'admin-line-in',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      eff: {},
      module: 'ws_db_line_in',
      redirect: '/admin/line_ins'
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa(this.module, 'get', [this.id])
        this.eff = await this.$agent.p_mfa(this.module, 'inherited', [this.id])
      }
    }
  }
}
</script>
