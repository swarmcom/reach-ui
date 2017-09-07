<template>
  <input v-model="uri" v-on:keyup.enter="onEnter" type="text" placeholder="Conference to uri,press enter" autofocus="true">
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