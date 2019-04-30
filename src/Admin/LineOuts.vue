<template>
  <btable
    :fields="fields"
    :data="line_outs"
    tooltip="Add Line Out"
    :add-button="true"
    :filter-button="true"
    :paginate="true"
  />
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'AdminLineOuts',
  components: {
    btable: Btable
  },
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
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.line_outs = await this.$agent.p_mfa('ws_db_line_out', 'get')
    },
    add () {
      this.$router.push(`/line_out/`)
    },
    onClick (data) {
      this.$router.push(`/line_out/${data.id}`)
    }
  }
}
</script>
