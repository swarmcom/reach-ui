<template>
<div class="form">
  <form-text id="name" label="Name" v-model="disposition.name"></form-text>
  <form-text id="description" label="Description" v-model="disposition.description"></form-text>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Common from './Common'

export default {
  name: 'admin-disposition',
  props: ['id'],
  mixins: [Common],
  data () {
    return {
      disposition: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.disposition = await this.$agent.p_mfa('ws_db_disposition', 'get', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_disposition', 'update', [this.id, this.disposition])
        } else {
          await this.$agent.p_mfa('ws_db_disposition', 'create', [this.disposition])
        }
        this.$router.push('/admin/dispositions')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_disposition', 'delete', [this.id])
        this.$router.push('/admin/dispositions')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
