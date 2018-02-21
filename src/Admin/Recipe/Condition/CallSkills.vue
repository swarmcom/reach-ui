<template>
<b-form-row>
  <b-col cols="4">
    <b-form-select v-model="comparision" @change="commit" :options="comparasions"></b-form-select>
  </b-col>
  <b-col cols="8">
  <tags v-model="skills" placeholder="Add Call Skills"></tags>
  </b-col>
</b-form-row>
</template>

<script>
  export default {
    name: 'admin-recipe-condition-call-skills',
    props: ['args'],
    data () {
      return {
        comparasions: [ 'is', 'has_one', 'has_all' ],
        comparision: this.args[0],
        skills: [],
      }
    },
    methods: {
      commit () {
        this.$emit('input', [this.comparision, this.skills])
      },
      query: async function () {
        this.tags = await this.$agent.p_mfa('ws_db_tag', 'get')
        if (this.args[1] !== undefined)
          this.skills = this.args[1]
      },
    },
    watch: {
      comparision () {
        this.commit()
      },
      skills () {
        this.commit()
      }
    },
    created () {
      this.query()
    }
  }
</script>
