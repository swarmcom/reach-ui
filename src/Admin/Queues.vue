<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <custom-table
      :data="computedQueues"
      :dataArguments="dataArguments"
      :columns="columns"
      :name="name"
      :sortKey="sortKey"
      :clickable="1">
    </custom-table>
  </div>
</template>

<script>
import CustomTable from '../Widget/CustomTable'

export default {
  name: 'admin-queues',
  data () {
    return {
      dataArguments: ['id', 'name', 'group_id', 'hold_music', 'wrapup_enabled', 'aging_factor', 'weight'],
      columns: ['Id', 'Name', 'Group', 'Music', 'Wrap', 'Aging', 'Weight'],
      name: "adminQueuesRows",
      sortKey: "Id",
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
    onClicked(data) {
      this.$router.push(`/admin/queue/${data.id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    'custom-table': CustomTable
  },
  computed: {
    computedQueues () {
      let queues = this.queues;
      let groups = this.groups;
      queues.forEach(function (key) {
        let Group = groups.find(I => I.id == key.group_id)
        Group ? key.group_id = Group.name : key.group_id = ''
      })
      return queues;
    }
  }
}
</script>