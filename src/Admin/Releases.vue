<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <form class="form-inline float-right">
      <label for="rowsInput" class="col-form-label">Rows</label>
      <input type="number" class="form-control" v-model="rowsPerPage" id="rowsInput">
      <label for="filterInput" class="col-form-label">Filter</label>
      <input type="string" class="form-control" v-model="searchQuery" id="filterInput">
    </form>
    <custom-table style="margin-top: 20px"
      :data="releases"
      :dataArguments="dataArguments"
      :columns="columns"
      :rowsPerPage="rowsPerPage"
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
      rowsPerPage: "0",
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
    if(localStorage.getItem('adminReleasesRows')) this.rowsPerPage = localStorage.getItem('adminReleasesRows')
  },
  watch: {
    rowsPerPage: {
      handler() {
        localStorage.setItem('adminReleasesRows', this.rowsPerPage);
      },
      deep: true,
    },
  },
  components: {
   'custom-table': CustomTable
  }
}
</script>