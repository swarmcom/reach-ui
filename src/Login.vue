<template>
  <b-container
    v-if="this.$agent.can_login()"
  >
    <b-row class="justify-content-center">
      <b-col cols="5">
        <b-row>
          <b-col>
            <h2>Login Reach:</h2>
          </b-col>
        </b-row>
        <div class="form-signin">
          <div class="form-group">
            <label for="inputLogin">Name:</label>
            <input
              id="inputLogin"
              v-model="login"
              type="text"
              class="form-control"
              placeholder="Login"
              required="true"
              autofocus="true"
              @keyup.enter="onSubmit"
            >
          </div>
          <div class="form-group">
            <label for="inputPassword">Password:</label>
            <input
              id="inputPassword"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Password"
              required="true"
              @keyup.enter="onSubmit"
            >
          </div>
          <div class="form-group">
            <label for="inputDomain">Domain:</label>
            <input
              id="inputDomain"
              v-model="domain"
              type="text"
              class="form-control"
              value=""
              required="true"
              @keyup.enter="onSubmit"
            >
          </div>
          <div class="form-check">
            <input
              id="checkbox"
              v-model="remember"
              type="checkbox"
            >
            <label
              class="form-check-label"
              for="checkbox"
            >Remember me</label>
          </div>
          <b-row class="justify-content-end">
            <div class="col-auto">
              <b-btn
                class="pointer"
                variant="primary"
                type="submit"
                @click="onSubmit"
              >
                Login
              </b-btn>
            </div>
          </b-row>
        </div>
      </b-col>
    </b-row>
    <b-modal
      ref="takeover"
      hide-footer
      title="Agent is logged in"
    >
      <b-btn
        class="pointer"
        variant="outline-danger"
        @click="takeover"
      >
        Take over
      </b-btn>
      <b-btn
        class="pointer"
        variant="outline-success"
        @click="cancel"
      >
        Cancel
      </b-btn>
    </b-modal>
    <notifications
      position="bottom right"
      :speed="500"
      :duration="1000"
    />
  </b-container>
</template>

<script>
import {EventBus} from '@/event-bus.js'
import Storage from '@/Storage'

export default {
  name: 'Login',
  mixins: [Storage],
  data () {
    return {
      login: '',
      password: '',
      domain: window.location.hostname,
      remember: false
    }
  },
  created () {
    this.maybeInitLocal().loadDataStorage()
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
  }
}
</script>

<style lang="scss">
//
@import "../node_modules/bootstrap/scss/bootstrap.scss";
@import "custom.scss";
</style>

