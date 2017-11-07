<template>
<div class="row">
  <div v-if="!isError()" class="col-1" @click.stop="play">
    <icon name="play" scale="1" class="align-middle"></icon>
  </div>
    <div v-if="!isError()" class="col-1" @click.pause="pause" style="margin-right:5px">
      <icon name="pause" scale="1" class="align-middle"></icon>
    </div>
    <div v-if="!isError()" class="col-1" @click.stop="stop">
      <icon name="stop" scale="1" class="align-middle"></icon>
    </div>
  <div v-if="isError()" class="col-1">
    <icon name="exclamation-circle" scale="1" class="align-middle"></icon>
  </div>
  <div class="col-1">
    {{state}}
  </div>
</div>
</template>

<script>
import { Howl } from 'howler'

export default {
  name: 'recordings-player',
  props: ['href'],
  data () {
    return {
      player: null,
      state: 'stop'
    }
  },
  methods: {
    play () {
      console.log("play")
      this.player.play()
    },
    stop () {
      console.log("stop")
      this.player.stop()
    },
    pause () {
      console.log("pause")
      this.player.pause()
    },
    isStop () { return this.state == 'stop' },
    isPlay () { return this.state == 'play' },
    isPause () { return this.state == 'pause' },
    isError () { return this.state == 'error' },
  },
  created () {
    let ref = this.$agent.get_rr_uri() + this.href
    console.log("ref", ref)
    this.player = new Howl({
      src: [ ref ],
      onplay: () => this.state = 'play',
      onend: () => this.state = 'stop',
      onpause: () => this.state = 'pause',
      onstop: () => this.state = 'stop',
      onloaderror: () => this.state = 'error',
    })
  }
}
</script>