<template>
<div>
  <div class="row">
    <div class="col"><agents></agents></div>
  </div>
  <div class="row">
    <div class="col"><inqueues></inqueues></div>
  </div>
  <div class="row">
    <div class="col"><outgoings></outgoings></div>
  </div>
</div>

</template>

<script>
import Agents from '@/Monitor/Agents'
import Inqueues from '@/Monitor/Inqueues'
import Outgoings from '@/Monitor/Outgoings'

export default {
  data () {
    return {
    }
  },
  components: {
    'agents': Agents,
    'inqueues': Inqueues,
    'outgoings': Outgoings
  }
}
</script>
