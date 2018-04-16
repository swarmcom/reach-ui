<template>
  <div style="margin: 0; padding-bottom: 20px">
    <div>Time:</div>
    <datetime v-model="ts" :first-day-of-week="1" style="min-width:140px" @confirm="onConfirm" type="datetime" input-class="mx-input-custom" format="yyyy-MM-DD HH:mm:ss" lang="en" confirm width="100%"></datetime>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import Datetime from 'vue2-datepicker'
import Moment from 'moment'

export default {
  name: 'ts-input',
  props: ['value'],
  components: {
    'datepicker': Datepicker,
    'datetime': Datetime
  },
  data () {
    return {
      ts: this.value
    }
  },
  methods: {
    onConfirm (v) {
      this.$emit('input', this.ts)
    },
    onChange (v) {
      this.ts = Moment(v).format()
      this.$emit('input', this.ts)
    }
  },
  watch: {
    value (v) {
      this.ts = v
      return v
    }
  }
}
</script>

<style lang="scss">
.mx-input-custom {
  display: inline-block;
  width: 100%;
  height: 38px;
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
