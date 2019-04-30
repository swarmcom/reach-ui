<template>
  <div v-if="visible">
    <div
      class="row"
      style="margin-top: 10px"
    >
      <div class="col session-manager-text">
        <b>Conference:</b>
      </div>
    </div>
    <div
      class="row col-12"
      style="margin-top:5px"
    >
      <b-input-group>
        <b-input-group-append>
          <b-button
            class="pointer"
            size="sm"
            variant="outline-secondary"
            @click="kick('all')"
          >
            Kick All
          </b-button>
          <b-button
            class="pointer"
            size="sm"
            variant="outline-secondary"
            @click="mute('all')"
          >
            Mute All
          </b-button>
          <b-button
            class="pointer"
            size="sm"
            variant="outline-secondary"
            @click="unmute('all')"
          >
            Unmute All
          </b-button>
          <b-button
            class="pointer"
            size="sm"
            variant="outline-secondary"
            @click="deaf('all')"
          >
            Deaf All
          </b-button>
          <b-button
            class="pointer"
            size="sm"
            variant="outline-secondary"
            @click="undeaf('all')"
          >
            Undeaf All
          </b-button>
          <b-button
            class="pointer"
            size="sm"
            variant="outline-warning"
            @click="inqueue()"
          >
            Add Inqueue
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <div
      class="row"
      style="margin-top: 10px"
    >
      <div
        class="col-12 session-manager-text"
        style="margin-top:5px"
      >
        <b>In Conference with:</b>
      </div>
    </div>
    <div
      v-for="(v,k) in members"
      :key="k"
      class="row"
      style="margin-top: 5px"
    >
      <div class="col-5 agent-state-text">
        <b>Caller ID Name: </b> {{ v['Caller-Caller-ID-Name'] }}<br>
        <b>Caller ID Number: </b>{{ v['Caller-Caller-ID-Number'] }}
        <b-badge
          v-if="v.Floor =='true'"
          variant="danger"
        >
          Floor
        </b-badge>
      </div>
      <div class="col-7">
        <b-input-group>
          <b-input-group-append>
            <b-button
              class="pointer"
              size="sm"
              variant="outline-secondary"
              @click="kick(k)"
            >
              Kick
            </b-button>
            <b-button
              v-if="v.Speak == 'true'"
              class="pointer"
              size="sm"
              variant="outline-secondary"
              @click="mute(k)"
            >
              Mute
            </b-button>
            <b-button
              v-else
              class="pointer"
              size="sm"
              variant="outline-warning"
              @click="unmute(k)"
            >
              Unmute
            </b-button>
            <b-button
              v-if="v.Hear == 'true'"
              class="pointer"
              size="sm"
              variant="outline-secondary"
              @click="deaf(k)"
            >
              Deaf
            </b-button>
            <b-button
              v-else
              class="pointer"
              size="sm"
              variant="outline-warning"
              @click="undeaf(k)"
            >
              Undeaf
            </b-button>
            <b-button
              v-if="v.Hold"
              class="pointer"
              size="sm"
              variant="outline-warning"
              @click="unhold(k)"
            >
              Unhold
            </b-button>
            <b-button
              v-else
              class="pointer"
              size="sm"
              variant="outline-secondary"
              @click="hold(k)"
            >
              Hold
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      members: {},
      visible: false
    }
  },
  created () {
    this.query()
    this.$bus.$on('agent_conf', this.handleConf)
  },
  beforeDestroy () {
    this.$bus.$off('agent_conf', this.handleConf)
  },
  methods: {
    query: async function () {
      this.members = await this.$agent.p_mfa('ws_agent', 'conference_members', [])
      this.visible = true
    },
    handleConf ({action, member_id, vars}) {
      if (action == "del-member") {
        this.$delete(this.members, member_id)
      } else {
        this.$set(this.members, member_id, vars)
      }
    },
    kick (id) {
      this.$agent.p_mfa('ws_agent', 'conference', ['kick', id])
    },
    mute (id) {
      this.$agent.p_mfa('ws_agent', 'conference', ['mute', id])
    },
    deaf (id) {
      this.$agent.p_mfa('ws_agent', 'conference', ['deaf', id])
    },
    unmute (id) {
      this.$agent.p_mfa('ws_agent', 'conference', ['unmute', id])
    },
    undeaf (id) {
      this.$agent.p_mfa('ws_agent', 'conference', ['undeaf', id])
    },
    hold (id) {
      this.$agent.p_mfa('ws_agent', 'conference', ['hold', id])
    },
    unhold (id) {
      this.$agent.p_mfa('ws_agent', 'conference', ['unhold', id])
    },
    inqueue () {
      this.$agent.p_mfa('ws_agent', 'conference', ['inqueue'])
    }
  },
}
</script>
