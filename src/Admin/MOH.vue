<template>
<div class="form">
  <form-text label="Name" v-model="rec.name"></form-text>
  <form-text label="Description" v-model="rec.description"></form-text>
  <div class="form-group row">
    <label class="col-3 col-form-label">File</label>
    <div class="col-9">
      <b-form-file v-model="file" v-on:input="onFile" :placeholder="rec.file"></b-form-file>
    </div>
  </div>
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
      redirect: '/admin/mohs',
      visible: false,
      file: null
    }
  },
  methods: {
    onFile (file) {
      console.log(file)
      let xhr = new XMLHttpRequest()
      let fd = new FormData()

      this.file = file
      this.rec.file = file.name
      this.visible = false

      xhr.open("POST", `${this.$agent.get_api()}/upload/moh`, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.rec.uuid = xhr.responseText
          this.visible = true
        }
      }
      fd.append('moh', file)
      xhr.send(fd)
    }
  }
}
</script>
