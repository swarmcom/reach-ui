<template>
<div>
<button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
<table style="margin-top: 20px" class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Weight</th>
      <th>Aging</th>
      <th>Music</th>
      <th>Wrap</th>
    </tr>
  </thead>
  <tbody v-for="group in groups">
    <tr @click="onClick(group.id)">
      <td>{{ group.id }}</td>
      <td>{{ group.name }}</td>
      <td>{{ group.weight }}</td>
      <td>{{ group.aging_factor }}</td>
      <td>{{ group.hold_music }}</td>
      <td>{{ group.wrapup_enabled }}</td>
    </tr>
  </tbody>
</table>
</div>
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
      this.$agent.get_groups(Obj => this.groups = Obj.reply)
    },
    add () {
      this.$router.push(`/admin/group/`)
    },
    onClick(id) {
      this.$router.push(`/admin/group/${id}`)
    }
  },
  created () {
   this.query()
  }
}
</script>