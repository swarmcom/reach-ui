<template>
<div class="form">
  <form-text label="Client Name" v-model="rec.name"></form-text>
  <disposition-groups label="Dispositions" v-model="rec.disposition_group_id"></disposition-groups>
  <luas label="Lua script" v-model="rec.lua_id"></luas>
  <mohs label="Music on hold" v-model="rec.moh_id"></mohs>
  <prompts label="Announce" v-model="rec.announce_id"></prompts>
  <form-select-bool label="Allow Voicemail" v-model="rec.allow_voicemail"></form-select-bool>
  <form-select-bool label="Enable call recording" v-model="rec.enable_call_recording"></form-select-bool>
  <prompts label="Voicemail prompt" v-model="rec.voicemail_prompt_id"></prompts>
  <form-select-bool label="Override Caller ID on Line In" v-model="rec.override_clid_line_in"></form-select-bool>
  <form-select-bool label="Override Caller ID on Line Out" v-model="rec.override_clid_line_out"></form-select-bool>
  <form-text label="Caller ID Name" v-model="rec.caller_id_name"></form-text>
  <form-text label="Caller ID Number" v-model="rec.caller_id_number"></form-text> 
  <div style="margin-top: 20px">
    <button @click="onCommit" class="btn btn-primary">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Obj from './Object'
import Common from './Common'

export default {
  name: 'admin-client',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_client',
      redirect: '/admin/clients'
    }
  },
}
</script>
