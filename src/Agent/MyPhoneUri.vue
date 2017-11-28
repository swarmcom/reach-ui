<template>
  <div class="col-12">
    <b-row>
      <b-col>
        <b-button-group style="width:100%">
          <b-btn size="sm" class="pointer" style="width:50%" @click="override" variant="outline-secondary">Set</b-btn>
          <b-btn size="sm" class="pointer" style="width:50%" @click="test" variant="outline-secondary">Test</b-btn>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-input-group size="sm">
          <b-form-input variant="outline" size="sm" v-model="uri" type="text"></b-form-input>
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
