<template>
  <div class="col-12">
    <b-row>
      <b-col>
        <b-button-group style="width:100%">
          <b-btn
            size="sm"
            class="pointer"
            style="width:33%"
            variant="outline-secondary"
            @click="override"
          >
            Set
          </b-btn>
          <b-btn
            size="sm"
            class="pointer"
            style="width:33%"
            variant="outline-secondary"
            @click="reset"
          >
            Reset
          </b-btn>
          <b-btn
            size="sm"
            class="pointer"
            style="width:50%"
            variant="outline-secondary"
            @click="test"
          >
            Test
          </b-btn>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row style="margin-top:2px">
      <b-col>
        <b-input-group size="sm">
          <b-form-input
            v-model="value"
            class="customInput"
            variant="outline"
            size="sm"
            type="text"
            :placeholder="this.$agent.vm.agent.uri"
          />
          <b-dropdown
            size="sm"
            text="Contacts"
            variant="outline-secondary"
            :disabled="this.$agent.vm.agent.uris.length == 0"
          >
            <b-dropdown-item
              v-for="itemUri of this.$agent.vm.agent.uris"
              :key="itemUri.uri"
              @click="set(itemUri.uri)"
            >
              {{ itemUri.uri }}
            </b-dropdown-item>
          </b-dropdown>
        </b-input-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'MyPhoneUri',
  data () {
    return {
      uri: '',
      value: ''
    }
  },
  created () {
    this.query()
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
        this.$notify({ title: 'Success:', text: 'SIP Contact updated', type: 'success' })
      }
      else {
        this.$notify({ title: 'Failed:', text: 'SIP Contact failed', type: 'error' })
      }
    },
    reset: async function() {
      let re = await this.$agent.p_mfa('ws_agent', 'reset_uri', [])
      if (re === 'ok') {
        this.value = this.uri = ''
        this.$notify({ title: 'Success:', text: 'SIP Contact reset', type: 'success' })
      }
      else {
        this.$notify({ title: 'Failed:', text: 'SIP Contact reset failed', type: 'error' })
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
          this.$notify({ title: 'Success:', text: 'SIP Contact updated', type: 'success' })
        }
        else {
          this.$notify({ title: 'Failed:', text: 'SIP Contact failed', type: 'error' })
        }
        //this.$agent.p_mfa('ws_agent', 'override_uri', [this.uri])
      }
    }
  }
}
</script>
