<template>
<div>
  <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
  <b-table striped hover small responsive :sort-by="sortBy" :items="line_outs" :fields="fields" @row-clicked="onClick">
  </b-table>
</div>
</template>

<script>
export default {
  name: 'admin-line-outs',
  data () {
    return {
      fields: ['id', 'name', 'number', 'client'],
      sortBy: 'id',
      line_outs: []
    }
  },
  methods: {
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_admin', 'get_clients')
      let line_outs = await this.$agent.p_mfa('ws_admin', 'get_line_outs')
      line_outs.forEach( (line) => line.client = this.client(line.client_id) )
      this.line_outs = line_outs
    },
    add () {
      this.$router.push(`/admin/line_out/`)
    },
    onClick (data) {
      this.$router.push(`/admin/line_out/${data.id}`)
    },
    client (Id) {
      let Client = this.clients.find(I => I.id == Id)
      return Client ? Client.name : Id
    }
  },
  created () {
    this.query()
  }
}
</script>