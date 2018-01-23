<template>
  <tags v-model="skills" placeholder="Add Skills"></tags>
</template>

<script>
  export default {
    name: 'add-skills',
    props: ['args'],
    data () {
      return {
        skills: [],
      }
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
    },
    watch: {
      skills () {
        this.commit()
      }
    },
    created () {
      this.query()
    }
  }
</script>