<template>
  <b-form-row>
    <b-col cols="4">
      <b-form-select
        v-model="comparision"
        :options="comparasions"
        @change="commit"
      />
    </b-col>
    <b-col cols="8">
      <tags
        v-model="skills"
        placeholder="Add Call Skills"
      />
    </b-col>
  </b-form-row>
</template>

<script>
  export default {
    name: 'AdminRecipeConditionCallSkills',
    props: {
      args: {
        type: Array,
        default: () => ([])
      }
    },
    data () {
      return {
        comparasions: [ 'is', 'has_one', 'has_all' ],
        comparision: this.args[0],
        skills: [],
      }
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
    }
  }
</script>
