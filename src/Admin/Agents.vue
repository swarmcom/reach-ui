<template>
<btable :fields="fields" :data="agents" :add_button=true></btable>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-agents',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        login: { label: 'Login', sortable: true },
        name: { label: 'Name', sortable: true },
        role: { label: 'Role', sortable: true, formatter: (role) => role.name },
        group: { label: 'Group', sortable: true, formatter: (group) => group.name },
        uri: { label: 'Uri', sortable: true }
      },
      agents: []
    }
  },
  methods: {
    query: async function () {
      let agents = await this.$agent.p_mfa('ws_db_agent', 'get')
      this.agents = agents
      this.totalRows = agents.length
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    onClick (data) {
      this.$router.push(`/admin/agent/${data.id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    btable: Btable
  }
}
</script>
