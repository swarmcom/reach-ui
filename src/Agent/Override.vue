<template>
  <b-form-row>
    <b-col>
      <b-input-group>
        <b-form-input
          v-model="uri"
          type="text"
          :placeholder="this.$agent.vm.agent.uri"
        />
        <b-input-group-append>
          <b-dropdown
            text="Contacts"
            variant="outline-secondary"
            :disabled="isDisabled()"
            right
          >
            <b-dropdown-item
              v-for="itemUri of this.$agent.vm.agent.uris"
              :key="itemUri.uri"
              @click="set(itemUri.uri)"
            >
              {{ itemUri.uri }}
            </b-dropdown-item>
          </b-dropdown>
        </b-input-group-append>
      </b-input-group>
    </b-col>
    <b-col>
      <b-btn
        class="pointer"
        variant="primary"
        @click="override"
      >
        Set
      </b-btn>
      <b-btn
        class="pointer"
        variant="secondary"
        @click="reset"
      >
        Reset
      </b-btn>
      <b-btn
        class="pointer"
        variant="success"
        @click="test"
      >
        Test
      </b-btn>
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'Override',
  data () {
    return {
      uri: ''
    }
  },
  created () {
    this.query()
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
      this.$notify({ title: 'Success:', text: 'SIP Contact updated', type: 'success' })
    },
    test () {
      this.$agent.p_mfa('ws_agent', 'test_uri', [this.uri])
    },
    override: async function() {
      let re = await this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      this.$notify({ title: 'Success:', text: 'SIP Contact updated', type: 'success' })
    },
    reset: async function() {
      this.uri = undefined
      let re = await this.$agent.p_mfa('ws_agent', 'reset_uri', [])
      this.$notify({ title: 'Success:', text: 'SIP Contact reset', type: 'success' })
    }
  }
}
</script>
