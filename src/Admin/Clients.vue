<template>
  <div>
    <btable
      :fields="fields"
      :data="clients"
      :storageName="name"
      :add_button=true>
    </btable>
  </div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-line-ins',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true }
      },
      name: "adminClient",
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
    onClick (data) {
      this.$router.push(`/admin/client/${data.id}`)
    },
  },
  created () {
    this.query()
  },
  components: {
    'btable': Btable
  }
}
</script>