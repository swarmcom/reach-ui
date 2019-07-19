<template>
  <span>
    <div class="input-group">
      <input
        ref="reference"
        v-model="text"
        type="text"
        class="form-control"
        :placeholder="placeholder"
        @keydown="keydown"
      >
      <span class="input-group-btn">
        <button
          class="btn btn-secondary"
          type="button"
          @click="display"
        >
          <icon
            class="align-middle"
            name="caret-down"
            scale="1"
          />
        </button>
      </span>
    </div>
    <div
      ref="popper"
      class="dropdown-menu"
    >
      <button
        v-for="(opt, i) in options"
        :key="i"
        class="dropdown-item"
        :class="{active: isActive(i)}"
        @click="ev => select(i, ev)"
      >{{ toName(opt) }}</button>
    </div>
  </span>
</template>

<script>
import Popper from 'popper.js'

export default {
  props: {
    query: {
      type: Function,
      required: true
    },
    toName: {
      type: Function,
      default: ob => ob.name
    },
    new: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "" 
    },
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
  },
  mounted () {
    this.reference = this.$refs.reference
    this.popper = this.$refs.popper
    window.addEventListener('click', this.clickListener)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.clickListener)
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
        this.popper.style.display = "block"
      }
      else {
        this.hide()
      }
    },
    hide() {
      if (this.visible) {
        this.visible = false
        this.popper.style.display = "none"
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
        this.$refs.reference.focus()
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
