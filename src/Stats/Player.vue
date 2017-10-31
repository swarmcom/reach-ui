<template>
<div>
  <div v-if="isStop()" @click.stop="play">
    <icon name="play" scale="1" class="align-middle"></icon>
  </div>
  <div v-if="isPlay()" @click.stop="stop">
    <icon name="stop" scale="1" class="align-middle"></icon>
  </div>
  <div v-if="isError()">
    <icon name="exclamation-circle" scale="1" class="align-middle"></icon>
  </div>
</div>
</template>

<script>
import { Howl } from 'howler'

export default {
  name: 'stats-player',
  props: ['href'],
  data () {
    return {
      player: null,
      state: 'stop'
    }
  },
  methods: {
    play () {
      this.player.play()
    },
    stop () {
      console.log("stop")
      this.player.stop()
    },
    isStop () { return this.state == 'stop' },
    isPlay () { return this.state == 'play' },
    isError () { return this.state == 'error' },
  },
  created () {
    let ref = this.$agent.get_rr_uri() + this.href
    console.log("ref", ref)
    this.player = new Howl({
      src: [ ref ],
      onplay: () => this.state = 'play',
      onend: () => this.state = 'stop',
      onstop: () => this.state = 'stop',
      onloaderror: () => this.state = 'error',
    })
  }
}
</script>

