<template>
<div class="form-inline">
  <autocomplete v-model="obj" :query="query" placeholder="Line Out..."></autocomplete>
  <button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="obj in selected" :key="obj.id" @click="remove(obj)">{{obj.name}}</button>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
import API from '@/Admin/ACL/API'

export default {
  name: 'acl-widget-line-outs',
  components: {Autocomplete},
  props: ['value'],
  mixins: [API],
  data () {
    return {
      module: 'ws_db_line_out',
      obj: undefined,
      selected: []
    }
  }
}
</script>
