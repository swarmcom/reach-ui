<template>
<div class="form">
  <form-text id="name" label="Name" v-model="group.name"></form-text>
  <form-text id="group" label="Group" v-model="group.group"></form-text>
  <form-text id="hold_music" label="Music on hold" v-model="group.hold_music"></form-text>
  <form-text id="aging_factor" label="Aging" v-model="group.aging_factor"></form-text>
  <form-text id="weight" label="Weight" v-model="group.weight"></form-text>
  <form-text id="auto_wrapup" label="Auto Wrap-up" v-model="group.auto_wrapup"></form-text>
  <form-text id="wrapup_enabled" label="Wrap-up enabled" v-model="group.wrapup_enabled"></form-text>
  <form-text id="wrapup_timer" label="Wrap-up timer" v-model="group.wrapup_timer"></form-text>
  <skills id="skills" label="Skills" v-model="skills"></skills>
  <recipe id="recipe" label="Recipe" v-model="recipe"></recipe>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'
import Skills from '../Widget/Skills.vue'
import Recipe from '../Widget/Recipe.vue'

function object2list(Obj) {
  return Object.keys(Obj).map( K => { return { "key": K, "value": Obj[K] } } )
}

function list2object(List) {
  let Re = {}
  List.forEach(Obj => Re[Obj.key] = Obj.value)
  return Re
}

export default {
  name: 'admin-group',
  props: ['id'],
  data () {
    return {
      group: {},
      skills: [],
      recipe: []
    }
  },
  components: { 'form-text': FormText, 'skills': Skills, 'recipe': Recipe },
  methods: {
    query () {
      if (this.id) {
        this.$agent.get_group(this.id, Obj => { this.group = Obj; this.skills = object2list(Obj.skills) })
      }
    },
    onCommit () {
      this.group.skills = list2object(this.skills)
      this.$agent.update_group(this.group, () => this.$router.push('/admin/groups'))
    },
    onDelete () {
      if (this.id) {
        this.$agent.delete_group(this.id, () => this.$router.push('/admin/groups'))
      }
    },

  },
  created () {
    this.query()
  }
}
</script>