<template>
  <btable
    :fields="fields"
    :data="mohs"
    tooltip="Add MOH"
    :add-button="true"
  />
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'AdminMohs',
  components: {
    btable: Btable
  },
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
  created () {
    this.query()
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
  }
}
</script>
