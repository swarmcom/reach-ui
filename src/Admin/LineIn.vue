<template>
<div class="form">
  <form-text id="name" label="Name" v-model="line_in.name"></form-text>
  <form-text id="description" label="Description" v-model="line_in.description"></form-text>
  <queues label="Queue" v-model="line_in.queue_id"></queues>
  <clients label="Client" v-model="line_in.client_id"></clients>
  <prompts label="Announce" v-model="line_in.announce_id"></prompts>
  <form-select-bool label="Allow Voicemail" v-model="line_in.allow_voicemail"></form-select-bool>
  <prompts label="Voicemail prompt" v-model="line_in.voicemail_prompt_id"></prompts>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import FormSelectBool from '../Widget/FormSelectBool.vue'
import Queues from '../Widget/Queues.vue'
import Clients from '../Widget/Clients.vue'
import Prompts from '../Widget/Prompts.vue'
import Common from './Common'

export default {
  name: 'admin-line-in',
  props: ['id'],
  components: { 'form-select-bool': FormSelectBool, 'form-text': FormText, 'queues': Queues, 'clients': Clients, prompts: Prompts },
  mixins: [Common],
  data () {
    return {
      line_in: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.line_in = await this.$agent.p_mfa('ws_admin', 'get_line_in', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_admin', 'update_line_in', [this.id, this.line_in])
        } else {
          await this.$agent.p_mfa('ws_admin', 'create_line_in', [this.line_in])
        }
        this.$router.push('/admin/line_ins')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_line_in', [this.id])
        this.$router.push('/admin/line_ins')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
