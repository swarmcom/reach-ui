<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>Domains:</h3>
    </div>
    <div class="col">
      <button @click="add" class="btn btn-outline-success"><icon name="plus" class="align-middle" scale="1"></icon></button>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="domains" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
      <b-btn size="sm" variant="secondary" @click="dialplan(data.item)">Dialplan</b-btn>
      <b-btn size="sm" variant="success" @click="admins(data.item)">Admins</b-btn>
    </template>
  </b-table>
</div>
</template>

<script>
export default {
  name: 'admin-domains',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      domains: []
    }
  },
  methods: {
    query: async function () {
      this.domains = await this.$agent.p_mfa('ws_kam_domain', 'get')
    },
    add () {
      this.$router.push(`/kam/domain/`)
    },
    edit (data) {
      this.$router.push(`/kam/domain/${data.id}`)
    },
    nodes (data) {
      this.$router.push(`/kam/domain/${data.id}/nodes`)
    },
    dialplan (data) {
      this.$router.push(`/kam/domain/${data.id}/dialplan`)
    },
    admins (data) {
      this.$router.push(`/kam/domain/${data.id}/admins`)
    }
  },
  created () {
    this.query()
  }
}
</script>
