<template>
<div class="row">
  <div class="col">
    <h1>Admin</h1>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    created () {
      this.agent = this.$parent.agent
    }
  }
}
</script>