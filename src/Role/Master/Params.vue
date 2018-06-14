<template>
<div class="container">
  <div class="row">
    <div class="col">
      <h3>Instance parameters:</h3>
    </div>
  </div>
  <div v-for="param of params" class="form-row" style="margin-top: 5px">
    <div class="col-3">
      <input type="text" class="form-control" v-model="param.key" readonly>
    </div>
    <div class="col">
      <input type="text" class="form-control" v-model="param.value">
    </div>
  </div>

  <b-row style="margin-top: 20px">
    <b-col>
      <button @click="commit" class="btn btn-primary">Commit</button>
      <button @click="cancel" class="btn btn-outline-primary">Cancel</button>
    </b-col>
    <b-col cols=4>
      <button @click="save" class="btn btn-success">Save</button>
      <button @click="erase" class="btn btn-danger">Erase</button>
      <button @click="apply" class="btn btn-warning">Apply</button>
    </b-col>
  </b-row>
  <b-row style="margin-top: 20px">
    <b-col>
      <button @click="download" class="btn btn-success">Download</button>
    </b-col>
    <b-col>
      <b-form-file v-model="config_file" v-on:input="upload" placeholder="Choose json config to upload..." accept=".json"></b-form-file>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Common from '@/Admin/Common'

export default {
  name: 'admin-params',
  mixins: [Common],
  data () {
    return {
      config_file: undefined,
      params: [],
      name: '',
      value: ''
    }
  },
  methods: {
    query: async function () {
      let Params = await this.$agent.p_mfa('ws_master', 'get_params')
      this.params = this.object2list(Params).sort( (a,b) => a.key.localeCompare(b.key) )
    },
    add () {
      this.params.push({ key: this.name, value: this.value })
      this.name = ''
      this.value = ''
    },
    del (Key) {
      let id = this.params.findIndex(Obj => Obj.key === Key)
      if (id >= 0) {
        this.params.splice(id, 1)
      }
    },
    commit: async function () {
      let Params = this.list2object(this.params)
      await this.$agent.p_mfa('ws_master', 'set_params', [Params])
      this.$notify({ title: 'Success:', text: 'Parameters updated.', type: 'success' });
    },
    cancel: async function () {
      this.$router.push('/agents')
    },
    save: async function () {
      await this.$agent.p_mfa('ws_master', 'config', ['save'])
      this.$notify({ title: 'Success:', text: 'Configuration saved internally', type: 'success' })
    },
    erase: async function () {
      await this.$agent.p_mfa('ws_master', 'config', ['erase'])
      this.$notify({ title: 'Success:', text: 'Configuration erased', type: 'success' })
    },
    apply: async function () {
      await this.$agent.p_mfa('ws_master', 'config', ['apply'])
      this.$notify({ title: 'Success:', text: 'Configuration applied from internal save', type: 'success' })
    },
    upload: function (file) {
      let xhr = new XMLHttpRequest()
      let fd = new FormData()

      xhr.open("POST", `${this.$agent.get_api()}/upload/config`, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let UUID = xhr.responseText
          this.$agent.mfa('ws_master', 'config', ['upload', UUID], (re) => {
            if (re.reply == 'ok') {
              this.$notify({ title: 'Success:', text: 'Configuration applied', type: 'success' })
            } else {
              this.$notify({ title: 'Error:', text: 'Error applying config', type: 'error' })
            }
          })
        }
      }
      fd.append('config', file)
      xhr.send(fd)
    },
    download: async function () {
      let UUID = await this.$agent.p_mfa('ws_master', 'config', ['download'])
      let link = document.createElement('a')
      link.href = `${this.$agent.get_rr_uri()}/config/${UUID}.json`
      link.download = "reach_db.json"
      link.click()
    },
  },
  created () {
    this.query()
  }
}
</script>
