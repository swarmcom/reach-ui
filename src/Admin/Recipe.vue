<template>
<div class="form">
  <form-text label="Recipe Name" v-model="rec.name"></form-text>
  <form-text label="Recipe Description" v-model="rec.description"></form-text>
  <div style="margin-top:20px">
    <button @click="onCommit" class="btn btn-primary">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
    <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'

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
