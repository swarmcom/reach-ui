<template>
<b-form-group v-if="this.$agent.can_call()" label="Place a call to:">
  <b-input-group>
    <b-form-input v-model="number" type="text"></b-form-input>
    <b-input-group-button>
      <b-btn @click="call($agent.vm.agent.line)" variant="outline-secondary">{{$agent.vm.agent.line.name}}</b-btn>
    </b-input-group-button>
  </b-input-group>
</b-form-group>
</template>

<script>
export default {
  name: 'dialer',
  props: ["lines"],
  data () {
    return {
      number: ''
    }
  },
  methods: {
    query: async function () {
      this.lines = await this.$agent.p_mfa('ws_agent', 'lines_out')
    },
    call (line) {
      this.$agent.place_call(line.id, this.number)
    },
    can_call() {
      return this.$agent.can_call() && (this.lines.length > 0 || this.$agent.vm.agent.line_id) 
    }
  },
  created () {
  }
}
</script>
