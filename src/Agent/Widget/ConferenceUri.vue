<template>
  <b-form-input size="sm" variant="outline-secondary" v-model="uri" @keydown.enter.native="onEnter" type="text" placeholder="Enter number" autofocus="true"></b-form-input>
</template>

<script>
export default {
  name: 'conference-uri',
  data () {
    return {
      uri: ''
    }
  },
  methods: {
    onEnter () {
      if(this.uri != '')
        this.$agent.conference_to_uri(this.uri);
      else
        this.$notify({ title: 'Conference to uri:', text: 'wrong sip uri entered', type: 'warning' });
    }
  }
}
</script>