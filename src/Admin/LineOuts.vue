<template>
<btable :fields="fields" :data="line_outs" :add_button=true :filter_button=true :paginate=true></btable>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-line-outs',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        number: { label: 'Number', sortable: true },
        client: { label: 'Client', sortable: true, formatter: (client) => client.name }
      },
      line_outs: []
    }
  },
  methods: {
    query: async function () {
      this.line_outs = await this.$agent.p_mfa('ws_db_line_out', 'get')
    },
    add () {
      this.$router.push(`/admin/line_out/`)
    },
    onClick (data) {
      this.$router.push(`/admin/line_out/${data.id}`)
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
