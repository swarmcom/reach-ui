<template>
  <div>
    <transition
      name="reach"
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
