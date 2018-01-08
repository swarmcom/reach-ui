<template>
<btable :fields="fields" :data="luas" :add_button=true></btable>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-luas',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        description: { label: 'Description' }
      },
      luas: []
    }
  },
  methods: {
    query: async function () {
      this.luas = await this.$agent.p_mfa('ws_db_lua', 'get')
    },
    add () {
      this.$router.push(`/lua/`)
    },
    onClick (data) {
      this.$router.push(`/lua/${data.id}`)
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
