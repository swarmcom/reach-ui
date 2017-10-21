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
import Common from './Common'
import Obj from './Object'

export default {
  name: 'admin-mohs',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_moh',
      redirect: '/admin/mohs'
    }
  }
}
</script>
