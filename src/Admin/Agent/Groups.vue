<template>
<btable :fields="fields" :data="agent_groups" :add_button=true :filter_button=true :paginate=true></btable>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-agent-groups',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        role: { label: 'Role', sortable: true, formatter: (role) => role.name },
        ring_timeout: { label: 'Ring Timeout', sortable: true },
        max_ring_fails: { label: 'Max Ring Fails', sortable: true }
      },
      agent_groups: []
    }
  },
  methods: {
    query: async function () {
      this.agent_groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
    },
    add () {
      this.$router.push(`/agent_group/`)
    },
    onClick(data) {
      this.$router.push(`/agent_group/${data.id}`)
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
