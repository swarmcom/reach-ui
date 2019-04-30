<template>
  <tags
    v-model="skills"
    placeholder="Add Skills"
  />
</template>

<script>
  export default {
    name: 'AddSkills',
    props: {
      args: {
        type: Array,
        default: () => ([])
      }
    },
    data () {
      return {
        skills: [],
      }
    },
    watch: {
      skills () {
        this.commit()
      }
    },
    created () {
      this.query()
    },
    methods: {
      commit () {
        this.$emit('input', [this.skills])
      },
      query: async function () {
        this.tags = await this.$agent.p_mfa('ws_db_tag', 'get')
        if (this.args[0] !== undefined)
          this.skills = this.args[0]
      },
    }
  }
</script>