<template>
<b-form-row>
  <b-col>
    <b-input-group>
      <b-form-input v-model="uri" type="text" :placeholder="this.$agent.vm.agent.uri"></b-form-input>
      <b-input-group-button>
        <b-dropdown text="Contacts" variant="outline-secondary" :disabled="isDisabled()" right>
          <b-dropdown-item v-for="uri of this.$agent.vm.agent.uris" :key="uri.uri" @click="set(uri.uri)">{{uri.uri}}</b-dropdown-item>
        </b-dropdown>
      </b-input-group-button>
    </b-input-group>
  </b-col>
  <b-col>
    <b-btn class="pointer" @click="override" variant="primary">Set</b-btn>
    <b-btn class="pointer" @click="reset" variant="secondary">Reset</b-btn>
    <b-btn class="pointer" @click="test" variant="success">Test</b-btn>
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'override',
  data () {
    return {
      uri: ''
    }
  },
  methods: {
    query: async function() {
      this.uri = await this.$agent.p_mfa('ws_agent', 'override_uri')
      this.uri = this.uri == 'undefined'? '' : this.uri
    },
    isDisabled () {
      return this.$agent.vm.agent.uris.length == 0
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
      let re = await this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      this.$notify({ title: 'Success:', text: 'SIP Contant updated', type: 'success' })
    },
    reset: async function() {
      this.uri = undefined
      let re = await this.$agent.p_mfa('ws_agent', 'reset_uri', [])
      this.$notify({ title: 'Success:', text: 'SIP Contant reset', type: 'success' })
    }
  },
  created () {
    this.query()
  }
}
</script>
