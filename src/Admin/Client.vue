<template>
<div class="form">
  <form-text id="name" label="Name" v-model="client.name"></form-text>
  <mohs label="Music on hold" v-model="client.moh_id"></mohs>
  <prompts label="Announce" v-model="client.announce_id"></prompts>
  <form-select-bool label="Allow Voicemail" v-model="client.allow_voicemail"></form-select-bool>
  <form-select-bool label="Enable call recording" v-model="client.enable_call_recording"></form-select-bool>
  <prompts label="Voicemail prompt" v-model="client.voicemail_prompt_id"></prompts>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import MOHs from '../Widget/MOHs.vue'
import Common from './Common'
import FormSelectBool from '../Widget/FormSelectBool.vue'
import Prompts from '../Widget/Prompts.vue'

export default {
  name: 'admin-client',
  props: ['id'],
  components: { 'form-select-bool': FormSelectBool, 'form-text': FormText, mohs: MOHs, prompts: Prompts },
  mixins: [Common],
  data () {
    return {
      client: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.client = await this.$agent.p_mfa('ws_admin', 'get_client', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_admin', 'update_client', [this.id, this.client])
        } else {
          await this.$agent.p_mfa('ws_admin', 'create_client', [this.client])
        }
        this.$router.push('/admin/clients')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_client', [this.id])
        this.$router.push('/admin/clients')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
