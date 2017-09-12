<template>
<div>
<button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
<form id="search">
  Search <input name="query" v-model="searchQuery">
</form>
<custom-table style="margin-top: 20px"
  :data="releases"
  :dataArguments="dataArguments"
  :columns="columns"
  :filter-key="searchQuery"
  :clickable="1">
</custom-table>
</div>
</template>

<script>
import CustomTable from '../Widget/CustomTable'

export default {
  name: 'admin-releases',
  data () {
    return {
      searchQuery: '',
      dataArguments: ['id', 'name', 'score'],
      columns: ['Id', 'Name', 'Score'],
      releases: []
    }
  },
  methods: {
    query: async function () {
      this.releases = await this.$agent.p_mfa('ws_admin', 'get_releases')
    },
    add () {
      this.$router.push(`/admin/release/`)
    },
    onClicked (data) {
      this.$router.push(`/admin/release/${data.id}`)
    },
  },
  created () {
    this.query()
  },
  components: {
   'custom-table': CustomTable
  }
}
</script>