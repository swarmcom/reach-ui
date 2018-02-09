<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Access list:</h3>
    </div>
  </div>

  <div class="form">
    <form-text id="name" label="Access List Name" v-model="rec.name"></form-text>
    <form-text id="description" label="Access List Description" v-model="rec.description"></form-text>
    <div style="margin-top:20px">
      <button @click="onCommit" class="btn btn-primary">Commit</button>
      <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
      <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
    </div>
  </div>

  <help></help>
</div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'

export default {
  name: 'admin-acl-group',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_acl_group'
    }
  },
}
</script>
