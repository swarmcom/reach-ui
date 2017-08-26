<template>
<div class="form">
  <form-text id="name" label="Name" v-model="profile.name"></form-text>
  <form-text id="permissions" label="Permissions" v-model="profile.perm_profile"></form-text>
  <form-text id="ring_timeout" label="Ring timeout" v-model="profile.ring_timeout"></form-text>
  <form-text id="max_ring_fails" label="Max rings" v-model="profile.max_ring_fails"></form-text>
  <form-text id="autologout" label="Auto logout" v-model="profile.autologout"></form-text>
  <skills id="skills" label="Skills" v-model="skills"></skills>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
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
  name: 'admin-profile',
  props: ['id'],
  data () {
    return {
      profile: {},
      skills: []
    }
  },
  components: { 'form-text': FormText, 'skills': Skills },
  methods: {
    query () {
      if (this.id) {
        this.ws_agent.get_profile(this.id, Obj => { this.profile = Obj; this.skills = object2list(Obj.skills) })
      }
    },
    onCommit () {
      this.profile.skills = list2object(this.skills)
      this.ws_agent.update_profile(this.profile, () => this.$router.push('/admin/profiles'))
    },
    onDelete () {
      if (this.id) {
        this.ws_agent.delete_profile(this.id, () => this.$router.push('/admin/profiles'))
      }
    }
  },
  created () {
    this.ws_agent = this.$parent.agent
    this.query()
  }
}
</script>