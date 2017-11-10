<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" @change="onUpdate($event.target.value)" :disabled="isDisabled()">
      <option></option>
      <option v-for="recipe in recipes" :value="recipe.id" :selected="isActive(recipe.id)">{{ recipe.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-recipes',
  props: ['label', 'value'],
  data () {
    return {
      recipes: []
    }
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
  },
  created () {
    this.query()
  }
}
</script>
