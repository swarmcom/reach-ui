<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>Roles:</h3>
    </div>
    <div class="col">
      <button @click="add" class="btn btn-outline-success pointer"><icon name="plus" class="align-middle" scale="1"></icon></button>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="roles" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn class="pointer" size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
      <b-btn class="pointer" size="sm" variant="success" @click="permissions(data.item)">Permissions</b-btn>
    </template>
  </b-table>
</div>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-roles',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      roles: []
    }
  },
  methods: {
    query: async function () {
      this.roles = await this.$agent.p_mfa('ws_db_role', 'get')
    },
    add () {
      this.$router.push(`/role/`)
    },
    edit (data) {
      this.$router.push(`/role/${data.id}`)
    },
    permissions (data) {
      this.$router.push(`/role/${data.id}/permissions/${data.ui}`)
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
