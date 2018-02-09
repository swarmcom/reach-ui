<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>Access lists:</h3>
    </div>
    <div class="col">
      <button @click="add" class="btn btn-outline-success"><icon name="plus" class="align-middle" scale="1"></icon></button>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="acls" :fields="fields">
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
  name: 'admin-acls',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      acls: []
    }
  },
  methods: {
    query: async function () {
      this.acls = await this.$agent.p_mfa('ws_db_acl_group', 'get')
    },
    add () {
      this.$router.push(`/acl/`)
    },
    edit (data) {
      this.$router.push(`/acl/${data.id}`)
    },
    entries (data) {
      this.$router.push(`/acl/${data.id}/entries`)
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
