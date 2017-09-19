<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <custom-table
      :data="clients"
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
      name:"adminClientRows",
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
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>