<template>
<b-form-group v-access:outbound-feature v-if="this.$agent.can_call()" label="Outbound Call">
  <b-input-group>
    <b-form-input v-model="number" type="text" placeholder="enter a number..."></b-form-input>
    <b-dropdown v-if="showLinesOut()" size="sm" text="Line Out" variant="outline-secondary">
      <b-dropdown-item v-for="line_out of this.$agent.vm.agent.lines_out" :key="line_out.id" @click="set(line_out)">{{line_out.name}}</b-dropdown-item>
    </b-dropdown>
    <b-form-input v-if="showLinesOut()" v-model="line_out.name" type="text" placeholder="Select Line Out" disabled></b-form-input>
    <b-input-group-button>
      <b-btn @click="onClick" variant="outline-success" :disabled="isDisabled()"><icon name="phone" scale="1.5"></icon></b-btn>
    </b-input-group-button>
  </b-input-group>
</b-form-group>
</template>

<script>
export default {
  name: 'dialer',
  data () {
    return {
      number: '',
      line_out: {}
    }
  },
  methods: {
    onClick () {
      this.$agent.make_call(this.number)
    },
    set (line) {
      this.line_out.id = line.id
      this.line_out.name = line.name
    },
    showLinesOut() {
      if(this.$agent.vm.agent.lines_out && this.$agent.vm.agent.lines_out.length > 0) {
        if(this.$agent.vm.agent.lines_out.length == 1) {
          this.line_out.id = this.$agent.vm.agent.lines_out[0].id
          this.line_out.name = this.$agent.vm.agent.lines_out[0].name
        }
        return true
      }
      else
        return false
    },
    isDisabled () {
      return Object.keys(this.line_out).length == 0 ? true : false;
    }
  }
}
</script>
