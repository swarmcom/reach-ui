<template>
  <b-form-group
    v-if="can_call()"
    label="Place a call to:"
  >
    <b-input-group>
      <b-form-input
        v-model="number"
        type="text"
        list="dialer-number-list-id"
        placeholder="enter a number..."
        @change="updateCacheNumber()"
      />
      <datalist id="dialer-number-list-id">
        <option
          v-for="num in cachedNumber"
          :key="num"
        >
          {{ num }}
        </option>
      </datalist>
      <b-input-group-append>
        <b-dropdown
          v-if="lines.length > 0"
          text="Call as"
          variant="outline-secondary"
          right
        >
          <b-dropdown-item
            v-for="line of lines"
            :key="line.id"
            @click="call(line)"
          >
            {{ line.name }}
          </b-dropdown-item>
        </b-dropdown>
        <b-btn
          v-if="$agent.vm.agent.line_id"
          variant="outline-secondary"
          @click="call($agent.vm.agent.line)"
        >
          {{ $agent.vm.agent.line.name }}
        </b-btn>
      </b-input-group-append>
    </b-input-group>
  </b-form-group>
</template>

<script>
import Storage from '@/Storage'

export default {
  name: 'Dialer',
  mixins: [Storage],
  props: {
    originalCaller: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      number: this.original_caller,
      line_out: {},
      lines: [],
      cachedNumber: []
    }
  },
  watch: {
    original_caller: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.number = newVal
      }
    },
  },
  created () {
    this.query()
    this.maybeInitLocal().loadLocal('cachedNumber')
  },
  methods: {
    query: async function () {
      this.lines = await this.$agent.p_mfa('ws_agent', 'lines_out')
    },
    call (line) {
      this.$agent.place_call(line.id, this.number)
    },
    can_call () {
      return this.$agent.can_call() && (this.lines.length > 0 || this.$agent.vm.agent.line_id) 
    },
    updateCacheNumber () {
      let found = this.cachedNumber.find((element) => element === this.number)
      if (!found) {
        this.cachedNumber.push(this.number)
        this.saveLocal('cachedNumber').writeLocal()
      }
    }
  }
}
</script>
