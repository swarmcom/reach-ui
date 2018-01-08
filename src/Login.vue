<template>
  <div class="container" v-if="this.$agent.can_login()">
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
      <input type="checkbox" id="checkbox" v-model="remember">
      <label for="checkbox"> Remember me</label>
      <button @click="onSubmit" class="btn btn-lg btn-primary btn-block col-sm-2 pointer" type="submit">Login</button>
    </div>
    <b-modal ref="takeover" hide-footer title="Agent is logged in">
      <b-btn class="pointer" variant="outline-danger" @click="takeover">Take over</b-btn>
      <b-btn class="pointer" variant="outline-success" @click="cancel">Cancel</b-btn>
    </b-modal>
  </div>
</template>

<script>
import {EventBus} from '@/event-bus.js'

export default {
  storageName: 'login',
  data () {
    return {
      login: '',
      password: '',
      remember: false,
      storage_name: 'login_remember'
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
      this.saveDataStorage()
      this.$agent.login(this.login, this.password, (Re) => {
        if (Re.error && Re.error == 'already_logged_in') {
          this.$refs.takeover.show()
        } else if (Re.error) {
          this.$notify({ title: 'Authentication:', text: Re.error, type: 'error' })
        }
      })
    },
    loadDataStorage() {
      if(this.$agent.vm.storage_data.loginLogin != undefined)
        this.login = this.$agent.vm.storage_data.loginLogin
      if(this.$agent.vm.storage_data.loginPassword != undefined)
        this.password = this.$agent.vm.storage_data.loginPassword
      if(this.$agent.vm.storage_data.loginRemember != undefined)
        this.remember = this.$agent.vm.storage_data.loginRemember
    },
    saveDataStorage() {
      if (this.remember) {
        this.$agent.vm.storage_data[this.$options.storageName+'Login'] = this.login
        this.$agent.vm.storage_data[this.$options.storageName+'Password'] = this.password
        this.$agent.vm.storage_data[this.$options.storageName+'Remember'] = this.remember
      }
      else {
        this.$agent.vm.storage_data[this.$options.storageName+'Login'] = ''
        this.$agent.vm.storage_data[this.$options.storageName+'Password'] = ''
        this.$agent.vm.storage_data[this.$options.storageName+'Remember'] = this.remember
      }
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    }
  },
  created () {
    this.loadDataStorage()
  }
}
</script>

<style lang="scss">
//@import "./custom-bootstrap.scss";
@import "custom.scss";
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>

