<template>
<div>
<button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
<form id="search" style="float: right;">
  Filter <input name="query" v-model="searchQuery">
</form>
<custom-table style="margin-top: 20px"
  :data="groups"
  :dataArguments="dataArguments"
  :columns="columns"
  :rowsPerPage="20"
  :filter-key="searchQuery"
  :clickable="1">
</custom-table>
</div>
</template>

<script>
import Common from './Common'
import CustomTable from '../Widget/CustomTable'

export default {
  name: 'admin-groups',
  mixins: [Common],
  data () {
    return {
      searchQuery: '',
      dataArguments: ['id', 'name', 'weight', 'aging_factor', 'hold_music', 'wrapup_enabled'],
      columns: ['Id', 'Name', 'Weight', 'Aging', 'Music', 'Wrap' ],
      groups: []
    }
  },
  methods: {
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_admin', 'get_groups')
    },
    add () {
      this.$router.push(`/admin/group/`)
    },
    onClicked(data) {
      this.$router.push(`/admin/group/${data.id}`)
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