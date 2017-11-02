<template>
  <div>
    <div class="row col-12">
      <b-input-group-button>
        <b-form-input size="sm" variant="outline-secondary" v-model="uri" type="text"></b-form-input>
        <b-btn size="sm" @click="override" variant="outline-secondary">Set</b-btn>
      </b-input-group-button>
    </div>
    <div class="row col-12" style="margin-top:5px">
      <b-dropdown size="sm" text="Contacts" right>
        <b-dropdown-item v-for="uri of this.$agent.vm.agent.uris" :key="uri.uri" @click="set(uri.uri)">{{uri.uri}}</b-dropdown-item>
      </b-dropdown>
      <b-btn size="sm" style="margin-top:5px" @click="test" variant="outline-secondary">Test</b-btn>
    </div>
  </divM>
</template>

<script>
export default {
  name: 'myPhoneUri',
  data () {
    return {
      uri: ''
    }
  },
  methods: {
    query: async function() {
      this.uri = await this.$agent.p_mfa('ws_agent', 'override_uri')
      this.uri = this.uri == 'undefined' ? '' : this.uri
    },
    set: async function(uri) {
      this.uri = uri
      let re = await this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      this.$notify({ title: 'Success:', text: 'SIP Contant updated', type: 'success' })
    },
    test () {
      this.$agent.p_mfa('ws_agent', 'test_uri', [this.uri])
    },
    override: async function() {
      if (!!this.uri) {
        let re = await this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
        this.$notify({ title: 'Success:', text: 'SIP Contant updated', type: 'success' })
        //this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
