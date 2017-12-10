<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Node:</h3>
    </div>
  </div>

  <div class="form">
    <form-text label="Name" v-model="rec.name"></form-text>
    <form-text label="Description" v-model="rec.description"></form-text>
    <form-text label="IP Address" v-model="rec.ip"></form-text>
  </div>

  <div class="row" style="margin-top: 20px">
    <div class="col">
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
  name: 'admin-kam-node',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_kam_node',
      redirect: '/kam/nodes'
    }
  },
}
</script>
