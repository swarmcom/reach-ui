<template>
<btable :fields="fields" :data="queue_groups" :add_button=true tooltip="Add Queue Group" :filter_button=true :paginate=true></btable>
</template>

<script>
import Common from '@/Admin/Common'
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-queue-groups',
  mixins: [Common],
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        weight: { label: 'Weight', sortable: true },
        aging_factor: { label: 'Aging', sortable: true },
        moh: { label: 'Music', sortable: true, formatter: (moh) => moh.name },
        wrapup_enabled: { label: 'Wrap', sortable: true }
      },
      queue_groups: []
    }
  },
  methods: {
    query: async function () {
      this.queue_groups = await this.$agent.p_mfa('ws_db_queue_group', 'get')
    },
    add () {
      this.$router.push(`/queue_group/`)
    },
    onClick(data) {
      this.$router.push(`/queue_group/${data.id}`)
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
