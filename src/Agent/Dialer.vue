<template>
<b-form-group v-if="this.$agent.can_call()" label="Place a call to:">
  <b-input-group>
    <b-form-input v-model="number" type="text" placeholder="enter a number..."></b-form-input>
    <b-dropdown v-if="showLinesOut()" size="sm" text="Line Out" variant="outline-secondary">
      <b-dropdown-item v-for="line_out of this.$agent.vm.agent.lines_out" :key="line_out.id" @click="set(line_out)">{{line_out.name}}</b-dropdown-item>
    </b-dropdown>
    <b-form-input v-if="showLinesOut()" v-model="line_out.name" type="text" placeholder="Select Line Out" disabled></b-form-input>
    <b-input-group-button>
      <b-dropdown text="Call as" variant="outline-secondary" right>
        <b-dropdown-item v-for="line of this.$agent.vm.agent.lines" :key="line.id" @click="call(line.id)">{{line.name}}</b-dropdown-item>
      </b-dropdown>
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
      number: '',
      line_out: {}
    }
  },
  methods: {
    call (line) {
      this.$agent.place_call(line.id, this.number)
    }
  },
  created () {
  }
}
</script>
