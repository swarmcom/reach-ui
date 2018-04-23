<template>
<b-form-group v-if="this.$agent.can_call()" label='Call back to:'>
  <b-input-group>
    <b-form-input v-model="number" type="text" placeholder="enter a number..."></b-form-input>
    <b-button-group>
      <b-dropdown v-if="lines.length > 0" text="Call as" variant="outline-secondary" right>
        <b-dropdown-item v-for="line of lines" :key="line.id" @click="call(line)">{{line.name}}</b-dropdown-item>
      </b-dropdown>
      <b-btn v-if="$agent.vm.agent.line_id" @click="call($agent.vm.agent.line)" variant="outline-secondary">{{$agent.vm.agent.line.name}}</b-btn>
    </b-button-group>
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
    }
  },
  methods: {
    call (line) {
      this.$agent.place_call(line.id, this.number)
      this.$emit('dialer_input')
    }
  },
  created () {
  }
}
</script>
