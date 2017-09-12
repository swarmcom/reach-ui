<template>
<div>
<button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
<form id="search">
  Search <input name="query" v-model="searchQuery">
</form>
<custom-table style="margin-top: 20px"
  :data="profiles"
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
  name: 'admin-profiles',
  data () {
    return {
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
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>