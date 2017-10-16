<template>
<div class="form">
  <form-text id="name" label="Name" v-model="prompt.name"></form-text>
  <form-text id="description" label="Description" v-model="prompt.description"></form-text>
  <div class="form-group row">
    <label class="col-3 col-form-label">Choose File</label>
    <div class="col-9">
      <b-form-file style="width: 100%" id="prompt-file" v-model="file" choose-label="Select" v-on:input="onFile"></b-form-file>
      <div v-if="visible">Uploaded</div>
    </div>
  </div>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import Common from './Common'

export default {
  name: 'admin-prompt',
  props: ['id'],
  mixins: [Common],
  data () {
    return {
      prompt: {},
      visible: false,
      file: undefined
    }
  },
  methods: {
    query: async function () {
      if (this.id) {
        this.prompt = await this.$agent.p_mfa('ws_db_prompt', 'get', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa('ws_db_prompt', 'update', [this.id, this.prompt])
        } else {
          await this.$agent.p_mfa('ws_db_prompt', 'create', [this.prompt])
        }
        this.$router.push('/admin/prompts')
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa('ws_db_prompt', 'delete', [this.id])
        this.$router.push('/admin/prompts')
      }
    },
    onFile (file) {
      let xhr = new XMLHttpRequest()
      let fd = new FormData()

      this.prompt.file = file.name

      this.visible = false

      xhr.open("POST", "http://localhost:8937/upload/prompt", true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.prompt.uuid = xhr.responseText
          this.visible = true
        }
      }
      fd.append('prompt', file)
      xhr.send(fd)
    }
  },
  created () {
    this.query()
  }
}
</script>
