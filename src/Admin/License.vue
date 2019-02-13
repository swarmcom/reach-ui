<template>
<div class="container">

  <div class="row"  style="margin-bottom: 10px">
    <div class="col">
      <h3>Domain license:</h3>
    </div>
  </div>
  <div v-if="license.license_type == 'server_lic'">
    <b-row><b-col cols=2>Type:</b-col><b-col>{{ license.domainDetails.license }}</b-col></b-row>
    <b-row><b-col cols=2>Users:</b-col><b-col>{{ license.domainDetails.r_seats ? license.domainDetails.r_seats : 'Unlimited' }}</b-col></b-row>
    <b-row v-if="license.domainDetails.license == 'Perpetual'"><b-col cols=2>Support:</b-col><b-col>{{ new Date(license.domainDetails.r_support).toLocaleString() }}</b-col></b-row>
    <b-row v-if="license.domainDetails.license == 'Subscription'"><b-col cols=2>Subscription:</b-col><b-col>{{ new Date(license.domainDetails.r_support).toLocaleString() }}</b-col></b-row>
    <b-row><b-col cols=2>Domain:</b-col><b-col>{{ license.domainDetails.name }}</b-col></b-row>
  </div>
  <div v-else>
    <b-row><b-col cols=2>Start:</b-col><b-col>{{ license.start }}</b-col></b-row>
    <b-row><b-col cols=2>End:</b-col><b-col>{{ license.end }}</b-col></b-row>
    <b-row><b-col cols=2>Users:</b-col><b-col>{{ license.users }}</b-col></b-row>
    <b-row><b-col cols=2>Domain:</b-col><b-col>{{ license.domain }}</b-col></b-row>
  </div>
  <b-row style="margin-top: 20px"><b-col cols=6><b-form-select v-model="selected" :options="options" class="mb-3" /></b-col></b-row>
  <b-row v-if="selected==1">
    <b-col>
      <b-form-file v-model="license_file" accept=".lic" v-on:input="upload" placeholder="Choose license to upload..."></b-form-file>
    </b-col>
    <b-col>
      <!--<button @click="cancel" class="btn btn-outline-primary">Cancel</button>-->
      <button @click="remove" class="btn btn-outline-danger">Delete</button>
    </b-col>
  </b-row>

  <b-row  v-if="selected==2">
    <b-col cols="6">
      <b-input-group>
        <b-form-input type="text" v-model="uid" placeholder="Type license unique id..."></b-form-input>
        <b-input-group-append>
          <button @click="update" class="btn btn-outline-primary">Update</button>
        </b-input-group-append>
      </b-input-group>
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
      selected: null,
      options: [
        { value: null, text: 'Please select an option to apply the license' },
        { value: 1, text: 'Upload license file' },
        { value: 2, text: 'Use unique id' }
      ],
      license_file: undefined,
      license_uuid: undefined,
      license: {},
      uid: undefined
    }
  },
  methods: {
    query: async function () {
      this.license = await this.$agent.p_mfa('ws_admin', 'get_license_data')
      if (this.license.license_type != 'server_lic') {
        if (!this.license.domain) this.license.domain = this.$agent.vm.agent.domain.name
        this.license.start = this.validateDate(this.license.start)
        this.license.end = this.validateDate(this.license.end)
      }
    },
    remove: async function () {
      this.license = await this.$agent.p_mfa('ws_admin', 'delete_license')
    },
    cancel: async function () {
      this.$router.go(-1)
    },
    update: function () {
      this.$agent.mfa('ws_admin', 'license_server', [this.uid], (re) => {
        if (re.reply == 'ok') {
          this.$notify({ title: 'Success:', text: 'License updated', type: 'success' })
          this.query()
        } else {
          this.$notify({ title: 'Error:', text: re.error, type: 'error' })
        }
      })
    },
    upload: function (file) {
      let xhr = new XMLHttpRequest()
      let fd = new FormData()

      xhr.open("POST", `${this.$agent.get_api()}/upload/license`, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.license_uuid = xhr.responseText
          this.$agent.mfa('ws_admin', 'license_file', [this.license_uuid], (re) => {
            if (re.reply == 'ok') {
              this.$notify({ title: 'Success:', text: 'License uploaded', type: 'success' })
              this.query()
            } else {
              this.$notify({ title: 'Error:', text: re.error, type: 'error' })
            }
          })
        }
      }
      fd.append('license', file)
      xhr.send(fd)
    },
    validateDate(value){
      if (!value) return
      let date = new Date(value)
      if(!isFinite(date)){
        return new Date("20" + value.substring(0,2) + "-" + value.substring(2,4) + "-" + value.substring(4,6) + "T" + value.substring(6,8) + ":" + value.substring(8,10) + ":" + value.substring(10,13)).toLocaleString('en-GB', { timeZone: 'UTC' }) + " UTC"
      }
      else {
        return date.toLocaleString('en-GB', { timeZone: 'UTC' }) + " UTC"
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
