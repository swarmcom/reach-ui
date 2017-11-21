<template>
<b-form-group label="Override URI:">
  <b-input-group>
    <b-form-input v-model="uri" type="text"></b-form-input>
    <b-input-group-button>
      <b-dropdown text="Contacts" variant="outline-secondary" :disabled="isDisabled()" right>
        <b-dropdown-item v-for="uri of this.$agent.vm.agent.uris" :key="uri.uri" @click="set(uri.uri)">{{uri.uri}}</b-dropdown-item>
      </b-dropdown>
      <b-btn class="pointer" @click="test" variant="success">Test</b-btn>
      <b-btn class="pointer" @click="override" variant="primary">Set</b-btn>
    </b-input-group-button>
  </b-input-group>
</b-form-group>
</template>

<script>
export default {
  name: 'override',
  data () {
    return {
      uri: '',
      actions: ['asd', 'dsa']
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
    }
  },
  created () {
    this.query()
  }
}
</script>
