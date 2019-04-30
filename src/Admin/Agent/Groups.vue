<template>
  <btable
    :fields="fields"
    :data="agent_groups"
    :add-button="true"
    tooltip="Add Agent Group"
    :filter-button="true"
    :paginate="true"
  />
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'AdminAgentGroups',
  components: {
    btable: Btable
  },
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        role: { label: 'Role', sortable: true, formatter: (role) => role.name },
        ring_timeout: { label: 'Ring Timeout', sortable: true },
        max_ring_fails: { label: 'Max Ring Fails', sortable: true },
      },
      agent_groups: []
    }
  },
  created () {
    this.query()
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
    },
    acl (id) {
      this.$router.push(`/agent_group/${id}`)
    }
  }
}
</script>
