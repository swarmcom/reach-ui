<template>
<div>
<button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
<table style="margin-top: 20px" class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody v-for="release in releases">
    <tr @click="onClick(release.id)">
      <td>{{ release.id }}</td>
      <td>{{ defined(release.name) }}</td>
      <td>{{ defined(release.score) }}</td>
    </tr>
  </tbody>
</table>
</div>
</template>

<script>
export default {
  name: 'admin-releases',
  data () {
    return {
      releases: []
    }
  },
  methods: {
    query () {
      this.$agent.get_releases(List => this.releases = List.reply)
    },
    add () {
      this.$router.push(`/admin/release/`)
    },
    onClick(id) {
      this.$router.push(`/admin/release/${id}`)
    },
    defined (V) {
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