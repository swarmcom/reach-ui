<template>
<div class="form-signin">
  <h2 class="form-signin-heading">Please sign in:</h2>
  <label for="inputLogin" class="sr-only">Login</label>
  <input v-model="login" type="text" id="inputLogin" class="form-control" placeholder="Login" required="true" autofocus="true">
  <label for="inputPassword" class="sr-only">Password</label>
  <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required="true">
  <button @click="onSubmit" class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
</div>
</template>

<script>

export default {
  data () {
    return {
      login: 'agent2',
      password: '1234'
    }
  },
  methods: {
    onSubmit () {
      this.$agent.login(this.login, this.password, (Re) => {
        if(Re.error) {
          this.$notify({ title: 'Authentication:', text: Re.error, type: 'error' });
        }
      })
    }
  }
}
</script>

<style>
.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
#inputLogin {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
#inputPassword {
  margin-top: 10px;
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
