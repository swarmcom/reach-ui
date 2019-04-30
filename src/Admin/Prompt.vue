<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="Prompt Name"
    />
    <form-text
      v-model="rec.description"
      label="Prompt Description"
    />
    <div
      class="row"
      style="margin-top: 5px"
    >
      <label class="col-3 col-form-label">Choose File</label>
      <div class="col-9">
        <b-form-file
          v-model="file"
          :placeholder="rec.file"
          accept=".wav"
          @input="onFile"
        />
      </div>
    </div>
    <div style="margin-top:20px">
      <b-btn
        :disabled="isDisabled()"
        class="pointer"
        variant="primary"
        @click="onCommit"
      >
        Commit
      </b-btn>
      <b-btn
        class="pointer"
        variant="outline-primary"
        @click="onCancel"
      >
        Cancel
      </b-btn>
      <b-btn
        class="pointer"
        variant="outline-warning"
        @click="onRecord"
      >
        Record
      </b-btn>
      <b-btn
        v-if="rec.id"
        class="float-right pointer"
        variant="danger"
        @click="onDelete"
      >
        Delete
      </b-btn>
    </div>
    <help />
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import Obj from '@/Admin/Object'

export default {
  name: 'AdminPrompt',
  mixins: [Common, Obj],
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      rec: {},
      module: 'ws_db_prompt',
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
