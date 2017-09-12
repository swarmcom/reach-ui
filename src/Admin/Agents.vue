<template>
<div>
<button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
<form id="search" style="float: right;">
  Search <input name="query" v-model="searchQuery">
</form>
<custom-table style="margin-top: 20px"
  :data="computedAgents"
  :dataArguments="dataArguments"
  :columns="columns"
  :filter-key="searchQuery"
  :clickable="1">
</custom-table>
</div>
</template>

<script>
import CustomTable from '../Widget/CustomTable'

export default {
  name: 'admin-agents',
  data () {
    return {
      searchQuery: '',
      dataArguments: ['agent_id', 'login', 'firstname', 'lastname', 'permissions', 'group_id', 'uri'],
      columns: ['Id', 'Login', 'First Name', 'Last Name', 'Permissions', 'Profile', 'Uri'],
      agents: [],
      profiles: []
    }
  },
  methods: {
    query: async function () {
      this.profiles = await this.$agent.p_mfa('ws_admin', 'get_profiles')
      this.agents = await this.$agent.p_mfa('ws_admin', 'get_agents')
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    profile_name (Id) {
      let Profile = this.profiles.find(I => I.id == Id)
      return Profile ? Profile.name : ''
    },
    onClicked(data) {
      this.$router.push(`/admin/agent/${data.agent_id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    'custom-table': CustomTable
  },
  computed: {
    computedAgents: function() {
      let agents = this.agents;
      let profiles = this.profiles;
      agents.forEach(function (key) {
        let Profile = profiles.find(I => I.id == key.group_id)
        Profile ? key.group_id = Profile.name : key.group_id = ''
      })
      return agents;
    }
  }
}
</script>