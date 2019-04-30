<template>
  <div
    class="help popover"
    style="display: none"
  >
    <div class="popover-body">
      <slot />
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Popper from 'popper.js'

export default {
  props: {
    target: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      visible: false,
      ref: undefined,
      help: undefined,
      reference: undefined
    }
  },
  mounted () {
    this.reference = $(document.getElementById(this.target))
    this.reference.on('click', ev => this.onclick(ev) )
    this.reference.css('cursor', 'help')
  },
  beforeDestroy () {
    this.reference.off('click')
  },
  methods: {
    show (ev) {
      $('body').click()
      if(! this.visible) {
        this.visible = true
        ev.stopPropagation()
        this.ref = new Popper(this.reference, this.$el, { 'placement': 'bottom-start' })
        $(this.$el).show()
        window.addEventListener('click', this.hide)
      }
    },
    hide () {
      if (this.visible) {
        this.visible = false
        $(this.$el).hide()
        this.ref.destroy()
        window.removeEventListener('click', this.hide)
      }
    },
    onclick (ev) {
      this.show(ev)
    }
  }
}
</script>

<style scoped>
</style>
