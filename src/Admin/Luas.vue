<template>
  <btable
    :fields="fields"
    :data="luas"
    :add-button="true"
    tooltip="Add Lua"
  />
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'AdminLuas',
  components: {
    btable: Btable
  },
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
  created () {
    this.query()
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
  }
}
</script>
