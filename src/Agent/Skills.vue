<template>
<div>
  <h3>Skills:</h3>
  <skills v-model="skills" v-on:input="commit()"></skills>
</div>
</template>

<script>
import Skills from './Widget/Skills'
import Common from '../Admin/Common'
export default {
  name: 'agent-skills',
  components: { 'skills': Skills },
  mixins: [Common],
  data () {
    return {
      skills: []
    }
  },
  methods: {
    query: async function () {
      let skills = await this.$agent.p_mfa('ws_agent', 'skills', [])
      this.skills = this.object2list(skills)
    },
    commit () {
      this.$agent.p_mfa('ws_agent', 'skills', [this.list2object(this.skills)])
    }
  },
  created () {
    this.query()
  },
}
</script>

