<template>
<div>
<button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
<table style="margin-top: 20px" class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Group</th>
      <th>Music</th>
      <th>Wrap</th>
      <th>Aging</th>
      <th>Weight</th>
    </tr>
  </thead>
  <tbody v-for="queue in queues">
    <tr @click="onClick(queue.id)">
      <td>{{ queue.id }}</td>
      <td>{{ queue.name }}</td>
      <td>{{ group_name(queue.group_id) }}</td>
      <td>{{ defined(queue.hold_music) }}</td>
      <td>{{ queue.wrapup_enabled }}</td>
      <td>{{ queue.aging_factor }}</td>
      <td>{{ queue.weight }}</td>
    </tr>
  </tbody>
</table>
</div>
</template>

<script>
export default {
  name: 'admin-queues',
  data () {
    return {
      queues: [],
      groups: []
    }
  },
  methods: {
    query () {
      this.$agent.get_groups(Obj => this.groups = Obj.reply)
      this.$agent.get_queues(Obj => this.queues = Obj.reply)
    },
    add () {
      this.$router.push(`/admin/queue/`)
    },
    defined (V) {
      console.log("v:", V)
      if (V == "undefined") {
        return ''
      } else {
        return V
      }
    },
    group_name (Id) {
      let Group = this.groups.find(I =>  I.id == Id)
      if (Group) {
        return Group.name
      } else {
        return ''
      }
    },
    onClick(id) {
      this.$router.push(`/admin/queue/${id}`)
    }
  },
  created () {
    this.query()
  }
}
</script>