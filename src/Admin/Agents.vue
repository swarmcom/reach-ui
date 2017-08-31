<template>
<div>
<button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
<table style="margin-top: 20px" class="table table-hover table-sm">
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
    <tr @click="onClick(agent.agent_id)">
      <td>{{ agent.login }}</td>
      <td>{{ agent.firstname }}</td>
      <td>{{ agent.lastname }}</td>
      <td>{{ agent.permissions }}</td>
      <td>{{ agent.profile }}</td>
      <td>{{ agent.uri }}</td>
    </tr>
  </tbody>
</table>
</div>
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
      this.$agent.get_agents(List => this.agents = List.reply)
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    onClick(id) {
      this.$router.push(`/admin/agent/${id}`)
    }
  },
  created () {
    this.query()
  }
}
</script>