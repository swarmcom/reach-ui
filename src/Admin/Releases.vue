<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <custom-table
      :data="releases"
      :dataArguments="dataArguments"
      :columns="columns"
      :name="name"
      :sortKey="sortKey"
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
      dataArguments: ['id', 'name', 'score'],
      columns: ['Id', 'Name', 'Score'],
      name: "adminReleasesRows",
      sortKey: "Id",
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