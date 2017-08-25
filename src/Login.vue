<template>
<div class="row">
  <div class="col"></div>
  <div class="col">
    <div class="form-group">
      <label for="login">Login</label>
      <input v-model="login" type="text" class="form-control" id="login" placeholder="Enter login">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
    </div>
    <button @click="onSubmit" class="btn btn-primary">Submit</button>
  </div>
  <div class="col"></div>
</div>
</template>

<script>
export default {
  data() {
    return {
      login: '',
      password: ''
    }
  },
  methods: {
    onSubmit() {
      this.agent.login(this.login, this.password)
    }
  },
  created() {
    this.agent = this.$parent.agent
  }
}
</script>

<style>
</style>
