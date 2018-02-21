<template>
<div v-bind:style="{ color: activeColor}">
  {{msToHms(computedTime())}}
</div>
</template>

<script>
import Common from '../../Admin/Common'
export default {
  name: 'wrap-up',
  props: ['inqueue', 'state_time'],
  mixins: [Common],
  data () {
    return {
      activeColor: '',
    }
  },
  methods: {
    computedTime() {
      let time = 0
      if(this.inqueue && this.inqueue.queue){
        time = this.state_time
        if(this.state_time < (this.inqueue.queue.wrapup_timer*1000))
          time = (this.inqueue.queue.wrapup_timer*1000) - this.state_time
        else {
          time = (this.state_time - (this.inqueue.queue.wrapup_timer*1000))
          this.activeColor = 'red';
        }
      }
      return time
    }
  }
}
</script>