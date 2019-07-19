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
    this.reference = document.getElementById(this.target)
    if (this.reference){
      this.reference.addEventListener("click", this.onclick)
      this.reference.style.cursor = "help"
    }
  },
  beforeDestroy () {
    if (this.reference) {
      this.reference.removeEventListener("click")
    }
  },
  methods: {
    show (ev) {
      document.body.click()
      if(! this.visible) {
        this.visible = true
        ev.stopPropagation()
        this.ref = new Popper(this.reference, this.$el, { 'placement': 'bottom-start' })
        this.$el.style.display = "block"
        window.addEventListener('click', this.hide)
      }
    },
    hide () {
      if (this.visible) {
        this.visible = false
        this.$el.style.display = "none"
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
