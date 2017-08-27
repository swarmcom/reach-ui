<template>
<div class="form">
  <form-text id="name" label="Name" v-model="queue.name"></form-text>
  <form-select id="group" label="Group" v-model="queue.group"></form-select>
  <form-text id="hold_music" label="Music on hold" v-model="queue.hold_music"></form-text>
  <form-text id="aging_factor" label="Aging" v-model="queue.aging_factor"></form-text>
  <form-text id="weight" label="Weight" v-model="queue.weight"></form-text>
  <form-text id="auto_wrapup" label="Auto Wrap-up" v-model="queue.auto_wrapup"></form-text>
  <form-text id="wrapup_enabled" label="Wrap-up enabled" v-model="queue.wrapup_enabled"></form-text>
  <form-text id="wrapup_timer" label="Wrap-up timer" v-model="queue.wrapup_timer"></form-text>
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
import Groups from '../Widget/Groups.vue'

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
      queue: {},
      skills: [],
      recipe: []
    }
  },
  components: { 'form-select': Groups, 'form-text': FormText, 'skills': Skills, 'recipe': Recipe },
  methods: {
    query () {
      if (this.id) {
        this.$agent.get_queue(this.id, Obj => { this.queue = Obj; this.skills = object2list(Obj.skills) })
      }
    },
    onCommit () {
      this.queue.skills = list2object(this.skills)
      this.$agent.update_queue(this.queue, () => this.$router.push('/admin/queues'))
    },
    onDelete () {
      if (this.id) {
        this.$agent.delete_queue(this.id, () => this.$router.push('/admin/queues'))
      }
    },

  },
  created () {
    this.query()
  }
}
</script>