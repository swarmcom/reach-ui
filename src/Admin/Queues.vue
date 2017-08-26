<template>
<table class="table table-hover table-sm">
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
    <tr>
      <td>{{ queue.name }}</td>
      <td>{{ queue.group }}</td>
      <td>{{ queue.hold_music }}</td>
      <td>{{ queue.wrapup_enabled }}</td>
      <td>{{ queue.aging_factor }}</td>
      <td>{{ queue.weight }}</td>
    </tr>
  </tbody>
</table>
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
      this.agent.get_queues(List => this.queues = List)
    },
  },
  created () {
    this.agent = this.$parent.agent
    this.query()
  }
}
</script>