<template>
<div class="form">
  <form-text id="name" label="Name" v-model="client.name"></form-text>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Common from './Common'

export default {
  name: 'admin-client',
  props: ['id'],
  components: { 'form-text': FormText },
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