<template>
<div>
  <b-form-group label="Agent effective skills:">
    <skills v-model="skills" v-on:input="commit()"></skills>
  </b-form-group>
</div>
</template>

<script>
import Skills from '@/Agent/Widget/Skills'
import Common from '@/Admin/Common'

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
