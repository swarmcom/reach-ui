<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <div class="form-inline">
      <autocomplete v-model="line" :query="query" :to_name="to_name" :new="true"></autocomplete>
      <button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="line in selected" @click="remove(line)">{{line.name}}</button>
    </div>
  </div>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  components: { Autocomplete },
  props: ["label", "value"],
  data () {
    return {
      line: null,
      selected: []
    }
  },
  methods: {
    to_name (line) {
      return line.name
    },
    query (text) {
      return this.$agent.p_mfa("ws_db_line_out", "suggest", [text])
    },
    remove (value) {
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    line (value) {
      if (! value || ! value.id) {
        return
      }
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index < 0) {
        this.selected.push(value)
      }
      this.line = null
      return value
    },
    selected (value) {
      this.$emit('input', value)
      return value
    },
    value (value) {
      this.selected = value
    }
  },
  created () {
    if (this.value != undefined)
      this.selected = this.value
  }
}
</script>
