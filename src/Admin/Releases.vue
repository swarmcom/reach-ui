<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>Release groups:</h3>
    </div>
    <div class="col">
      <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="releases" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
      <b-btn size="sm" variant="success" @click="entries(data.item)">Entries</b-btn>
    </template>
  </b-table>
</div>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-releases',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      releases: []
    }
  },
  methods: {
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_db_release_group', 'get')
    },
    add () {
      this.$router.push(`/admin/release/`)
    },
    edit (data) {
      this.$router.push(`/admin/release/${data.id}`)
    },
    entries (data) {
      this.$router.push(`/admin/release/${data.id}/entries`)
    }
  },
  created () {
    this.query()
  },
  components: {
    btable: Btable
  }
}
</script>
