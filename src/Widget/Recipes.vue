<template>
  <b-row
    style="margin-top: 5px"
  >
    <b-col cols="3">
      <label
        :id="label"
      >
        {{ label }}
      </label>
    </b-col>
    <b-col cols="9">
      <select
        class="custom-select pointer"
        style="width: 100%"
        :value="value"
        :disabled="isDisabled()"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="recipe in recipes"
          :key="recipe.id"
          :value="recipe.id"
          :selected="isActive(recipe.id)"
        >
          {{ recipe.name }}
        </option>
      </select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'WidgetRecipes',
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      recipes: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    isDisabled() {
      return this.recipes.length == 0
    },
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.recipes = await this.$agent.p_mfa('ws_db_recipe', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
