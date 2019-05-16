<template>
  <b-form-group
    v-if="this.$agent.can_call()"
    label="Voicemail"
  >
    <b-button-group
      class="vmplayer"
      size="sm"
    >
      <b-button
        v-if="isStop() || isPause()"
        variant="outline-dark"
        @click="play"
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
        @click="pause"
      >
        <icon
          name="pause"
          scale="1"
          class="align-middle"
        />
      </b-button>
      <b-button
        variant="outline-dark"
        @click="stop"
      >
        <icon
          name="stop"
          scale="1"
          class="align-middle"
        />
      </b-button>
      <span class="time">
        {{ toHHMMSS }} / {{ getHHMMSS(length/1000) }}
      </span>
      <b-form-input
        v-model.number="actualTime"
        class="slider"
        type="range"
        min="0"
        step="1"
        :max="length/1000"
        @change="onSeek()"
      />
    </b-button-group>
  </b-form-group>
</template>

<script>

export default {
  name: 'VmPlayer',
  props: {
    length: {
      type: Number,
      default: 0
    },
    uuid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      state: 'stop',
      updater: null,
      actualTime: 0,
      volume_on: true,
    }
  },
  computed: {
    toHHMMSS () {
      return this.getHHMMSS(this.actualTime)
    }
  },
  created () {
  },
  beforeDestroy () {
    if (this.isPlay()) {
      this.$agent.p_mfa('ws_agent', 'stop_vm', [this.uuid])
    }
    if (this.updater) {
      clearInterval(this.updater)
    }
  },
  methods: {
    onTimer () {
      if (this.isPlay()) {
        this.actualTime = this.actualTime + 0.5
        if (this.actualTime >= this.length/1000) {
          this.actualTime = 0
          this.state = "stop"
        }
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
      this.updater = setInterval(this.onTimer, 500)
      if (this.actualTime > 0) {
        if (this.isStop()) {
          this.$agent.p_mfa('ws_agent', 'play_vm', [this.uuid])
        } else {
          this.$agent.p_mfa('ws_agent', 'play_vm', [this.uuid, this.actualTime * 1000])
        }
      } else {
        this.$agent.p_mfa('ws_agent', 'play_vm', [this.uuid])
      }
      this.state = 'play'
    },
    stop () {
      if (this.updater) {
        clearInterval(this.updater)
      }
      if (this.isStop()) {
        this.$agent.p_mfa('ws_agent', 'stop_vm', [this.uuid])
      }
      this.state = 'stop'
      this.actualTime = 0
    },
    pause () {
      this.state = 'pause'
      this.$agent.p_mfa('ws_agent', 'pause_vm', [this.uuid])
    },
    onSeek () {
      if (this.isPlay()) {
        this.$agent.p_mfa('ws_agent', 'play_vm', [this.uuid, this.actualTime * 1000])
      } else {
        this.state = 'pause'
      }
    },
    isStop () { return this.state == 'stop' },
    isPause () { return this.state == 'pause' },
    isPlay () { return this.state == 'play' },
  }
}
</script>
