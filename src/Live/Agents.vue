<template>
<div>
  <stats></stats>
  <monitor></monitor>
</div>
</template>

<script>
import Monitor from '@/Live/Agents/Monitor'
import Stats from '@/Live/Agents/Stats'

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
