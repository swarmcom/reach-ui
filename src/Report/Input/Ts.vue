<template>
  <div style="margin: 0; padding-bottom: 20px">
    <div>Time:</div>
    <datepicker :value="ts" @input="onChange" placeholder="Time" :highlighted="highlighted" bootstrapStyling style="padding-bottom: 10px">
    </datepicker>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import Moment from 'moment'

export default {
  name: 'ts-input',
  props: ['value'],
  components: {
    'datepicker': Datepicker
  },
  data () {
    return {
      ts: this.value,
      highlighted: {
        dates: [new Date()]
      }
    }
  },
  methods: {
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
