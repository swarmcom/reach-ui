<template>
<b-row style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <b-col cols="2" v-if="defined()">
    <b-img :src="filePath()" fluid/>
  </b-col>
  <b-col>
    <b-form-file v-model="file" v-on:input="onFile" :placeholder="placeholder"></b-form-file>
  </b-col>
  <b-col v-if="defined()" cols="1">
    <b-btn variant="outline-danger" @click="clear">Clear</b-btn>
  </b-col>
</b-row>
</template>

<script>
export default {
  name: 'form-file',
  props: ['label', 'value', 'placeholder', 'uri'],
  data () {
    return {
      value: null,
      file: null
    }
  },
  methods: {
    defined() {
      return this.value
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
