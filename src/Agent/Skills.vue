<template>
  <tags
    v-model="skills"
    placeholder="Agent effective tags..."
    @input="commit()"
  />
</template>

<script>
import Skills from '@/Agent/Widget/Skills'
import Common from '@/Admin/Common'
import Tags from '@/Widget/Tags'
export default {
  name: 'AgentSkills',
  components: { 'tags': Tags },
  mixins: [Common],
  data () {
    return {
      skills: []
    }
  },
  created () {
    this.query()
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
}
</script>

