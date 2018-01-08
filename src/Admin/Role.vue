<template>
<div class="container" style="margin-top:20px">
  <div class="row">
    <div class="col-4">
      <h3>Role:</h3>
    </div>
  </div>

  <div class="form">
    <form-text id="name" label="Role Name" v-model="rec.name"></form-text>
    <form-text id="description" label="Role Description" v-model="rec.description"></form-text>
    <div class="row" style="margin-top: 5px">
      <label id="UI Variant" class="col-3 col-form-label">UI Variant</label>
      <div class="col-9">
        <select class="custom-select" v-model="rec.ui">
          <option></option>
          <option v-for="ui in uis" :value="ui" :selected="ui == rec.ui">{{ ui }}</option>
        </select>
      </div>
    </div>
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
  name: 'admin-role',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      uis: ['agent', 'supervisor'],
      module: 'ws_db_role',
      redirect: '/roles'
    }
  },
}
</script>
