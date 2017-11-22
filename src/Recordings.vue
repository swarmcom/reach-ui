<template>
<div>
  <b-row>
    <b-col><records></records></b-col>
  </b-row>
</div>

</template>

<script>
import Records from '@/Recordings/Records'

export default {
  data () {
    return {
    }
  },
  components: {
    'records': Records
  }
}
</script>