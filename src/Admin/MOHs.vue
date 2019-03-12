<template>
<btable :fields="fields" :data="mohs" tooltip="Add MOH"  :add_button=true></btable>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-mohs',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        file: { label: 'File' }
      },
      mohs: []
    }
  },
  methods: {
    query: async function () {
      this.mohs = await this.$agent.p_mfa('ws_db_moh', 'get')
    },
    add () {
      this.$router.push(`/moh/`)
    },
    onClick (data) {
      this.$router.push(`/moh/${data.id}`)
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
