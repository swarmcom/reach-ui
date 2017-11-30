<template>
<div class="form-inline">
  <autocomplete v-model="tag" :query="query" :to_name="to_name" :new="true" :placeholder="placeholder"></autocomplete>
  <button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="tag in selected" @click="remove(tag)">{{tag}}</button>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  components: { Autocomplete },
  props: ["value", "placeholder"],
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
