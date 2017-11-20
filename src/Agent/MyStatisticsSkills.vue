<template>
<div>
  <multiselect
    v-model="value"
    placeholder="Select skill"
    label="key"
    track-by="key"
    :options="skills"
    :multiple="true"
    :close-on-select="true"
    :clear-on-select="false"
    :hide-selected="true"
    @remove="removeSkill"
    @input="addSkill">
  </multiselect>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import Common from '../Admin/Common'
export default {
  name: 'my-statistics-skills',
  components: {
     Multiselect
  },
  mixins: [Common],
  data () {
    return {
      skills: [],
      value: []
    }
  },
  methods: {
    query: async function () {
      let selectedSkills = await this.$agent.p_mfa('ws_agent', 'skills', [])
      this.value = this.object2list(selectedSkills)
      this.skills = this.object2list(this.$agent.vm.agent.skills)
    },
    addSkill(value) {
      this.$agent.p_mfa('ws_agent', 'skills', [this.list2object(this.value)])
    },
    removeSkill (value) {
      this.$agent.p_mfa('ws_agent', 'skills', [this.list2object(this.value)])
    }
  },
  created () {
    this.query()
  },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
