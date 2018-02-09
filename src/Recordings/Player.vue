<template>
  <div>
    <div class="row">
      <div v-if="!isError()" class="col-1 pointer" @click.stop="play">
        <icon name="play" scale="1" class="align-middle"></icon>
      </div>
      <div v-if="!isError()" class="col-1 pointer" @click.pause="pause" style="margin-right:5px">
        <icon name="pause" scale="1" class="align-middle"></icon>
      </div>
      <div v-if="!isError()" class="col-1 pointer" @click.stop="stop">
        <icon name="stop" scale="1" class="align-middle"></icon>
      </div>
      <div v-if="isError()" class="col-1 pointer">
        <icon name="exclamation-circle" scale="1" class="align-middle"></icon>
      </div>
      <div v-if="!isError()" class="col-8 agent-state-text">
        <div class="row col-12">
          <b>status:</b>{{'&nbsp'+state}}
        </div>
        <div class="row col-12">
          <b>duration: </b>{{'&nbsp'+msToHms(Math.round(1000*player.duration()).toString())}}
        </div>
        <div class="row col-12">
          <b>playing time:</b>{{'&nbsp'+msToHms(Math.round(1000*value).toString())}}
        </div>
      </div>
      <vue-slider @drag-end="onDrag" style="margin-left:5px; margin-top:5px" class="col-12" v-model="value"
                  v-bind="optionsSlider"></vue-slider>
    </div>
  </div>
</template>

<script>
  import {Howl} from 'howler'
  import vueSlider from 'vue-slider-component'
  import Common from '@/Admin/Common'

  export default {
    name: 'recordings-player',
    props: ['href'],
    mixins: [Common],
    data() {
      return {
        player: null,
        state: 'stop',
        updater: '',
        duration: '',
        value: 0,
        optionsSlider: {
          width: "auto",
          height: 6,
          direction: "horizontal",
          dotSize: 16,
          eventType: "auto",
          min: 0,
          max: 0,
          interval: 1,
          disabled: false,
          show: true,
          realTime: false,
          tooltip: "hover",
          clickable: false,
          tooltipDir: "right",
          piecewise: false,
          lazy: false,
          reverse: false,
          speed: 0.5,
          formatter: (value) => this.msToHms(1000 * value)
        }
      }
    },
    methods: {
      play() {
        if (!this.isPlay()) {
          this.duration = Math.round(this.player.duration());
          this.player.play()
          this.updater = setInterval(this.onTimer, 1000)
        }
      },
      stop() {
        this.player.stop()
        clearInterval(this.updater)
        this.value = 0
      },
      pause() {
        this.player.pause()
        clearInterval(this.updater)
      },
      onTimer() {
        this.value++;
      },
      onDrag() {
        this.player.seek(this.value);
        if (this.player.playing()) {
          clearInterval(this.updater)
          this.updater = setInterval(this.onTimer, 1000)
        }
      },
      isStop() {
        clearInterval(this.updater)
        return this.state == 'stop'
      },
      isPlay() {
        return this.state == 'play'
      },
      isPause() {
        return this.state == 'pause'
      },
      isError() {
        return this.state == 'error'
      },
    },
    created() {
      let ref = this.$agent.get_rr_uri() + this.href
      this.player = new Howl({
        src: [ref],
        onplay: () => this.state = 'play',
        onend: () => {
          clearInterval(this.updater)
          this.value = 0
          this.state = 'stop'
        },
        onpause: () => this.state = 'pause',
        onstop: () => this.state = 'stop',
        onloaderror: () => this.state = 'error',
        onload: () => this.optionsSlider.max = this.player.duration(),
      })
    },
    beforeDestroy() {
      this.stop()
    },
    components: {
      'vue-slider': vueSlider
    },
  }
</script>