<template>
  <tags v-model="skills" v-on:input="commit()" placeholder="Add Skills"></tags>
</template>

<script>
import Skills from '@/Agent/Widget/Skills'
import Common from '@/Admin/Common'
import Tags from '@/Widget/Tags'
export default {
  name: 'call-skills',
  components: { 'tags': Tags },
  mixins: [Common],
  props: {
    uuid: String,
  },
  data () {
    return {
      skills: []
    }
  },
  methods: {
    query: async function () {
      let skills = await this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid])
      this.skills = this.skills2list(skills)
    },
    commit () {
      this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid, this.list2skills(this.skills)])
    }
  },
  created () {
    this.query()
  },
}
</script>