<template>
<div>
<button @click="add" class="btn btn-outline-secondary"><icon name="plus" scale="1"></icon></button>
<table style="margin-top: 20px" class="table table-hover table-sm">
  <thead class="thead-default">
    <tr>
      <th>Name</th>
      <th>Group</th>
      <th>Music</th>
      <th>Wrp</th>
      <th>Aging</th>
      <th>Weight</th>
    </tr>
  </thead>
  <tbody v-for="queue in queues">
    <tr @click="onClick(queue.name)">
      <td>{{ queue.name }}</td>
      <td>{{ queue.group }}</td>
      <td>{{ queue.hold_music }}</td>
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
      queues: []
    }
  },
  methods: {
    query () {
      this.$agent.get_queues(Obj => this.queues = Obj.reply)
    },
    add () {
      this.$router.push(`/admin/queue/`)
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