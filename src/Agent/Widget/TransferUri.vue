<template>
  <b-form-input
    v-model="uri"
    size="sm"
    variant="outline-secondary"
    type="text"
    placeholder="Enter number"
    autofocus="true"
    @keydown.enter.native="onEnter"
  />
</template>

<script>
export default {
  name: 'TransferUri',
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

