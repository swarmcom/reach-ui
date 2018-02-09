<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <div class="form-inline">
      <autocomplete v-model="acl" :query="query" :to_name="to_name" :new="true"></autocomplete>
      <button class="btn btn-sm btn-outacl-primary" style="margin-left: 10px" v-for="acl in selected" @click="remove(acl)">{{acl.name}}</button>
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
      acl: null,
      selected: []
    }
  },
  methods: {
    to_name (acl) {
      return acl.name
    },
    query (text) {
      return this.$agent.p_mfa("ws_db_acl_group", "suggest", [text])
    },
    remove (value) {
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    acl (value) {
      if (! value || ! value.id) {
        return
      }
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index < 0) {
        this.selected.push(value)
      }
      this.acl = null
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
