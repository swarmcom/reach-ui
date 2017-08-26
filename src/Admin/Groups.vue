<template>
<table class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Name</th>
      <th>Aging</th>
      <th>Sort</th>
      <th>Music</th>
      <th>Wrp</th>
    </tr>
  </thead>
  <tbody v-for="group in groups">
    <tr>
      <td>{{ group.name }}</td>
      <td>{{ group.aging_factor }}</td>
      <td>{{ group.sort }}</td>
      <td>{{ group.hold_music }}</td>
      <td>{{ group.wrapup_enabled }}</td>
    </tr>
  </tbody>
</table>
</template>


<script>
export default {
  name: 'admin-groups',
  data () {
    return {
      groups: []
    }
  },
  methods: {
    query () {
      this.agent.get_groups(List => this.groups = List)
    },
  },
  created () {
   this.agent = this.$parent.agent
   this.query()
  }
}
</script>