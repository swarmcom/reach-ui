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

export default {
  name: 'admin-line-in',
  props: ['id'],
  mixins: [Common],
  data () {
    return {
      line_in: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.line_in = await this.$agent.p_mfa('ws_db_line_in', 'get', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_line_in', 'update', [this.id, this.line_in])
        } else {
          await this.$agent.p_mfa('ws_db_line_in', 'create', [this.line_in])
        }
        this.$router.push('/admin/line_ins')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_line_in', 'delete', [this.id])
        this.$router.push('/admin/line_ins')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
