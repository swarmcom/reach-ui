<template>
  <div class="form-inline">
    <autocomplete
      v-if="! disabled"
      v-model="tag"
      :query="query"
      :to-name="toName"
      :new="true"
      :placeholder="placeholder"
    />
    <div v-if="disabled">
      <b-btn
        v-for="(itemTag, index) in selected"
        :key="index"
        size="sm"
        variant="outline-success"
        disabled
        style="margin-left: 5px"
      >
        {{ itemTag }}
      </b-btn>
    </div>
    <div v-else>
      <b-btn
        v-for="(itemTag, index) in selected"
        :key="index"
        size="sm"
        variant="outline-primary"
        title="Click to Remove"
        style="margin-left: 5px"
        @click="remove(itemTag)"
      >
        {{ itemTag }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  components: { Autocomplete },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      tag: undefined,
      selected: []
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
  },
  methods: {
    toName (name) {
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
  }
}
</script>
