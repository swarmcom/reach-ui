<template>
<div class="form">
  <form-text label="Prompt Name" v-model="rec.name"></form-text>
  <form-text label="Prompt Description" v-model="rec.description"></form-text>
  <div class="row" style="margin-top: 5px">
    <label class="col-3 col-form-label">Choose File</label>
    <div class="col-9">
      <b-form-file v-model="file" v-on:input="onFile" :placeholder="rec.file"></b-form-file>
    </div>
  </div>
  <div style="margin-top:20px">
    <button @click="onCommit" :disabled="isDisabled()" class="btn btn-primary">Commit</button>
    <button @click="onCancel" class="btn btn-outline-primary">Cancel</button>
    <button @click="onRecord" class="btn btn-outline-warning">Record</button>
    <button @click="onDelete" v-if="rec.id" class="btn btn-danger float-right">Delete</button>
  </div>
  <help></help>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import Obj from '@/Admin/Object'

export default {
  name: 'admin-prompt',
  props: ['id'],
  mixins: [Common, Obj],
  data () {
    return {
      rec: {},
      module: 'ws_db_prompt',
      redirect: '/admin/prompts',
      disabled: true,
      file: undefined
    }
  },
  methods: {
    isDisabled() {
      if (this.rec.file == undefined) {
        return this.disabled
      } else {
        return false
      }
    },
    onRecord () {
      this.$agent.p_mfa(this.module, 'record', [this.id])
    },
    onFile (file) {
      this.disabled = true

      let xhr = new XMLHttpRequest()
      let fd = new FormData()

      xhr.open("POST", `${this.$agent.get_api()}/upload/prompt`, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.rec.file = file.name
          this.rec.uuid = xhr.responseText
          this.disabled = false
        }
      }
      fd.append('prompt', file)
      xhr.send(fd)
    }
  }
}
</script>
