<template>
<b-form-group v-if="this.$agent.can_call()" label="Call a number:">
  <b-input-group>
    <b-form-input v-model="number" type="text"></b-form-input>
    <b-input-group-button>
      <b-btn @click="onClick" variant="outline-success"><icon name="phone" scale="1.5"></icon></b-btn>
    </b-input-group-button>
  </b-input-group>
</b-form-group>
</template>

<script>
export default {
  name: 'dialer',
  data () {
    return {
      number: ''
    }
  },
  methods: {
    onClick () {
      this.$agent.make_call(this.number)
    }
  }
}
</script>
