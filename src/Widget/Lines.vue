<template>
<b-row style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <b-col cols="2">
    <select class="custom-select pointer" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="line in lines" :value="line.id">{{ line.name }}</option>
    </select>
  </b-col>
  <b-col cols="3" style="margin-top: 5px">
    <button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="line in value" @click="remove(line.id)">{{line.name}}</button>
  </b-col>
  <b-col v-if="effective" cols="4">
    <button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="line in effective" disabled>{{line.name}}</button>
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
    remove (value) {
      let index = this.value.findIndex(el => el.id == value)
      if (index >= 0) {
        this.value.splice(index, 1)
      }
    },
    onUpdate (value) {
      if (value == undefined || value == "" || this.value == undefined) {
        return
      }
      let index = this.value.findIndex(el => el.id == value)
      if (index < 0) {
        let index = this.lines.findIndex(el => el.id == value)
          if(index >= 0)
            this.value.push({id:this.lines[index].id, name:this.lines[index].name})
      }
      else {
          this.value.splice(index, 1)
      }

      this.$emit('input', this.value)
    }
  },
  created () {
    this.query()
  }
}
</script>
