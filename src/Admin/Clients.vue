<template>
  <btable
    :fields="fields"
    :data="clients"
    :add-button="true"
    tooltip="Add Client"
    :filter-button="true"
    :paginate="true"
  />
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'AdminClients',
  components: {
    btable: Btable
  },
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true }
      },
      clients: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
    },
    add () {
      this.$router.push(`/client/`)
    },
    onClick (data) {
      this.$router.push(`/client/${data.id}`)
    },
  }
}
</script>
