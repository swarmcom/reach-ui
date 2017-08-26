<template>
<div>
  <transition appear name="fade">
    <div v-if="visible" class="alert alert-danger" role="alert">{{ text }}</div>
  </transition>
</div>
</template>

<script>
export default {
  name: 'alert',
  data () {
    return {
    }
  },
  props: ['visible', 'text']
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>