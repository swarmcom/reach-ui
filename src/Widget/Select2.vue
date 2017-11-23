<template>
<select>
  <slot></slot>
</select>
</template>

<script>
import 'select2/dist/css/select2.css'
import 'select2-bootstrap-theme/dist/select2-bootstrap.css'
import Select2 from 'select2/dist/js/select2.full.js'
import $ from 'jquery'

export default {
  name: 'select2',
  props: ['options', 'value'],
  data () {
    return {
      params: {
        placeholder: 'Please select',
        allowClear: true,
        theme: 'bootstrap',
        multiple: true,
        width: '100%'
      }
    }
  },
  methods: {
    get_params (options) {
      let params = this.params
      params.data = options
      return params
    }
  },
  mounted () {
    var vm = this
    $(this.$el)
      // init select2
      .select2(this.get_params(this.options))
      .val(vm.value).trigger('change')
      .on('select2:select', (e) => {
        this.value.push(e.params.data.id)
        vm.$emit('input', this.value)
      })
      .on('select2:unselect', (e) => {
        const index = this.value.indexOf(e.params.data.id)
        this.value.splice(index, 1)
        vm.$emit('input', this.value)
      })
  },
  watch: {
    value (value) {
      $(this.$el).val(value).trigger('change')
      return value
    },
    options (options) {
      $(this.$el).empty()
        .select2(this.get_params(options))
        .val(this.value).trigger('change')
    }
  },
  destroyed () {
    $(this.$el).off().select2('destroy')
  }
}
</script>
