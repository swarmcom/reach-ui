<template>
  <div>
    <btable
      :fields="fields"
      :data="line_ins"
      tooltip="Add Line In"
      :add-button="true"
      :filter-button="true"
      :paginate="true"
    />
  </div>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'AdminLineIns',
  components: {
    btable: Btable
  },
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
  created () {
    this.query()
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
  }
}
</script>
