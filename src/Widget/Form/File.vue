<template>
  <b-row style="margin-top: 5px">
    <label
      :id="label"
      class="col-3 col-form-label"
    >
      {{ label }}
    </label>
    <b-col v-if="defined()">
      <b-img
        :src="filePath()"
        fluid
      />
    </b-col>
    <b-col>
      <b-form-file
        v-model="file"
        :placeholder="placeholder"
        :accept="fileType"
        @input="onFile"
      />
    </b-col>
    <b-col
      v-if="defined()"
      cols="1"
    >
      <b-btn
        variant="outline-danger"
        @click="clear"
      >
        Clear
      </b-btn>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormFile',
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: "undefined"
    },
    placeholder: {
      type: String,
      default: "No file chosen"
    },
    uri: {
      type: String,
      default: ""
    },
    fileType: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      file: undefined
    }
  },
  methods: {
    defined() {
      return (this.value != undefined && this.value != "undefined")
    },
    clear() {
      this.$emit("input", undefined)
    },
    filePath() {
      return this.$agent.get_rr_uri() + this.uri + '/' + this.value
    },
    onFile (file) {
      let xhr = new XMLHttpRequest()
      let fd = new FormData()
      let uri = this.$agent.get_api() + "/upload" + this.uri

      xhr.open("POST", uri, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.$emit("input", xhr.responseText)
        }
      }
      fd.append('file', file)
      xhr.send(fd)
    }
  }
}
</script>
