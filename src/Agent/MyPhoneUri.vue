<template>
  <b-input-group size="sm">
    <b-form-input size="sm" variant="outline-secondary" v-model="uri" type="text"></b-form-input>
    <b-input-group-button>
      <b-btn @click="override" variant="outline-secondary">Set</b-btn>
    </b-input-group-button>
  </b-input-group>
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
    override () {
      if (!!this.uri) {
        this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
