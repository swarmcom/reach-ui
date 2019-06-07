<template>
  <div class="form">
    <form-text
      v-model="rec.name"
      label="MOH Name"
    />
    <form-text
      v-model="rec.description"
      label="MOH Description"
    />
    <div class="row">
      <label class="col-3 col-form-label">File</label>
      <div class="col-9">
        <b-form-file
          v-model="file"
          :placeholder="rec.file"
          accept=".mp3"
          @input="onFile"
        />
      </div>
    </div>
    <div style="margin-top: 20px">
      <b-btn
        variant="primary"
        @click="onCommit"
      >
        Save
      </b-btn>
      <b-btn
        class="pointer"
        variant="outline-primary"
        @click="onCancel"
      >
        Cancel
      </b-btn>
      <b-btn
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
  name: 'AdminMohs',
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
      module: 'ws_db_moh',
      disabled: true,
      file: null
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
    onFile (file) {
      this.disabled = true

      let xhr = new XMLHttpRequest()
      let fd = new FormData()

      xhr.open("POST", `${this.$agent.get_api()}/upload/moh`, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.rec.file = file.name
          this.rec.uuid = xhr.responseText
          this.disabled = false
        }
      }
      fd.append('moh', file)
      xhr.send(fd)
    }
  }
}
</script>
