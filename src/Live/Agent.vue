<template>
<div>
  <group></group>
  <stats></stats>
</div>
</template>

<script>
import Stats from '@/Live/Agent/Stats'
import Group from '@/Live/Agent/Group'

export default {
  components: {
    group: Group,
    stats: Stats
  },
  data () {
    return {
    }
  },
}
</script>
