<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <custom-table
      :data="line_ins"
      :dataArguments="dataArguments"
      :columns="columns"
      :name="name"
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
      name: "adminLineInRows",
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
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>