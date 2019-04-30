<template>
  <div
    v-if="visible"
    style="margin-top: 20px"
  >
    <div class="row">
      <div class="col">
        <h2>Spy call info:</h2>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <dl class="row">
          <dt class="col-sm-3">
            From:
          </dt>
          <dd class="col-sm-9">
            "{{ call_info['Caller-Caller-ID-Name'] }}" &lt;{{ call_info['Caller-Caller-ID-Number'] }}&gt;
          </dd>
          <dt class="col-sm-3">
            To:
          </dt>
          <dd class="col-sm-9">
            {{ call_info['Caller-Destination-Number'] }}
          </dd>
          <dt class="col-sm-3">
            State:
          </dt>
          <dd class="col-sm-9">
            {{ inqueue.state }}
          </dd>
          <dt class="col-sm-3">
            Queue:
          </dt>
          <dd class="col-sm-9">
            {{ inqueue.queue.name }}
          </dd>
          <dt class="col-sm-3">
            Weight:
          </dt>
          <dd class="col-sm-9">
            {{ inqueue.effective_time.weight }}
          </dd>
          <dt class="col-sm-3">
            Time:
          </dt>
          <dd class="col-sm-9">
            {{ Math.round(inqueue.time/1000) }}
          </dd>
          <dt class="col-sm-3">
            Transferers:
          </dt>
          <dd class="col-sm-9">
            {{ inqueue.transferers.map( (agent) => agent.name ).join(", ") }}
          </dd>
        </dl>
      </div>
      <div class="col">
        <skills
          v-model="skills"
          label="Skills"
        />
      </div>
    </div>

    <div
      v-if="this.$agent.is_barge()"
      class="row"
      style="margin-top: 20px"
    >
      <div class="col-2">
        <b-dropdown
          text="Mode"
          variant="outline-primary"
        >
          <b-dropdown-item
            v-for="mode in modes"
            :key="mode"
            @click="set_mode(mode)"
          >
            {{ mode }}
          </b-dropdown-item>
        </b-dropdown>
      </div>

      <div class="col-2">
        <button
          class="btn btn-outline-danger pointer"
          @click="hangup()"
        >
          Hangup
        </button>
      </div>
      <div class="col-2">
        <button
          class="btn btn-outline-warning pointer"
          @click="takeover()"
        >
          Takeover
        </button>
      </div>
      <div class="col-2">
        <button
          class="btn btn-outline-primary pointer"
          @click="cancel()"
        >
          Cancel Spy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import Skills from '@/Agent/Widget/Skills'

export default {
  components: {
    'skills': Skills
  },
  mixins: [Common],
  props: {
    uuid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      modes: ['spy', 'barge', 'agent', 'caller'],
      inqueue: {},
      call_info: {},
      skills: [],
      updater: undefined,
      visible: false,
    }
  },
  created () {
    this.query()
    this.updater = setInterval(this.onTimer, 1000)
    this.$bus.$on('agent_state', this.handleState)
  },
  beforeDestroy () {
    clearInterval(this.updater)
    this.$bus.$off('agent_state', this.handleState)
  },
  methods: {
    query: async function () {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', this.uuid])
      this.call_info = await this.$agent.p_mfa('ws_agent', 'call_info', [this.uuid])
      let skills = await this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid])
      this.skills = this.object2list(skills)
      this.visible = true
    },
    onTimer() {
      if (this.inqueue.time) {
        this.inqueue.time += 1000
      }
    },
    cancel () {
      this.$agent.mfa('ws_supervisor', 'cancel', [])
    },
    hangup () {
      this.$agent.mfa('ws_supervisor', 'hangup', ['inqueue_call', this.uuid])
    },
    takeover () {
      this.$agent.mfa('ws_supervisor', 'takeover', ['inqueue_call', this.uuid])
    },
    handleState ({ state }) {
      if (state.state !== 'barge') {
        this.visible = false
        this.spy = {}
      }
    },
    set_mode (mode) {
      this.$agent.mfa('ws_supervisor', 'set_barge_mode', [mode])
    }
  },
}
</script>
