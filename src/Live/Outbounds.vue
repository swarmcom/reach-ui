<template>
<div>
  <stats></stats>
  <monitor></monitor>
</div>
</template>

<script>
import Monitor from '@/Live/Outbounds/Monitor'
import Stats from '@/Live/Outbounds/Stats'

export default {
  components: {
    monitor: Monitor,
    stats: Stats
  },
  data () {
    return {
    }
  },
}
</script>
