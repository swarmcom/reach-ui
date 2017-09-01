<template>
<div>
<button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
<table style="margin-top: 20px" class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Id</th>
      <th>Login</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Permissions</th>
      <th>Profile</th>
      <th>Uri</th>
    </tr>
  </thead>
  <tbody v-for="agent in agents">
    <tr @click="onClick(agent.agent_id)">
      <td>{{ agent.agent_id }}</td>
      <td>{{ agent.login }}</td>
      <td>{{ defined(agent.firstname) }}</td>
      <td>{{ defined(agent.lastname) }}</td>
      <td>{{ defined(agent.permissions) }}</td>
      <td>{{ profile_name(agent.profile_id) }}</td>
      <td>{{ defined(agent.uri) }}</td>
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
      agents: [],
      profiles: []
    }
  },
  methods: {
    query () {
      this.$agent.get_profiles(Obj => this.profiles = Obj.reply)
      this.$agent.get_agents(List => this.agents = List.reply)
    },
    add () {
      this.$router.push(`/admin/agent/`)
    },
    onClick(id) {
      this.$router.push(`/admin/agent/${id}`)
    },
    profile_name (Id) {
      let Profile = this.profiles.find(I =>  I.id == Id)
      if (Profile) {
        return Profile.name
      } else {
        return ''
      }
    },
    defined (V) {
      console.log("v:", V)
      if (V == "undefined") {
        return ''
      } else {
        return V
      }
    },
  },
  created () {
    this.query()
  }
}
</script>