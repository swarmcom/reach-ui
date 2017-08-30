<template>
<div>
<div class="row">
  <div class="col"><h3>Inqueue requests</h3></div>
</div>
<div class="row" v-for="inqueue in inqueues">
  <div class="col">{{ inqueue.state }}</div>
  <div class="col">{{ inqueue.record }}</div>
  <div class="col">{{ inqueue.queue }}</div>
  <div class="col">{{ Math.round(inqueue.time/1000) }}s</div>
  <div class="col">{{ inqueue.effective_time.weight }}-{{ Math.round(inqueue.effective_time.time/1000) }}s</div>
</div>
</div>
</template>

<script>
export default {
  name: 'inqueues',
  data () {
    return {
      inqueues: []
    }
  },
  methods: {
    handleState ({info}) {
      let i = this.inqueues.findIndex(E => E.uuid === info.uuid)
      if (i >= 0) {
        if (info.state === 'terminate') {
          this.inqueues.splice(i, 1)
        } else {
          this.inqueues.splice(i, 1, info)
        }
      } else {
        this.inqueues.push(info)
      }
    },
    query () {
      this.$agent.inqueues(Obj => this.inqueues = Obj.reply)
    },
    onTimer() {
      this.inqueues.forEach((E, i, Arr) => { 
        E.time = E.time + 1000
        E.effective_time.time = E.effective_time.time + 1000
        Arr.splice(i, 1, E)
      })
      setTimeout( this.onTimer, 1000 )
    }
  },
  mounted () {
    this.onTimer()
  },
  created () {
    this.$agent.subscribe('inqueues')
    this.query()
    this.$bus.$on('inqueue_state', (S) => this.handleState(S))
  }
}
</script>