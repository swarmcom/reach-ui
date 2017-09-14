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
      :data="groups"
      :dataArguments="dataArguments"
      :columns="columns"
      :rowsPerPage="rowsPerPage"
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
      rowsPerPage: 0,
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
    if(localStorage.getItem('adminGroupsRows')) this.rowsPerPage = localStorage.getItem('adminGroupsRows')
  },
  watch: {
    rowsPerPage: {
      handler() {
        localStorage.setItem('adminGroupsRows', this.rowsPerPage);
      },
      deep: true,
    },
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>