<template>
<div>
  <stats></stats>
  <vmstats></vmstats>
  <monitor></monitor>
</div>
</template>

<script>
import Monitor from '@/Live/Inbounds/Monitor'
import Stats from '@/Live/Inbounds/Stats'
import VMStats from '@/Live/Voicemails/Stats'

export default {
  components: {
    monitor: Monitor,
    stats: Stats,
    vmstats: VMStats
  },
  data () {
    return {
    }
  },
}
</script>
