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
      :data="profiles"
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
  name: 'admin-profiles',
  data () {
    return {
      rowsPerPage: "0",
      searchQuery: '',
      dataArguments: ['id', 'name', 'permissions', 'ring_timeout', 'max_ring_fails'],
      columns: ['Id', 'Name', 'Permissions', 'Ring Timeout', 'Ring Fails'],
      profiles: []
    }
  },
  methods: {
    query: async function () {
      this.profiles = await this.$agent.p_mfa('ws_admin', 'get_profiles')
    },
    add () {
      this.$router.push(`/admin/profile/`)
    },
    onClicked(data) {
      this.$router.push(`/admin/profile/${data.id}`)
    }
  },
  created () {
    this.query()
    if(localStorage.getItem('adminProfilesRows')) this.rowsPerPage = localStorage.getItem('adminProfilesRows')
  },
  watch: {
    rowsPerPage: {
      handler() {
        localStorage.setItem('adminProfilesRows', this.rowsPerPage);
      },
      deep: true,
    },
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>