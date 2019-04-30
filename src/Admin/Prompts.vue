<template>
  <btable
    :fields="fields"
    :data="prompts"
    tooltip="Add Prompt"
    :add-button="true"
  />
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'AdminPrompts',
  components: {
    btable: Btable
  },
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
  created () {
    this.query()
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
  }
}
</script>
