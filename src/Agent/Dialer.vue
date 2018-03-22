<template>
<b-form-group v-if="can_call()" label="Place a call to:">
  <b-input-group>
    <b-form-input v-model="number" type="text" placeholder="enter a number..."></b-form-input>
    <b-input-group-button>
      <b-dropdown v-if="lines.length > 0" text="Call as" variant="outline-secondary" right>
        <b-dropdown-item v-for="line of lines" :key="line.id" @click="call(line)">{{line.name}}</b-dropdown-item>
      </b-dropdown>
      <b-btn v-if="$agent.vm.agent.line_id" @click="call($agent.vm.agent.line)" variant="outline-secondary">{{$agent.vm.agent.line.name}}</b-btn>
    </b-input-group-button>
  </b-input-group>
</b-form-group>
</template>

<script>
export default {
  name: 'dialer',
  props: {
    original_caller: String
  },
  data () {
    return {
      number: this.original_caller,
      line_out: {},
      lines: [],
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
    this.query()
  },
  watch: {
    original_caller: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.number = newVal
      }
    },
  }
}
</script>
