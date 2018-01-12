<template>
  <div>
    <div class="row">
      <div class="col"><agents></agents></div>
    </div>
    <div class="row">
      <div class="col"><inqueues></inqueues></div>
    </div>
  </div>

</template>

<script>
  import Agents from '@/Monitor/dev/Agents'
  import Inqueues from '@/Monitor/dev/Inqueues'
  export default {
    data () {
      return {
      }
    },
    components: {
      'agents': Agents,
      'inqueues': Inqueues
    }
  }
</script>