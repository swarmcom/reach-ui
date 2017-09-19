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
      :data="line_outs"
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
  name: 'admin-line-outs',
  data () {
    return {
      rowsPerPage: "0",
      searchQuery: '',
      dataArguments: ['id', 'name', 'number'],
      columns: ['Id', 'Name', 'Number'],
      line_outs: []
    }
  },
  methods: {
    query: async function () {
      this.line_outs = await this.$agent.p_mfa('ws_admin', 'get_line_outs')
    },
    add () {
      this.$router.push(`/admin/line_out/`)
    },
    onClicked (data) {
      this.$router.push(`/admin/line_out/${data.id}`)
    },
  },
  created () {
    this.query()
    if (localStorage.getItem('adminLineOutRows')) this.rowsPerPage = localStorage.getItem('adminLineOutRows')
  },
  watch: {
    rowsPerPage: {
      handler () {
        localStorage.setItem('adminLineOutRows', this.rowsPerPage);
      },
      deep: true,
    },
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>