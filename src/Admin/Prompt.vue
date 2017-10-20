<template>
<div class="form">
  <form-text id="name" label="Name" v-model="rec.name"></form-text>
  <form-text id="description" label="Description" v-model="rec.description"></form-text>
  <div class="form-group row">
    <label class="col-3 col-form-label">Choose File</label>
    <div class="col-9">
      <b-form-file style="width: 100%" id="prompt-file" v-model="file" choose-label="Select" v-on:input="onFile"></b-form-file>
      <div v-if="visible">Uploaded</div>
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
  name: 'admin-prompt',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_prompt',
      redirect: '/admin/prompts',
      visible: false,
      file: undefined
    }
  },
  methods: {
    onFile (file) {
      let xhr = new XMLHttpRequest()
      let fd = new FormData()

      this.rec.file = file.name

      this.visible = false

      xhr.open("POST", "http://localhost:8937/upload/prompt", true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.rec.uuid = xhr.responseText
          this.visible = true
        }
      }
      fd.append('prompt', file)
      xhr.send(fd)
    }
  }
}
</script>
