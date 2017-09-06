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
      <td>{{ defined(profile.permissions) }}</td>
      <td>{{ defined(profile.ring_timeout) }}</td>
      <td>{{ defined(profile.max_ring_fails) }}</td>
    </tr>
  </tbody>
</table>
</div>
</template>

<script>
import Common from './Common'

export default {
  name: 'admin-profiles',
  mixins: [Common],
  data () {
    return {
      profiles: []
    }
  },
  methods: {
    query: async function () {
      this.profiles = await this.$agent.p_mfa('ws_admin', 'get_profiles')
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