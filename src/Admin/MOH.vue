<template>
<div class="form">
  <form-text id="name" label="Name" v-model="moh.name"></form-text>
  <form-text id="description" label="Description" v-model="moh.description"></form-text>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Common from './Common'

export default {
  name: 'admin-moh',
  props: ['id'],
  components: { 'form-text': FormText },
  mixins: [Common],
  data () {
    return {
      moh: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.moh = await this.$agent.p_mfa('ws_admin', 'get_moh', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_admin', 'update_moh', [this.id, this.moh])
        } else {
          await this.$agent.p_mfa('ws_admin', 'create_moh', [this.moh])
        }
        this.$router.push('/admin/mohs')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_admin', 'delete_moh', [this.id])
        this.$router.push('/admin/mohs')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
