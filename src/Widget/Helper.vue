<template>
<div class="help popover" style="display: none">
  <div class="popover-body">
    <slot></slot>
  </div>
</div>
</template>

<script>
import $ from 'jquery'
import Popper from 'popper.js'

export default {
  props: ['target'],
  data () {
    return {
      visible: false,
      ref: undefined,
      help: undefined,
      reference: undefined
    }
  },
  methods: {
    show(ev) {
      if(! this.visible) {
        this.visible = true
        ev.stopPropagation()
        this.ref = new Popper(this.reference, this.$el, { 'placement': 'bottom-start' })
        $(this.$el).show()
        window.addEventListener('click', this.hide)
      }
    },
    hide() {
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
  },
  mounted () {
    this.reference = $(`:contains('${this.target}')`).last()
    this.reference.on('click', ev => this.onclick(ev) )
    this.reference.css('cursor', 'help')
  },
  beforeDestroy () {
    this.reference.off('click')
  }
}
</script>

<style scoped>
</style>
