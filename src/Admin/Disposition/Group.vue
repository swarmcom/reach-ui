<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Disposition group:</h3>
    </div>
  </div>

  <div class="form">
    <form-text label="Disposition Group Name" v-model="rec.name"></form-text>
    <form-text label="Disposition Group Description" v-model="rec.description"></form-text>
    <div style="margin-top: 20px">
      <button @click="onCommit" class="btn btn-primary">Commit</button>
      <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
      <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
    </div>
  </div>
</div>
</template>

<script>
import Obj from '@/Admin/Object'
import Common from '@/Admin/Common'

export default {
  name: 'admin-disposition-group',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_disposition_group',
      redirect: '/admin/dispositions'
    }
  },
}
</script>
