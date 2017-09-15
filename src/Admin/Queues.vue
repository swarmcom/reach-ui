<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <div style="float: right">
      Rows
      <input v-model.number="rowsPerPage" type="number" min="0" style="height:38px">
      Filter
      <input v-model="searchQuery" type="text" style="height:38px">
    </div>
    <custom-table style="margin-top: 20px"
      :data="computedQueues"
      :dataArguments="dataArguments"
      :columns="columns"
      :rowsPerPage="rowsPerPage"
      :filter-key="searchQuery"
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
      rowsPerPage: 0,
      searchQuery: '',
      dataArguments: ['id', 'name', 'group_id', 'hold_music', 'wrapup_enabled', 'aging_factor', 'weight'],
      columns: ['Id', 'Name', 'Group', 'Music', 'Wrap', 'Aging', 'Weight'],
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
    if(localStorage.getItem('adminQueuesRows')) this.rowsPerPage = localStorage.getItem('adminQueuesRows')
  },
  watch: {
    rowsPerPage: {
      handler() {
        localStorage.setItem('adminQueuesRows', this.rowsPerPage);
      },
      deep: true,
    },
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