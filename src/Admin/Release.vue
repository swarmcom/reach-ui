<template>
<div class="form">
  <form-text id="name" label="Name" v-model="release.name"></form-text>
  <form-text id="score" label="Score" v-model="release.score"></form-text>
  <button @click="onCommit" class="btn btn-primary">Commit</button>
  <button @click="onDelete" class="btn btn-danger float-right">Delete</button>
</div>
</template>

<script>
import FormText from '../Widget/FormText.vue'

function object2list(Obj) {
  return Object.keys(Obj).map( K => { return { "key": K, "value": Obj[K] } } )
}

function list2object(List) {
  let Re = {}
  List.forEach(Obj => Re[Obj.key] = Obj.value)
  return Re
}

export default {
  name: 'admin-release',
  props: ['id'],
  data () {
    return {
      release: {}
    }
  },
  components: { 'form-text': FormText },
  methods: {
    query () {
      if (this.id) {
        this.$agent.get_release(this.id, Obj => this.release = Obj.reply)
      }
    },
    onCommit () {
      if (this.id) {
        this.$agent.update_release(this.id, this.release, () => this.$router.push('/admin/releases'))
      } else {
        this.$agent.create_release(this.release, () => this.$router.push('/admin/releases'))
      }
    },
    onDelete () {
      if (this.id) {
        this.$agent.delete_release(this.id, () => this.$router.push('/admin/releases'))
      }
    },
  },
  created () {
    this.query()
  }
}
</script>