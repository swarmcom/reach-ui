<template>
<div>
  <btable
    :fields="fields"
    :data="line_ins"
    :storageName="name"
    :add_button=true>
  </btable>
</div>
</template>

<script>
import Btable from '../Widget/Btable'

export default {
  name: 'admin-line-ins',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        number: { label: 'Number', sortable: true },
        queue: { label: 'Queue', sortable: true, formatter: (queue) => queue.name },
        client: { label: 'Client', sortable: true, formatter: (client) => client.name }
      },
      line_ins: [],
      name: "adminLineIns"
    }
  },
  methods: {
    query: async function () {
      this.line_ins = await this.$agent.p_mfa('ws_admin', 'get_line_ins')
    },
    add () {
      this.$router.push(`/admin/line_in/`)
    },
    onClick (data) {
      console.log(data)
      this.$router.push(`/admin/line_in/${data.id}`)
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