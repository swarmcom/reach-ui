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
      :data="line_ins"
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
      dataArguments: ['id', 'name', 'number'],
      columns: ['Id', 'Name', 'Number'],
      line_ins: []
    }
  },
  methods: {
    query: async function () {
      this.line_ins = await this.$agent.p_mfa('ws_admin', 'get_line_ins')
    },
    add () {
      this.$router.push(`/admin/line_in/`)
    },
    onClicked (data) {
      this.$router.push(`/admin/line_in/${data.id}`)
    },
  },
  created () {
    this.query()
    if (localStorage.getItem('adminLineInRows')) this.rowsPerPage = localStorage.getItem('adminLineInRows')
  },
  watch: {
    rowsPerPage: {
      handler () {
        localStorage.setItem('adminLineInRows', this.rowsPerPage);
      },
      deep: true,
    },
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>