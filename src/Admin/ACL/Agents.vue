<template>
  <div class="form-inline">
    <autocomplete
      v-model="obj"
      :query="query"
      placeholder="Agent..."
    />
    <b-btn
      v-for="itemObj in selected"
      :key="itemObj.id"
      variant="outline-primary"
      size="sm"
      style="margin-left: 10px"
      @click="remove(itemObj)"
    >
      {{ itemObj.name }}
    </b-btn>
  </div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
import API from '@/Admin/ACL/API'

export default {
  name: 'AclWidgetAgents',
  components: {Autocomplete},
  mixins: [API],
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      module: 'ws_db_agent',
      obj: undefined,
      selected: []
    }
  }
}
</script>
