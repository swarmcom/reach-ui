<template>
<div>
  <stats></stats>
  <monitor></monitor>
</div>
</template>

<script>
import Monitor from '@/Live/Voicemails/Monitor'
import Stats from '@/Live/Voicemails/Stats'

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
