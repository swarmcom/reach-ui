<template>
<b-form-group v-if="this.$agent.can_call()" label='Call back to:'>
  <b-input-group>
    <b-form-input v-model="number" type="text" placeholder="enter a number..."></b-form-input>
    <b-input-group-button>
      <b-dropdown text="Call as" variant="outline-secondary" right>
        <b-dropdown-item v-for="line of this.$agent.vm.agent.lines" :key="line.id" @click="call(line)">{{line.name}}</b-dropdown-item>
      </b-dropdown>
    </b-input-group-button>
  </b-input-group>
</b-form-group>
</template>

<script>
export default {
  name: 'dialer',
  props: ["lines", 'original_caller'],
  data () {
    return {
      number: this.original_caller,
      line_out: {}
    }
  },
  methods: {
    call (line) {
      //this.$agent.hangup()
      this.$agent.place_call(line.id, this.number)
      this.$emit('dialer_input')
    }
  },
  created () {
  }
}
</script>
