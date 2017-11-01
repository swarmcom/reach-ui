<template>
<b-form-group label="Override URI:">
  <b-input-group>
    <b-form-input v-model="uri" type="text"></b-form-input>
    <b-input-group-button>
      <b-dropdown text="Contacts" right>
        <b-dropdown-item v-for="uri of this.$agent.vm.agent.uris" :key="uri.uri" @click="set(uri.uri)">{{uri.uri}}</b-dropdown-item>
      </b-dropdown>
      <b-btn @click="override" variant="outline-primary">Set</b-btn>
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
    set: async function(uri) {
      this.uri = uri
      let re = await this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      this.$notify({ title: 'Success:', text: 'SIP Contant updated', type: 'success' })
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
