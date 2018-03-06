<template>
<b-row style="margin-top: 5px">
  <b-col cols="3">
    <label :id="label" class="col-form-label">{{ label }}</label>
  </b-col>
  <b-col v-if="effective" cols="5">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="line in lines" :value="line.id" :selected="isActive(line.id)" :key="line.id">{{ line.name }}</option>
    </select>
  </b-col>
  <b-col v-if="effective" cols="4">
    <input class="form-control" type="number" :value="safe_effective" disabled>
  </b-col>
  <b-col v-else cols="9">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="line in lines" :value="line.id" :selected="isActive(line.id)" :key="line.id">{{ line.name }}</option>
    </select>
  </b-col>
</b-row>
</template>

<script>
export default {
  name: 'form-text',
  props: ['label', 'value', 'effective'],
  data () {
    return {
      lines: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.lines.length == 0
    },
    query: async function () {
      this.lines = await this.$agent.p_mfa('ws_db_line_out', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  },
  computed: {
    safe_effective () {
      return this.effective === 'undefined' ? '' : this.effective
    }
  },
  created () {
    this.query()
  }
}
</script>
