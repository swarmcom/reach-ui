<template>
<btable :fields="fields" :data="clients" :add_button=true></btable>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-clients',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true }
      },
      clients: []
    }
  },
  methods: {
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
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
    btable: Btable
  }
}
</script>
