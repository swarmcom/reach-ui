<template>
<div class="form-signin">
  <h2 class="form-signin-heading">Please sign in</h2>
  <label for="inputLogin" class="sr-only">Login</label>
  <input v-model="login" type="text" id="inputLogin" class="form-control" placeholder="Login" required="true" autofocus="true">
  <label for="inputPassword" class="sr-only">Password</label>
  <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required="true">
  <button @click="onSubmit" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
  <alert style="margin-top: 40px" v-bind:visible="authFailed" text="Login failed!"></alert>
</div>
</template>

<script>
import AlertWidget from './Widget/Alert.vue'

export default {
  data () {
    return {
      login: 'agent2',
      password: '1234',
      authFailed: false
    }
  },
  methods: {
    onSubmit () {
      this.agent.login(this.login, this.password, (Auth) => {
        this.authFailed = ~Auth
        setTimeout(() => this.authFailed = false, 3000)
      })
    }
  },
  created () {
    this.agent = this.$parent.agent
  },
  components: {
    alert: AlertWidget
  }
}
</script>

<style>
.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
