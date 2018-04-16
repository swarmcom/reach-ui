<template>
  <div style="width: 100%">
    <b-col>{{entity}}:</b-col>
    <div style="padding-bottom: 30px;" class="form-inline">
      <b-col cols="10" md="6" lg="4">
      <autocomplete v-model="obj" :query="query" :placeholder="entity" :to_name="skillsOptionName"></autocomplete>
      </b-col>
      <button class="btn btn-sm btn-outline-primary" style="margin: 3px" v-for="obj in selected" :key="obj.id" @click="remove($event, obj)">{{obj.name}}</button>
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
    remove (event, obj) {
      event.preventDefault()
      let index = this.selected.findIndex(el => el.id === obj.id)
      if (index >= 0) {
        this.$emit('remove', obj)
        this.selected.splice(index, 1)
      }
    },
    skillsOptionName: function (obj) {
      if (obj instanceof Object) 
        return obj.name
      else
        return obj
    }
  },
  watch: {
    value (v) {
      this.selected = v
      return v
    },
    obj (value) {
      let item = {}
      if ( !(value instanceof Object)) {
        if (value == undefined || value == "" || value.match(/^\s*$/)) {
          return
        }
        item = { name: value, id: value }
      }
      else item = value
      let index = this.selected.findIndex(el => el.id === item.id)
      if (index < 0) {
        this.$emit('add', item)
        this.selected.push(item)
      }
      this.obj = undefined
      return value
    },
    selected (value) {
      this.$emit('input', value)
      return value
    }
  }
}
</script>
