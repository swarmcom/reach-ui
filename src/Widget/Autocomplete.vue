<template>
<span>
  <div class="input-group">
    <input id="autocomplete" type="text" class="reference form-control" v-model="text" @keydown="keydown" :placeholder="placeholder">
    <span class="input-group-btn">
      <button class="btn btn-secondary" type="button" @click="display">
        <icon class="align-middle" name="caret-down" scale="1"></icon>
      </button>
    </span>
  </div>
  <div class="popper dropdown-menu">
    <button class="dropdown-item"
      v-for="(opt, i) in options" :key="i" @click="ev => select(i, ev)" :class="{active: isActive(i)}">{{ to_name(opt) }}</button>
  </div>
</span>
</template>

<script>
import $ from 'jquery'
import Popper from 'popper.js'

export default {
  props: {
    query: { type: Function, required: true },
    to_name: { type: Function, default: ob => ob.name },
    new: { type: Boolean, default: false },
    placeholder: { type: String },
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
        this.ref = new Popper(this.reference, this.popper, { 'placement': 'bottom-start' })
        this.visible = true
        this.popper.show()
      }
      else {
        this.hide()
      }
    },
    hide() {
      if (this.visible) {
        this.visible = false
        this.popper.hide()
        this.ref.destroy()
      }
    },
    select(i, ev) {
      ev.preventDefault()
      this.hide()
      this.text = ''
      this.$emit('input', this.options[i])
    },
    display () {
      if (!this.visible) {
        $("#autocomplete", this.$el).focus()
        this.async_query(this.text)
      }
    },
    keydown (ev) {
      if (!this.visible) {
        if (ev.key == 'ArrowDown') {
          this.async_query(this.text)
        }
        if (this.new && ev.key == 'Enter') {
          this.$emit('input', this.text)
          this.text = ''
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
    },
    clickListener (e) {
      if (! this.$el.contains(e.target)) { // outside
        if (this.visible) {
          this.hide()
        }
      }
    }
  },
  mounted () {
    this.reference = $('.reference', this.$el)
    this.popper = $('.popper', this.$el)
    window.addEventListener('click', this.clickListener)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.clickListener)
  },
  watch: {
    options (value, old) {
      if (value.length !== old.length) {
        this.index = 0
      }
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

<style scoped>
input:focus {
  box-shadow: none;
}
button:focus {
  outline: none;
  box-shadow: none;
}
</style>
