<template>
<div>
  <stats></stats>
  <monitor></monitor>
</div>
</template>

<script>
import Monitor from '@/Live/Inbounds/Monitor'
import Stats from '@/Live/Inbounds/Stats'

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
