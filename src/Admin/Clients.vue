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
      :data="clients"
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
  name: 'admin-line-ins',
  data () {
    return {
      rowsPerPage: 20,
      searchQuery: '',
      dataArguments: ['id', 'name'],
      columns: ['Id', 'Name'],
      clients: []
    }
  },
  methods: {
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_admin', 'get_clients')
    },
    add () {
      this.$router.push(`/admin/client/`)
    },
    onClicked (data) {
      this.$router.push(`/admin/client/${data.id}`)
    },
  },
  created () {
    this.query()
    if (localStorage.getItem('adminClientRows')) this.rowsPerPage = localStorage.getItem('adminClientRows')
  },
  watch: {
    rowsPerPage: {
      handler () {
        localStorage.setItem('adminClientRows', this.rowsPerPage);
      },
      deep: true,
    },
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>