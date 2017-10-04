<template>
<div class="container" v-if="visible">
<h3>Conference call:</h3>
<div class="row" style="margin-top: 10px">
  <div class="col">
    <b-button size="sm" variant="outline-success" @click="kick('all')">Kick All</b-button>
    <b-button size="sm" variant="outline-success" @click="mute('all')">Mute All</b-button>
    <b-button size="sm" variant="outline-success" @click="unmute('all')">Unmute All</b-button>
    <b-button size="sm" variant="outline-success" @click="deaf('all')">Deaf All</b-button>
    <b-button size="sm" variant="outline-success" @click="undeaf('all')">Undeaf All</b-button>
  </div>
  <div class="col">
    <b-button size="sm" variant="outline-warning" @click="inqueue()">Invite Inqueue</b-button>
  </div>
</div>
<div class="row" style="margin-top: 10px" v-for="(v,k) in members">
  <div class="col">
    "{{v['Caller-Caller-ID-Name']}}" &lt;{{v['Caller-Caller-ID-Number']}}&gt;
  </div>
  <div class="col-1">
    <b-button size="sm" variant="outline-primary" @click="kick(k)">Kick</b-button>
  </div>
  <div class="col-1">
    <b-button v-if="v.Speak == 'true'" size="sm" variant="outline-primary" @click="mute(k)">Mute</b-button>
    <b-button v-else size="sm" variant="outline-warning" @click="unmute(k)">Unmute</b-button>
  </div>
  <div class="col-1">
    <b-button v-if="v.Hear == 'true'" size="sm" variant="outline-primary" @click="deaf(k)">Deaf</b-button>
    <b-button v-else size="sm" variant="outline-warning" @click="undeaf(k)">Undeaf</b-button>
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
  methods: {
    query: async function () {
      this.members = await this.$agent.p_call('conference_members', [])
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
      this.$agent.p_call('conference', ['kick', id])
    },
    mute (id) {
      this.$agent.p_call('conference', ['mute', id])
    },
    deaf (id) {
      this.$agent.p_call('conference', ['deaf', id])
    },
    unmute (id) {
      this.$agent.p_call('conference', ['unmute', id])
    },
    undeaf (id) {
      this.$agent.p_call('conference', ['undeaf', id])
    },
    inqueue () {
      this.$agent.p_call('conference', ['inqueue'])
    }
  },
  created () {
    this.query()
    this.$bus.$on('agent_conf', this.handleConf)
  },
  beforeDestroy () {
    this.$bus.$off('agent_conf', this.handleConf)
  },
}
</script>
