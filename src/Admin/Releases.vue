<template>
<div>
  <b-row>
    <b-col>
      <b-btn class="pointer" title="Add Release Group" variant="outline-success" @click="add"><icon name="plus" class="align-middle" scale="1"></icon></b-btn>
    </b-col>
  </b-row>

  <b-table style="margin-top:10px" striped hover small :items="releases" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn class="pointer" size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
      <b-btn class="pointer" size="sm" variant="success" @click="entries(data.item)">Entries</b-btn>
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
      this.$router.push(`/release/`)
    },
    edit (data) {
      this.$router.push(`/release/${data.id}`)
    },
    entries (data) {
      this.$router.push(`/release/${data.id}/entries`)
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
