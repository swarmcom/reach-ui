<template>
<div class="form">
  <form-text label="Name" v-model="rec.name"></form-text>
  <form-text label="Number" v-model="rec.number"></form-text>
  <form-text label="Description" v-model="rec.description"></form-text>
  <clients label="Client" v-model="rec.client_id"></clients>
  <form-select-bool label="Override Caller ID" v-model="rec.override_clid"></form-select-bool>
  <form-text label="Caller ID name" v-model="rec.caller_id_name"></form-text>
  <form-text label="Caller ID number" v-model="rec.caller_id_number"></form-text> 
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Common from './Common'
import Obj from './Object'

export default {
  name: 'admin-line-out',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_line_out',
      redirect: '/admin/line_outs'
    }
  }
}
</script>
