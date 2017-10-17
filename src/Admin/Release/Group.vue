<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Release group:</h3>
    </div>
  </div>

  <div class="form">
    <form-text id="name" label="Name" v-model="release.name"></form-text>
    <form-text id="description" label="Description" v-model="release.description"></form-text>
    <button @click="onCommit" class="btn btn-primary">Commit</button>
    <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
  </div>
</div>
</template>

<script>
import Common from '../Common'

export default {
  name: 'admin-release-group',
  props: ['id'],
  mixins: [Common],
  data () {
    return {
      release: {}
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.release = await this.$agent.p_mfa('ws_db_release_group', 'get', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_release_group', 'update', [this.id, this.release])
        } else {
          await this.$agent.p_mfa('ws_db_release_group', 'create', [this.release])
        }
        this.$router.push('/admin/releases')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_release_group', 'delete', [this.id])
        this.$router.push('/admin/releases')
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
