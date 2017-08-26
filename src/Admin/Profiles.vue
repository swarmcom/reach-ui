<template>
<table class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Name</th>
      <th>Permissions</th>
      <th>Ring Timeout</th>
      <th>Ring Fails</th>
    </tr>
  </thead>
  <tbody v-for="profile in profiles">
    <tr>
      <td>{{ profile.name }}</td>
      <td>{{ profile.perm_profile }}</td>
      <td>{{ profile.ring_timeout }}</td>
      <td>{{ profile.max_ring_fails }}</td>
    </tr>
  </tbody>
</table>
</template>


<script>
export default {
  name: 'admin-profiles',
  data () {
    return {
      profiles: []
    }
  },
  methods: {
    query () {
      this.agent.get_profiles(List => this.profiles = List)
    },
  },
  created () {
   this.agent = this.$parent.agent
   this.query()
  }
}
</script>