<template>
<div>
  <btable :fields="fields" :data="line_ins" :add_button=true>
  </btable>
</div>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-line-ins',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        queue: { label: 'Queue', sortable: true, formatter: (queue) => queue.name },
        client: { label: 'Client', sortable: true, formatter: (client) => client.name }
      },
      line_ins: []
    }
  },
  methods: {
    query: async function () {
      this.line_ins = await this.$agent.p_mfa('ws_db_line_in', 'get')
    },
    add () {
      this.$router.push(`/line_in/`)
    },
    onClick (data) {
      console.log(data)
      this.$router.push(`/line_in/${data.id}`)
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
