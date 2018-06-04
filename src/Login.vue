<template>
<div class="container" v-if="this.$agent.can_login()">
  <div class="row justify-content-center">
    <div class="col-5">
      <div class="row">
        <div class="col">
          <h2>Login Reach:</h2>
        </div>
      </div>
      <div class="form-signin">
        <div class="form-group">
          <label for="inputLogin">Name:</label>
          <input id="inputLogin" v-model="login" v-on:keyup.enter="onSubmit" type="text" class="form-control" placeholder="Login" required="true" autofocus="true">
        </div>
        <div class="form-group">
          <label for="inputPassword">Password:</label>
          <input id="inputPassword" v-model="password" v-on:keyup.enter="onSubmit" type="password" class="form-control" placeholder="Password" required="true">
        </div>
        <div class="form-group">
          <label for="inputDomain">Domain:</label>
          <input id="inputDomain" v-model="domain" v-on:keyup.enter="onSubmit" type="text" class="form-control" value="" required="true">
        </div>
        <div class="form-check">
          <input type="checkbox" id="checkbox" v-model="remember">
          <label class="form-check-label" for="checkbox">Remember me</label>
        </div>
        <div class="row justify-content-end">
          <div class="col-auto">
            <button @click="onSubmit" class="btn btn-primary pointer" type="submit">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <b-modal ref="takeover" hide-footer title="Agent is logged in">
      <b-btn class="pointer" variant="outline-danger" @click="takeover">Take over</b-btn>
      <b-btn class="pointer" variant="outline-success" @click="cancel">Cancel</b-btn>
  </b-modal>
  <notifications position="bottom right" :speed="500" :duration="1000"></notifications>
</div>
</template>

<script>
import {EventBus} from '@/event-bus.js'
import Storage from '@/Storage'

export default {
  name: 'login',
  mixins: [Storage],
  data () {
    return {
      login: '',
      password: '',
      domain: window.location.hostname,
      remember: false
    }
  },
  methods: {
    cancel () {
      this.$refs.takeover.hide()
    },
    takeover: function() {
      this.$agent.takeover(this.login, this.password, this.domain, (Re) => {
        if (Re.error) {
          this.$notify({ title: 'Take over:', text: Re.error, type: 'error' })
        }
      })
    },
    onSubmit () {
      this.saveDataStorage()
      this.$agent.login(this.login, this.password, this.domain, (Re) => {
        if (Re.error && Re.error == 'already_logged_in') {
          this.$refs.takeover.show()
        } else if (Re.error) {
          this.$notify({ title: 'Authentication:', text: Re.error, type: 'error' })
        }
      })
    },
    loadDataStorage() {
      this.loadLocal('login', 'password', 'domain', 'remember')
    },
    saveDataStorage() {
      if (this.remember) {
        this.saveLocal('login', 'password', 'domain', 'remember').writeLocal()
      }
      else {
        this.eraseLocal('login', 'password', 'domain', 'remember').writeLocal()
      }
    }
  },
  created () {
    this.maybeInitLocal().loadDataStorage()
  }
}
</script>

<style lang="scss">
//
@import "../node_modules/bootstrap/scss/bootstrap.scss";
@import "custom.scss";
</style>

