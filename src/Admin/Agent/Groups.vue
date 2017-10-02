<template>
<btable :fields="fields" :data="agent_groups" :add_button=true :filter_button=true :paginate=true></btable>
</template>

<script>
import Btable from '../../Widget/Btable'

export default {
  name: 'admin-agent-groups',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        permissions: { label: 'Permissions', sortable: true },
        ring_timeout: { label: 'Ring Timeout', sortable: true },
        max_ring_fails: { label: 'Max Ring Fails', sortable: true }
      },
      agent_groups: []
    }
  },
  methods: {
    query: async function () {
      this.agent_groups = await this.$agent.p_mfa('ws_admin', 'get_agent_groups')
    },
    add () {
      this.$router.push(`/admin/agent_group/`)
    },
    onClick(data) {
      this.$router.push(`/admin/agent_group/${data.id}`)
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