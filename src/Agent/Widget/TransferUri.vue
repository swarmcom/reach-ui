<template>
  <b-form-input size="sm" variant="outline-secondary" v-model="uri" v-on:keyup.enter="onEnter" type="text" placeholder="Enter number" autofocus="true"></b-form-input>
</template>

<script>
export default {
  name: 'transfer-uri',
  data () {
    return {
      uri: ''
    }
  },
  methods: {
    onEnter () {
      if(this.uri != '')
        this.$agent.transfer_to_uri(this.uri);
      else
        this.$notify({ title: 'Transfer to uri:', text: 'wrong sip uri entered', type: 'warning' });
    }
  }
}
</script>

