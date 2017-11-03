<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="lua in luas" :value="lua.id" :selected="isActive(lua.id)">{{ lua.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <select class="custom-select" style="width: 100%" :value="effective" disabled>
      <option></option>
      <option v-for="lua in luas" :value="lua.id" :selected="isEffective(lua.id)">{{ lua.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="lua in luas" :value="lua.id" :selected="isActive(lua.id)">{{ lua.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text',
  props: ['label', 'value', 'effective'],
  data () {
    return {
      luas: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.luas = await this.$agent.p_mfa('ws_db_lua', 'get')
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
