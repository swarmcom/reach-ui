<template>
<b-form-row>
  <b-col>
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="lua in luas" :value="lua.id" :selected="isActive(lua.id)">{{ lua.name }}</option>
    </select>
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'admin-recipe-action-lua',
  props: ['args'],
  data () {
    return {
      value: this.args[0],
      luas: []
    }
  },
  methods: {
    commit () {
      this.$emit('input', [this.value])
    },
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.luas = await this.$agent.p_mfa('ws_db_lua', 'get')
    },
    onUpdate (value) {
      this.value = value
      this.commit()
    }
  },
  watch: {
    value () {
      this.commit()
    }
  },
  created () {
    this.query()
  }
}
</script>
