<template>
<b-form-group label="Override URI:">
  <b-input-group>
    <b-form-input v-model="uri" type="text"></b-form-input>
    <b-input-group-button>
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
      uri: ''
    }
  },
  methods: {
    query: async function() {
      this.uri = await this.$agent.p_mfa('ws_agent', 'override_uri')
      this.uri = this.uri == 'undefined'? '' : this.uri
    },
    override () {
      this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
    }
  },
  created () {
    this.query()
  }
}
</script>
