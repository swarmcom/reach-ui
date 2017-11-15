<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>Tag groups:</h3>
    </div>
    <div class="col">
      <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="tags" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
      <b-btn size="sm" variant="success" @click="entries(data.item)">Entries</b-btn>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  name: 'admin-tag-groups',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      tags: []
    }
  },
  methods: {
    query: async function () {
      this.tags = await this.$agent.p_mfa('ws_db_tag_group', 'get')
    },
    add () {
      this.$router.push(`/admin/tag_group/`)
    },
    edit (data) {
      this.$router.push(`/admin/tag_group/${data.id}`)
    },
    entries (data) {
      this.$router.push(`/admin/tag_group/${data.id}/entries`)
    }
  },
  created () {
    this.query()
  }
}
</script>
