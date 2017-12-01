<template>
  <tags v-model="skills" v-on:input="commit()" placeholder="Agent effective tags..."></tags>
</template>

<script>
import Skills from '@/Agent/Widget/Skills'
import Common from '@/Admin/Common'
import Tags from '@/Widget/Tags'
export default {
  name: 'agent-skills',
  components: { 'tags': Tags },
  mixins: [Common],
  data () {
    return {
      skills: []
    }
  },
  methods: {
    query: async function () {
      let skills = await this.$agent.p_mfa('ws_agent', 'skills', [])
      this.skills = this.skills2list(skills)
    },
    commit () {
      this.$agent.p_mfa('ws_agent', 'skills', [this.list2skills(this.skills)])
    }
  },
  created () {
    this.query()
  },
}
</script>

