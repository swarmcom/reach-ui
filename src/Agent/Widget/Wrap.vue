<template>
<div v-bind:style="{ color: activeColor}">
  {{msToHms(computedTime())}}
</div>
</template>

<script>
import Common from '../../Admin/Common'
export default {
  name: 'wrap-up',
  mixins: [Common],
  data () {
    return {
      activeColor: '',
    }
  },
  methods: {
    computedTime() {
      let time = 0
      if(this.$parent.state_time < (this.$parent.wrapup_timer*1000)) {
        time = (this.$parent.wrapup_timer*1000) - this.$parent.state_time
      }
      else {
        time = (this.$parent.state_time - (this.$parent.wrapup_timer*1000))
        this.activeColor = 'red';
      }
      return time
    }
  }
}
</script>