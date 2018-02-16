<template>
  <div>
    <div>{{entity}}:</div>
    <div style="padding-bottom: 30px">
      <autocomplete v-model="obj" :query="query" :placeholder="entity"></autocomplete>
      <button class="btn btn-sm btn-outline-primary" style="margin: 3px" v-for="obj in selected" :key="obj.id" @click="remove(obj)">{{obj.name}}</button>
    </div>
  </div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'entity-selector-input',
  components: {
    'autocomplete': Autocomplete
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    query: {
      type: Function,
      required: true
    },
    entity: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      selected: this.value,
      obj: undefined
    }
  },
  methods: {
    remove (obj) {
      let index = this.selected.findIndex(el => el.id === obj.id)
      if (index >= 0) {
        this.$emit('remove', obj)
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    value (v) {
      this.selected = v
      return v
    },
    obj (value) {
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index < 0) {
        this.$emit('add', value)
        this.selected.push(value)
      }
      return value
    },
    selected (value) {
      this.$emit('input', value)
      return value
    }
  }
}
</script>
