<template>
  <div class="col-12">
    <b-row>
      <b-col>
        <b-button-group style="width:100%">
          <b-btn size="sm" class="pointer" style="width:33%" @click="override" variant="outline-secondary">Set</b-btn>
          <b-btn size="sm" class="pointer" style="width:33%" @click="reset" variant="outline-secondary">Reset</b-btn>
          <b-btn size="sm" class="pointer" style="width:50%" @click="test" variant="outline-secondary">Test</b-btn>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row style="margin-top:2px">
      <b-col>
        <b-input-group size="sm">
          <b-form-input class="customInput" variant="outline" size="sm" v-model="value" type="text" :placeholder="this.$agent.vm.agent.uri"></b-form-input>
          <b-dropdown size="sm" text="Contacts" variant="outline-secondary" :disabled="this.$agent.vm.agent.uris.length == 0">
            <b-dropdown-item v-for="uri of this.$agent.vm.agent.uris" :key="uri.uri" @click="set(uri.uri)">{{uri.uri}}</b-dropdown-item>
          </b-dropdown>
        </b-input-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'my-phone-uri',
  data () {
    return {
      uri: '',
      value: ''
    }
  },
  methods: {
    query: async function() {
      this.uri = await this.$agent.p_mfa('ws_agent', 'override_uri')
      this.uri = this.uri == null ? '' : this.uri
      this.value = this.uri
    },
    set: async function(uri) {
      let re = await this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      if (re === 'ok') {
        this.value = this.uri = uri
        this.$notify({ title: 'Success:', text: 'SIP Contant updated', type: 'success' })
      }
      else {
        this.$notify({ title: 'Failed:', text: 'SIP Contant failed', type: 'error' })
      }
    },
    reset: async function() {
      let re = await this.$agent.p_mfa('ws_agent', 'reset_uri', [])
      if (re === 'ok') {
        this.value = this.uri = ''
        this.$notify({ title: 'Success:', text: 'SIP Contact reset', type: 'success' })
      }
      else {
        this.$notify({ title: 'Failed:', text: 'SIP Contant reset failed', type: 'error' })
      }
    },
    test () {
      if (this.uri != '') {
        this.$agent.p_mfa('ws_agent', 'test_uri', [this.uri])
      } else {
        this.$agent.p_mfa('ws_agent', 'test_uri', [this.$agent.vm.agent.uri])
      }
    },
    override: async function() {
      if (!!this.value) {
        let re = await this.$agent.p_mfa('ws_agent', 'override_uri', [this.value])
        if (re === 'ok') {
          this.uri = this.value
          this.$notify({ title: 'Success:', text: 'SIP Contant updated', type: 'success' })
        }
        else {
          this.$notify({ title: 'Failed:', text: 'SIP Contant failed', type: 'error' })
        }
        //this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
