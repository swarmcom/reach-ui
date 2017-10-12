<template>
<btable :fields="fields" :data="mohs" :add_button=true></btable>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-mohs',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        description: { label: 'Description' }
      },
      mohs: []
    }
  },
  methods: {
    query: async function () {
      this.mohs = await this.$agent.p_mfa('ws_admin', 'get_mohs')
    },
    add () {
      this.$router.push(`/admin/moh/`)
    },
    onClick (data) {
      this.$router.push(`/admin/moh/${data.id}`)
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
