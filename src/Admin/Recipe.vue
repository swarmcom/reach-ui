<template>
<div class="form">
  <form-text label="Name" v-model="rec.name"></form-text>
  <form-text label="Description" v-model="rec.description"></form-text>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Obj from './Object'
import Common from './Common'

export default {
  name: 'admin-recipe',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_recipe',
      redirect: '/admin/recipes'
    }
  },
}
</script>
