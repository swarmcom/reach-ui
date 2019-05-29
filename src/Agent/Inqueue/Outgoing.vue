<template>
  <div
    v-if="visible"
    style="margin-top: 10px"
  >
    <b-row>
      <b-col cols="2">
        <div class="call-phone-center">
          <icon
            style="color:#838383"
            name="mobile"
            scale="4"
          />
        </div>
        <div class="call-hand-center">
          <icon
            style="color:#838383"
            name="handshake-o"
            scale="3"
          />
        </div>
      </b-col>
      <b-col cols="10">
        <dl class="row agent-state-text">
          <dt class="col-sm-12 session-manager-text">
            Outbound Call:
          </dt>
          <dd class="col-sm-4">
            To:
          </dd>
          <dd class="col-sm-8">
            {{ outgoing.target }}
          </dd>
          <dd
            v-if="!this.$agent.is_ringing()"
            class="col-sm-4"
          >
            Wait Time:
          </dd>
          <dd
            v-if="!this.$agent.is_ringing()"
            class="col-sm-8"
          >
            {{ msToHms(this.$agent.vm.wait_time) }}
          </dd>
          <dd class="col-sm-4">
            Client:
          </dd>
          <dd class="col-sm-8">
            {{ outgoing.line_out.client.name }}
          </dd>
          <dd class="col-sm-4">
            Line:
          </dd>
          <dd class="col-sm-8">
            {{ outgoing.line_out.name }}
          </dd>
        </dl>
      </b-col>
    </b-row>
  </div><!-- container -->
</template>
<script>
import Common from '@/Admin/Common'
export default {
  mixins: [Common],
  data () {
    return {
      visible: false,
      outgoing: {}
    }
  },
  created () {
    this.query()
  },
  methods: {
    query: async function () {
      this.outgoing = await this.$agent.p_mfa('ws_agent', 'get_outgoing', [])
      this.visible = true
    }
  }
}
</script>
