<template>
  <div>
    <btable
      :fields="fields"
      :data="computedQueues"
      :storageName="name"
      :add_button=true>
    </btable>
  </div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-queues',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        group_id: { label: 'Group', sortable:true },
        hold_music: { label: 'Music', sortable: true },
        wrapup_enabled: { label: 'Wrap', sortable: true },
        aging_factor: { label: 'Aging', sortable: true },
        weight: { label: 'Weight', sortable: true }
      },
      name: "adminQueues",
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
    onClick(data) {
      this.$router.push(`/admin/queue/${data.id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    'btable': Btable
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