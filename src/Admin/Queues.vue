<template>
<btable :fields="fields" :data="queues" :add_button=true :filter_button=true :paginate=true></btable>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-queues',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        group: { label: 'Group', sortable:true, formatter: (group) => group.name },
        moh: { label: 'Music', sortable: true, formatter: (moh) => moh.name },
        wrapup_enabled: { label: 'Wrap', sortable: true },
        aging_factor: { label: 'Aging', sortable: true },
        weight: { label: 'Weight', sortable: true }
      },
      queues: []
    }
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get')
    },
    add () {
      this.$router.push(`/queue/`)
    },
    group_name (Id) {
      let Group = this.groups.find(I => I.id == Id)
      return Group? Group.name : ''
    },
    onClick(data) {
      this.$router.push(`/queue/${data.id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    btable: Btable
  }
}
</script>
