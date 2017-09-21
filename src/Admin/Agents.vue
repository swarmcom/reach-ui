<template>
  <div>
    <btable
      :fields="fields"
      :data="agents"
      :storageName="name"
      :add_button=true>
    </btable>
  </div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-agents',
  data () {
    return {
      fields: {
        agent_id: { label: 'Id', sortable: true },
        login: { label: 'Login', sortable: true  },
        firstname: { label: 'First Name', sortable: true  },
        lastname: { label: 'Last Name', sortable: true  },
        permissions: { label: 'Permissions', sortable: true  },
        group: { label: 'Group', sortable: true  },
        uri: { label: 'Uri', sortable: true  }
      },
      agents: [],
      groups: [],
      name: "adminAgents"
    }
  },
  methods: {
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_admin', 'get_profiles')
      let agents = await this.$agent.p_mfa('ws_admin', 'get_agents')
      agents.forEach( (agent) => agent.group = this.group(agent.group_id) )
      this.agents = agents
      this.totalRows = agents.length
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    group (Id) {
      let Group = this.groups.find(I => I.id == Id)
      return Group ? Group.name : ''
    },
    onClick (data) {
      this.$router.push(`/admin/agent/${data.agent_id}`)
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