<template>
  <b-form-group
    v-if="this.$agent.can_call()"
    label="Call back to:"
  >
    <b-input-group size="sm">
      <b-form-input
        v-model="number"
        type="text"
        placeholder="enter a number..."
      />
      <b-input-group-append>
        <b-dropdown
          v-if="lines.length > 0"
          size="sm"
          text="Call as"
          variant="outline-secondary"
          right
        >
          <b-dropdown-item
            v-for="line of lines"
            :key="line.id"
            @click="call(line)"
          >
            {{ line.name }}
          </b-dropdown-item>
        </b-dropdown>
        <b-btn
          v-if="$agent.vm.agent.line_id"
          size="sm"
          variant="outline-secondary"
          @click="call($agent.vm.agent.line)"
        >
          {{ $agent.vm.agent.line.name }}
        </b-btn>
      </b-input-group-append>
    </b-input-group>
  </b-form-group>
</template>

<script>

export default {
  name: 'VmDialer',
  props: {
    lines: {
      type: Array,
      default: () => ([])
    },
    originalCaller: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      number: ""
    }
  },
  created () {
    this.number=this.originalCaller
  },
  methods: {
    call (line) {
      this.$agent.place_call(line.id, this.number)
      this.$emit('dialer_input')
    }
  }
}
</script>
