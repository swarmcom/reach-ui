<template>
<div>
<button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
<table style="margin-top: 20px" class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Permissions</th>
      <th>Ring Timeout</th>
      <th>Ring Fails</th>
    </tr>
  </thead>
  <tbody v-for="profile in profiles">
    <tr @click="onClick(profile.id)">
      <td>{{ profile.id }}</td>
      <td>{{ profile.name }}</td>
      <td>{{ profile.permissions }}</td>
      <td>{{ profile.ring_timeout }}</td>
      <td>{{ profile.max_ring_fails }}</td>
    </tr>
  </tbody>
</table>
</div>
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
      this.$agent.get_profiles(Obj => this.profiles = Obj.reply)
    },
    add () {
      this.$router.push(`/admin/profile/`)
    },
    onClick(id) {
      this.$router.push(`/admin/profile/${id}`)
    }
  },
  created () {
   this.query()
  }
}
</script>