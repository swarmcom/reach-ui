<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h3>Instance parameters:</h3>
      </div>
    </div>
    <div
      v-for="param of params"
      :key="param.key"
      class="form-row"
      style="margin-top: 5px"
    >
      <div class="col-3">
        <input
          v-model="param.key"
          type="text"
          class="form-control"
          readonly
        >
      </div>
      <div class="col">
        <input
          v-if="param.key != 'log_level'"
          v-model="param.value"
          type="text"
          class="form-control"
        >
        <b-form-select
          v-else
          v-model="param.value"
          :options="log_options"
        />
      </div>
    </div>

    <b-row style="margin-top: 20px">
      <b-col>
        <button
          class="btn btn-primary"
          @click="commit"
        >
          Commit
        </button>
        <button
          class="btn btn-outline-primary"
          @click="cancel"
        >
          Cancel
        </button>
      </b-col>
      <b-col
        v-show="false"
        cols="4"
      >
        <button
          class="btn btn-success"
          @click="save"
        >
          Save
        </button>
        <button
          class="btn btn-danger"
          @click="erase"
        >
          Erase
        </button>
        <button
          class="btn btn-warning"
          @click="apply"
        >
          Apply
        </button>
      </b-col>
    </b-row>
    <b-row style="margin-top: 20px">
      <b-col>
        <button
          class="btn btn-success"
          @click="download"
        >
          Download
        </button>
      </b-col>
      <b-col>
        <b-form-file
          v-model="config_file"
          placeholder="Choose json config to upload..."
          accept=".json"
          @input="upload"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Common from '@/Admin/Common'

export default {
  name: 'AdminParams',
  mixins: [Common],
  data () {
    return {
      config_file: undefined,
      params: [],
      log_options: ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'],
      name: '',
      value: ''
    }
  },
  created () {
    this.query()
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
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
  }
}
</script>
