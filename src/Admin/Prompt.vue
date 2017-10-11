<template>
<div class="form">
  <form-text id="name" label="Name" v-model="prompt.name"></form-text>
  <form-text id="description" label="Description" v-model="prompt.description"></form-text>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Common from './Common'

export default {
  name: 'admin-prompt',
  props: ['id'],
  components: { 'form-text': FormText },
  mixins: [Common],
  data () {
    return {
      prompt: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.prompt = await this.$agent.p_mfa('ws_admin', 'get_prompt', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_admin', 'update_prompt', [this.id, this.prompt])
        } else {
          await this.$agent.p_mfa('ws_admin', 'create_prompt', [this.prompt])
        }
        this.$router.push('/admin/prompts')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_prompt', [this.id])
        this.$router.push('/admin/prompts')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
