<template>
<btable :fields="fields" :data="prompts" :add_button=true></btable>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-prompts',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        file: { label: 'File', sortable: true },
        description: { label: 'Description' }
      },
      prompts: []
    }
  },
  methods: {
    query: async function () {
      this.prompts = await this.$agent.p_mfa('ws_db_prompt', 'get')
    },
    add () {
      this.$router.push(`/prompt/`)
    },
    onClick (data) {
      this.$router.push(`/prompt/${data.id}`)
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
