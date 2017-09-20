<template>
  <div>
    <button @click="add" class="btn btn-outline-success"><icon name="plus" scale="1"></icon></button>
    <custom-table
      :data="groups"
      :dataArguments="dataArguments"
      :columns="columns"
      :name="name"
      :sortKey="sortKey"
      :clickable="1">
    </custom-table>
  </div>
</template>

<script>
import Common from './Common'
import CustomTable from '../Widget/CustomTable'

export default {
  name: 'admin-groups',
  mixins: [Common],
  data () {
    return {
      name: "adminGroupsRows",
      dataArguments: ['id', 'name', 'weight', 'aging_factor', 'hold_music', 'wrapup_enabled'],
      columns: ['Id', 'Name', 'Weight', 'Aging', 'Music', 'Wrap' ],
      sortKey: "Id",
      groups: []
    }
  },
  methods: {
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_admin', 'get_groups')
    },
    add () {
      this.$router.push(`/admin/group/`)
    },
    onClicked(data) {
      this.$router.push(`/admin/group/${data.id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    'custom-table': CustomTable
  }
}
</script>