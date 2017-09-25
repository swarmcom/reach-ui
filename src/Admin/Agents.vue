<template>
<btable :fields="fields" :data="agents" :storageName="name" :add_button=true>
</btable>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-agents',
  data () {
    return {
      fields: {
        agent_id: { label: 'Id', sortable: true },
        login: { label: 'Login', sortable: true },
        firstname: { label: 'First Name', sortable: true },
        lastname: { label: 'Last Name', sortable: true },
        permissions: { label: 'Permissions', sortable: true },
        group: { label: 'Group', sortable: true, formatter: (group) => group.name },
        uri: { label: 'Uri', sortable: true }
      },
      agents: [],
      name: "adminAgents"
    }
  },
  methods: {
    query: async function () {
      let agents = await this.$agent.p_mfa('ws_admin', 'get_agents')
      this.agents = agents
      this.totalRows = agents.length
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    onClick (data) {
      this.$router.push(`/admin/agent/${data.agent_id}`)
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