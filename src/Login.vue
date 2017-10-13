<template>
<div>
  <h6 style="margin-top:10px"><b>LOGIN</b></h6>
  <div class="form-signin">
    <h6 class="form-signin-heading">USERNAME AND PASSWORD</h6>
    <div class="form-group row align-items-center">
      <label for="inputLogin" class="sr-only">Email</label>
      <div class="col-sm-3">
        <input v-model="login" v-on:keyup.enter="onSubmit" type="text" class="form-control" id="inputLogin" placeholder="Login" required="true" autofocus="true">
      </div>
    </div>
    <div class="form-group row">
      <label for="inputPassword" class="sr-only">Password</label>
      <div class="col-sm-3">
        <input v-model="password" v-on:keyup.enter="onSubmit" type="password" id="inputPassword" class="form-control" placeholder="Password" required="true">
      </div>
    </div>
    <button @click="onSubmit" class="btn btn-lg btn-primary btn-block col-sm-2" type="submit">Login</button>
  </div>
  <b-modal ref="takeover" hide-footer title="Agent is logged in">
    <b-btn variant="outline-danger" @click="takeover">Take over</b-btn>
    <b-btn variant="outline-success" @click="cancel">Cancel</b-btn>
  </b-modal>
</div>
</template>

<script>
import {EventBus} from './event-bus.js'

export default {
  data () {
    return {
      login: 'agent2',
      password: '1234'
    }
  },
  methods: {
    cancel () {
      this.$refs.takeover.hide()
    },
    takeover: function() {
      this.$agent.takeover(this.login, this.password, (Re) => {
        if (Re.error) {
          this.$notify({ title: 'Take over:', text: Re.error, type: 'error' })
        }
      })
    },
    onSubmit () {
      this.$agent.login(this.login, this.password, (Re) => {
        if (Re.error && Re.error == 'already_logged_in') {
          this.$refs.takeover.show()
        } else if (Re.error) {
          this.$notify({ title: 'Authentication:', text: Re.error, type: 'error' })
        }
      })
    }
  }
}
</script>
