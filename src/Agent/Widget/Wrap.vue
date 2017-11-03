<template>
<div>
  {{msToHms(computedTime())}}
</div>
</template>

<script>
import Common from '../../Admin/Common'
export default {
  name: 'wrap-up',
  props: {
    inqueue: Object,
    state_time: Number
  },
  mixins: [Common],
  data () {
    return {
    }
  },
  methods: {
    computedTime() {
      let time = 0
      if(this.inqueue.queue != undefined){
        time = this.state_time
        if(this.state_time < (this.inqueue.queue.wrapup_timer*1000))
          time = (this.inqueue.queue.wrapup_timer*1000) - this.state_time
        else
          time = (this.state_time - (this.inqueue.queue.wrapup_timer*1000))
      }
      return time
    }
  }
}
</script>