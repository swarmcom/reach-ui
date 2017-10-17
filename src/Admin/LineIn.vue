<template>
<div class="form">
  <form-text id="name" label="Name" v-model="line_in.name"></form-text>
  <form-text id="description" label="Description" v-model="line_in.description"></form-text>
  <disposition-groups label="Dispositions" v-model="line_in.disposition_group_id"></disposition-groups>
  <queues label="Queue" v-model="line_in.queue_id"></queues>
  <clients label="Client" v-model="line_in.client_id"></clients>
  <prompts label="Announce" v-model="line_in.announce_id"></prompts>
  <form-select-bool label="Allow Voicemail" v-model="line_in.allow_voicemail"></form-select-bool>
  <form-select-bool label="Enable call recording" v-model="line_in.enable_call_recording"></form-select-bool>
  <prompts label="Voicemail prompt" v-model="line_in.voicemail_prompt_id"></prompts>
  <form-select-bool label="Override Caller ID" v-model="line_in.override_clid"></form-select-bool>
  <form-text label="Caller ID name" v-model="line_in.caller_id_name"></form-text>
  <form-text label="Caller ID number" v-model="line_in.caller_id_number"></form-text> 
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
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
      module: 'ws_db_line_in',
      redirect: '/admin/line_ins'
    }
  }
}
</script>
