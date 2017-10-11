<template>
<btable :fields="fields" :data="dispositions" :add_button=true></btable>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-dispositions',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        description: { label: 'Description' }
      },
      dispositions: []
    }
  },
  methods: {
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_admin', 'get_dispositions')
    },
    add () {
      this.$router.push(`/admin/disposition/`)
    },
    onClick (data) {
      this.$router.push(`/admin/disposition/${data.id}`)
    },
  },
  created () {
    this.query()
  },
  components: {
    btable: Btable
  }
}
</script>
