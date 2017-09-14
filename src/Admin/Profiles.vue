<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <div style="float: right">
      Rows
      <input v-model.number="rowsPerPage" type="number" min="0" style="height:38px">
      Filter
      <input v-model="searchQuery" type="text" style="height:38px">
    </div>
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
      rowsPerPage: 0,
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