<template>
  <div v-access:reports-ui>
    <transition name="reach" mode="out-in">
      <router-view></router-view>
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
