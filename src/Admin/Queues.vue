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
      <td>{{ defined(queue.aging_factor) }}</td>
      <td>{{ defined(queue.weight) }}</td>
    </tr>
  </tbody>
</table>
</div>
</template>

<script>
import Common from './Common'

export default {
  name: 'admin-queues',
  mixins: [Common],
  data () {
    return {
      queues: [],
      groups: []
    }
  },
  methods: {
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_admin', 'get_groups')
      this.queues = await this.$agent.p_mfa('ws_admin', 'get_queues')
    },
    add () {
      this.$router.push(`/admin/queue/`)
    },
    group_name (Id) {
      let Group = this.groups.find(I => I.id == Id)
      return Group? Group.name : ''
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