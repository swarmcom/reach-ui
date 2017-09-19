<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <custom-table
      :data="line_outs"
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
  name: 'admin-line-outs',
  data () {
    return {
      dataArguments: ['id', 'name', 'number'],
      columns: ['Id', 'Name', 'Number'],
      name: "adminLineOutRows",
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
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>