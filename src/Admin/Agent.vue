<template>
<div class="form">
  <form-text id="login" label="Login" v-model="agent.login"></form-text>
  <form-text id="password" label="Password" v-model="agent.password"></form-text>
  <form-text id="firstname" label="First name" v-model="agent.firstname"></form-text>
  <form-text id="lastname" label="Last name" v-model="agent.lastname"></form-text>
  <profiles id="profile" label="Profile" v-model="agent.group_id"></profiles>
  <form-text id="permissions" label="Permissions" v-model="agent.permissions"></form-text>
  <form-text id="uri" label="SIP URI" v-model="agent.uri"></form-text>
  <form-text id="ring_timeout" label="Ring timeout" v-model="agent.ring_timeout"></form-text>
  <form-text id="max_ring_fails" label="Max rings" v-model="agent.max_ring_fails"></form-text>
  <form-text id="autologout" label="Auto logout" v-model="agent.autologout"></form-text>
  <skills id="skills" label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Profiles from '../Widget/Profiles.vue'
import Skills from '../Widget/Skills.vue'

function object2list(Obj) {
  return Object.keys(Obj).map( K => { return { "key": K, "value": Obj[K] } } )
}

function list2object(List) {
  let Re = {}
  List.forEach(Obj => Re[Obj.key] = Obj.value)
  return Re
}

export default {
  name: 'admin-agent',
  props: ['id'],
  data () {
    return {
      agent: {},
      skills: []
    }
  },
  components: { 'form-text': FormText, 'profiles': Profiles, 'skills': Skills },
  methods: {
    query () {
      if (this.id) {
        this.$agent.get_agent(this.id, Obj => { this.agent = Obj.reply; this.skills = object2list(Obj.reply.skills) })
      }
    },
    onCommit () {
      this.agent.skills = list2object(this.skills)
      if (this.id) {
        this.$agent.update_agent(this.id, this.agent, () => this.$router.push('/admin/agents'))
      } else {
        this.$agent.create_agent(this.agent, () => this.$router.push('/admin/agents'))
      }
    },
    onDelete () {
      if (this.id) {
        this.$agent.delete_agent(this.id, () => this.$router.push('/admin/agents'))
      }
    },
  },
  created () {
    this.query()
  }
}
</script>