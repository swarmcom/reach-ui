<template>
  <b-row
    class="player"
    align-h="center"
  >
    <b-button-group size="sm">
      <b-button
        v-if="isStop() || isPause()"
        variant="outline-dark"
        @click.stop="play"
      >
        <icon
          name="play"
          scale="1"
          class="align-middle"
        />
      </b-button>
      <b-button
        v-if="isPlay()"
        variant="outline-dark"
        @click.stop="pause"
      >
        <icon
          name="pause"
          scale="1"
          class="align-middle"
        />
      </b-button>
      <b-button
        variant="outline-dark"
        @click.stop="stop"
      >
        <icon
          name="stop"
          scale="1"
          class="align-middle"
        />
      </b-button>
      <span class="time">
        {{ toHHMMSS }} / {{ getHHMMSS(player.duration()) }}
      </span>
      <b-form-input
        v-model.number="actualTime"
        class="slider"
        type="range"
        min="0"
        step="1"
        :max="player.duration()"
        @change="onSeek()"
      />
      <b-button
        variant="outline-dark"
        @click="volume(!volume_on)"
      >
        <icon
          v-if="volume_on"
          style="width: 15px"
          name="volume-up"
          scale="1"
          class="align-middle"
        />
        <icon
          v-else
          style="width: 15px"
          name="volume-down"
          scale="1"
          class="align-middle"
        />
      </b-button>
      <b-button
        v-if="!isError()"
        variant="outline-dark"
        target="_blank"
        download
        :href="$agent.get_rr_uri() + href"
      >
        <icon
          name="download"
          scale="1"
          class="align-middle"
        />
      </b-button>
    </b-button-group>
    <span v-if="isError()"> Failed to load record. </span>
  </b-row>
</template>

<script>
import { Howl } from 'howler'

export default {
  name: 'StatsPlayer',
  props: {
    href: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      player: null,
      state: 'stop',
      updater: null,
      actualTime: 0,
      actualVolume: '1.0',
      volume_on: true
    }
  },
  computed: {
    toHHMMSS () {
      return this.getHHMMSS(this.actualTime)
    }
  },
  created () {
    let ref = this.$agent.get_rr_uri() + this.href
    this.player = new Howl({
      src: [ ref ],
      onplay: () => this.state = 'play',
      onpause: () => this.state = 'pause',
      onend: () => { this.state = 'stop'; this.actualTime = 0 },
      onstop: () => { this.state = 'stop'; this.actualTime = 0 },
      onloaderror: () => this.state = 'error',
    })
  },
  beforeDestroy () {
    this.player.stop()
  },
  methods: {
    onTimer () {
      if (this.isPlay()) {
        this.actualTime = this.player.seek()
      }
    },
    getHHMMSS (value) {
      let sec = Math.round(value)
      let hours = Math.floor(sec / 3600)
      let minutes = Math.floor((sec - (hours * 3600)) / 60)
      let seconds = sec - (hours * 3600) - (minutes * 60)

      if (hours < 10) { hours = '0' + hours }
      if (minutes < 10) { minutes = '0' + minutes }
      if (seconds < 10) { seconds = '0' + seconds }
      hours === '00' ? hours = '' : hours = hours + ':'
      return hours + minutes + ':' + seconds
    },
    play () {
      if (this.updater) {
        clearInterval(this.updater)
      }
      this.updater = setInterval(this.onTimer, 300)
      this.player.play()
    },
    stop () {
      if (this.updater) {
        clearInterval(this.updater)
      }
      this.player.stop()
    },
    pause () {
      this.player.pause()
    },
    onSeek () {
      this.player.seek(this.actualTime)
    },
    volume (status) {
      this.volume_on = status
      status ? this.player.volume(this.actualVolume) : this.player.volume(0.0)
    },
    isStop () { return this.state == 'stop' },
    isPause () { return this.state == 'pause' },
    isPlay () { return this.state == 'play' },
    isError () { return this.state == 'error' },
  }
}
</script>

