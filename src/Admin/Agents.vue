<template>
<table class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Login</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Permission</th>
      <th>Profile</th>
      <th>Uri</th>
    </tr>
  </thead>
  <tbody v-for="agent in agents">
    <tr>
      <td>{{ agent.login }}</td>
      <td>{{ agent.firstname }}</td>
      <td>{{ agent.lastname }}</td>
      <td>{{ agent.perm_profile }}</td>
      <td>{{ agent.profile }}</td>
      <td>{{ agent.uri }}</td>
    </tr>
  </tbody>
</table>
</template>

<script>
export default {
  name: 'admin-agents',
  data () {
    return {
      agents: []
    }
  },
  methods: {
    query () {
      this.agent.get_agents(List => this.agents = List)
    },
  },
  created () {
    this.agent = this.$parent.agent
    this.query()
  }
}
</script>