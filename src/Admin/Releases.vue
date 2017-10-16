<template>
<b-table style="margin-top:10px" striped hover responsive :items="releases" :fields="fields">
  <template slot="actions" scope="data">
    <b-btn size="sm" variant="success" @click="entries(data.item)">Entries</b-btn>
  </template>
</b-table>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-releases',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: { label: 'Actions' }
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
    onClick (data) {
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
