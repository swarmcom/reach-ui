<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Disposition group:</h3>
    </div>
  </div>

  <div class="form">
    <form-text id="name" label="Name" v-model="disposition.name"></form-text>
    <form-text id="description" label="Description" v-model="disposition.description"></form-text>
    <button @click="onCommit" class="btn btn-primary">Commit</button>
    <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
  </div>
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
        this.disposition = await this.$agent.p_mfa('ws_db_disposition_group', 'get', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_disposition_group', 'update', [this.id, this.disposition])
        } else {
          await this.$agent.p_mfa('ws_db_disposition_group', 'create', [this.disposition])
        }
        this.$router.push('/admin/dispositions')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_disposition_group', 'delete', [this.id])
        this.$router.push('/admin/dispositions')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
