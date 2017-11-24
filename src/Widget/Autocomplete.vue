<template>
<span>
  <input type="text" class="reference form-control" v-model="text" @keydown="keydown" :placeholder="placeholder">
  <div class="popper dropdown-menu">
    <button class="dropdown-item" v-for="(opt, i) in options" :key="opt.id" :class="{active: isActive(i)}">{{opt.name}}</button>
  </div>
</span>
</template>

<script>
import $ from 'jquery'
import Popper from 'popper.js'

export default {
  props: {
    query: { type: Function, required: true },
    placeholder: { type: String }
  },
  data () {
    return {
      reference: undefined,
      popper: undefined,
      ref: undefined,
      index: 0,
      text: '',
      visible: false,
      options: []
    }
  },
  methods: {
    async_query: async function(text) {
      this.options = await this.query(text)
    },
    isActive (i) {
      return i == this.index
    },
    show() {
      if (this.options.length > 0) {
        this.visible = true
        this.popper.show()
      }
    },
    hide() {
      this.visible = false
      this.popper.hide()
    },
    keydown (ev) {
      if (!this.visible) {
        if (ev.key == 'ArrowDown') {
          this.async_query(this.text)
        }
        return
      }
      switch (ev.key) {
        case 'ArrowDown':
          ev.preventDefault()
          this.index = this.index + 1 >= this.options.length? 0 : this.index + 1
          break
        case 'ArrowUp':
          ev.preventDefault()
          this.index = this.index - 1 >= 0 ? this.index - 1 : this.options.length-1
          break
        case 'Enter':
          ev.preventDefault()
          this.hide()
          this.text = ''
          this.$emit('input', this.options[this.index])
          break
        case 'Escape':
          ev.preventDefault()
          this.hide()
          break
      }
    }
  },
  mounted () {
    this.reference = $('.reference', this.$el)
    this.popper = $('.popper', this.$el)
    this.ref = new Popper(this.reference, this.popper, { 'placement': 'bottom-start' })
  },
  watch: {
    options (value, old) {
      if (value.length !== old.length) {
        this.index = 0
      }
      this.ref.update()
      this.show()
      return value
    },
    text (value) {
      if (this.visible || value.length > 2) {
        this.async_query(value)
      }
      return value
    }
  }
}
</script>
