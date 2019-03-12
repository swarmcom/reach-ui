<template>
<div class="form-inline">
  <autocomplete v-if="! disabled" v-model="tag" :query="query" :to_name="to_name" :new="true" :placeholder="placeholder"></autocomplete>
  <div v-if="disabled">
    <b-btn size="sm" variant="outline-success" disabled style="margin-left: 5px" v-for="(tag, index) in selected" :key=index>{{tag}}</b-btn>
  </div>
  <div v-else>
    <b-btn size="sm" variant="outline-primary" title="Click to Remove" style="margin-left: 5px" v-for="(tag, index) in selected" :key=index @click="remove(tag)">{{tag}}</b-btn>
  </div>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  components: { Autocomplete },
  props: ["value", "placeholder", "disabled"],
  data () {
    return {
      tag: undefined,
      selected: []
    }
  },
  methods: {
    to_name (name) {
      return name
    },
    query (text) {
      return this.$agent.p_mfa("ws_db_tag", "suggest", [text])
    },
    remove (value) {
      let index = this.selected.findIndex(el => el === value)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    tag (value) {
      if (value == undefined || value == "" || value.match(/^\s*$/)) {
        return
      }
      let index = this.selected.findIndex(el => el === value)
      if (index < 0) {
        this.selected.push(value)
      }
      this.tag = undefined
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
    this.selected = this.value
  }
}
</script>
