<template>
  <tags
    v-model="skills"
    placeholder="Add Skills"
    @input="commit()"
  />
</template>

<script>
import Skills from '@/Agent/Widget/Skills'
import Common from '@/Admin/Common'
import Tags from '@/Widget/Tags'
export default {
  name: 'CallSkills',
  components: { 'tags': Tags },
  mixins: [Common],
  props: {
    uuid: {
      type: String,
      default: ''
    }
  },
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
      let skills = await this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid])
      this.skills = this.skills2list(skills)
    },
    commit () {
      this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid, this.list2skills(this.skills)])
    }
  },
}
</script>