<template>
  <div style="margin: 0; padding-bottom: 20px">
    <div>Time Range:</div>
    <datetime v-model="from_to" :first-day-of-week="1" style="min-width:300px; width:100%;" range @confirm="onConfirm" type="datetime" input-class="mx-input-custom" format="yyyy-MM-DD HH:mm:ss" lang="en" confirm width="100%" :shortcuts="false"></datetime>
  </div>
</template>

<script>
import Datetime from 'vue2-datepicker'

export default {
  name: 'from-to-input',
  props: ['value'],
  components: {
    'datetime': Datetime
  },
  data () {
    return {
      from_to: Object.values(this.value)
    }
  },
  methods: {
    onConfirm (v) {
      this.$emit('input', { date_start: this.from_to[0], date_end: this.from_to[1]})
    }
  },
  watch: {
    value (v) {
      this.from_to = Object.values(v)
      return v
    }
  }
}
</script>

<style lang="scss">
.mx-input-custom {
  display: inline-block;
  width: 100%;
  height: 31px;
  padding: 6px 7px 6px 7px;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  &:disabled,
  &.disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
  border-radius: 0.2rem;
  box-shadow: none;
}

.mx-input-icon__calendar {
  display: none;
}

.mx-input-icon {
  display: none;
}
</style>
