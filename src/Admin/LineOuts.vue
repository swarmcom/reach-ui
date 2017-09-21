<template>
<div>
  <btable
    :fields="fields"
    :data="line_outs"
    :storageName="name"
    :add_button=true>
  </btable>
</div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-line-outs',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        number: { label: 'Number', sortable: true },
        client: { label: 'Client', sortable: true }
      },
      name: "adminLineOuts",
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
  },
  components: {
    'btable': Btable
  }
}
</script>