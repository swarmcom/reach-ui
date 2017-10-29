<template>
<div>
  <inqueue></inqueue>
</div>
</template>

<script>
import Inqueue from './Stats/Inqueue.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    'inqueue': Inqueue
  }
}
</script>
