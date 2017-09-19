<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <custom-table
      :data="profiles"
      :dataArguments="dataArguments"
      :name="name"
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
      dataArguments: ['id', 'name', 'permissions', 'ring_timeout', 'max_ring_fails'],
      columns: ['Id', 'Name', 'Permissions', 'Ring Timeout', 'Ring Fails'],
      name:"adminProfilesRows",
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