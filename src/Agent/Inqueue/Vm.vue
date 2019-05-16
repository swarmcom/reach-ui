<template>
  <div
    v-if="visible"
    style="margin-top: 10px"
  >
    <b-row v-if="lua_result">
      <b-col v-html="lua_result" />
    </b-row>

    <b-row>
      <b-col cols="7">
        <b-row>
          <b-col cols="2">
            <icon
              class="call-phone-center"
              style="color:#838383"
              name="file-audio-o"
              scale="3"
            />
          </b-col>
          <b-col cols="5">
            <dl class="row agent-state-text">
              <dt class="col-sm-12 session-manager-text">
                {{ title }}:
              </dt>
              <dd class="col-sm-5">
                Queue:
              </dd>
              <dd class="col-sm-7">
                {{ inqueue.queue.name }}
              </dd>
              <dd
                v-if="!this.$agent.is_ringing()"
                class="col-sm-5"
              >
                Wait Time:
              </dd>
              <dd
                v-if="!this.$agent.is_ringing()"
                class="col-sm-7"
              >
                {{ msToHms(this.$agent.vm.wait_time) }}
              </dd>
            </dl>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="2">
            <div class="call-hand-center">
              <b-img
                v-if="inqueue.line_in.client.avatar"
                :src="$agent.get_rr_uri()+'/avatar/'+inqueue.line_in.client.avatar"
                style="width:64px;"
              />
              <icon
                v-else
                style="color:#838383"
                name="handshake-o"
                scale="3"
              />
            </div>
          </b-col>
          <b-col cols="5">
            <dl class="row agent-state-text">
              <dt class="col-sm-12 session-manager-text">
                {{ inqueue.line_in.client.name }}
              </dt>
              <dd class="col-sm-12">
                {{ inqueue.call_vars["Caller-ANI"] }}
              </dd>
            </dl>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="5">
        <dl class="row agent-state-text">
          <dt class="col-sm-12 session-manager-text">
            Skills:
          </dt>
          <dd class="col-sm-12">
            Requested skills:
          </dd>
          <dd class="col-sm-12">
            <b-row>
              <b-col
                cols="6"
                offset="1"
              >
                queue:
              </b-col>
              <b-row>
                <b-col
                  v-for="(v, k, index) in inqueue.queue.skills"
                  :key="index"
                  cols="12"
                >
                  {{ k }}
                </b-col>
              </b-row>
            </b-row>
            <b-row>
              <b-col
                cols="6"
                offset="1"
              >
                queue group:
              </b-col>
              <b-row>
                <b-col
                  v-for="(v, k, index) in inqueue.queue.group.skills"
                  :key="index"
                  cols="6"
                >
                  {{ k }}
                </b-col>
              </b-row>
            </b-row>
            <b-row>
              <b-col
                cols="6"
                offset="1"
              >
                line:
              </b-col>
              <b-row>
                <b-col
                  v-for="(v, k, index) in inqueue.line_in.skills"
                  :key="index"
                  cols="6"
                >
                  {{ k }}
                </b-col>
              </b-row>
            </b-row>
            <b-row>
              <b-col
                cols="6"
                offset="1"
              >
                client:
              </b-col>
              <b-row>
                <b-col
                  v-for="(v, k, index) in inqueue.line_in.client.skills"
                  :key="index"
                  cols="12"
                >
                  {{ k }}
                </b-col>
              </b-row>
            </b-row>
          </dd>
          <dd class="col-sm-6">
            Matched Skills:
          </dd>
          <dd class="col-sm-6">
            <b-row>
              <b-col
                v-for="(v, k, index) in inqueue.skills"
                :key="index"
                cols="12"
              >
                {{ k }}
              </b-col>
            </b-row>
          </dd>
        </dl>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <player
          v-if="$agent.is_oncall() && inqueue.vm_length > 0"
          :length="inqueue.vm_length"
          :uuid="uuid"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <dialer
          v-if="dialer_visible"
          :originalCaller="originalCaller"
          :lines="lines"
          @dialer_input="onDialerInput"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import VmPlayer from '@/Agent/Inqueue/VmPlayer'
import Dialer from '@/Agent/Inqueue/VmCallbackDialer'
export default {
  components: {
    dialer: Dialer,
    player: VmPlayer
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
      visible: false,
      title: 'Incoming Voicemail',
      inqueue: {},
      dialer_visible: false,
      call_info: {},
      lua_result: false,
      updater: undefined,
      notification: undefined,
      lines: []
    }
  },
  computed: {
    originalCaller: function () {
      return this.inqueue.call_vars["Caller-ANI"] + '@' + this.inqueue.call_vars["sip_from_host"]
    }
  },
  watch: {
    'inqueue.state' (New, Old) {
      if (New == 'oncall' && this.notification) {
        this.notification.close()
      }
    }
  },
  created () {
    this.$bus.$on('agent_state', this.handleState)
    this.$bus.$on('inqueue_lua', this.preHandleInqueueLua)
    this.query()
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    if (this.notification) {
      this.notification.close()
    }
    this.$bus.$off('agent_state', this.handleState)
    this.$bus.$off('inqueue_lua', this.preHandleInqueueLua)
    clearInterval(this.updater)
  },
  methods: {
    query: async function () {
      this.lines = await this.$agent.p_mfa('ws_agent', 'lines_out')
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_vm', this.uuid])
      this.call_info = await this.$agent.p_mfa('ws_agent', 'call_info', [this.uuid])
      let lua_re = await this.$agent.p_mfa('ws_agent', 'lua_result', [this.uuid, 'agent_urlpop'])
      this.handleInqueueLua(lua_re)
      this.visible = true
      this.show_notification()
    },
    queryCall: async function () {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_vm', this.uuid])
    },
    queryCallInfo: async function () {
      this.call_info = await this.$agent.p_mfa('ws_agent', 'call_info', [this.uuid])
    },
    onTimer () {
      if (this.inqueue.time) {
        this.inqueue.time += 1000
      }
    },
    onDialerInput () {
      this.visible = false
    },
    onVMPlay () {
      this.$agent.p_mfa('ws_agent', 'play_vm', [this.uuid])
    },
    onVMPlayOff () {
      this.$agent.p_mfa('ws_agent', 'play_vm', [this.uuid, 3000])
    },
    onVMStop () {
      this.$agent.p_mfa('ws_agent', 'stop_vm', [this.uuid])
    },
    onVMPause () {
      this.$agent.p_mfa('ws_agent', 'pause_vm', [this.uuid])
    },
    update_skills () {
      this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid, this.list2skills(this.skills)])
    },
    preHandleInqueueLua (Re) {
      this.handleInqueueLua(Re.value)
    },
    handleInqueueLua (LuaRe) {
      if (LuaRe && typeof LuaRe == 'object') {
        let [Type, Value] = LuaRe
        if (Type == "embed") {
          this.lua_result = Value
        } else if (Type == "window") {
          window.open(Value, "Reach")
        }
      }
    },
    show_notification () {
      if (!("Notification" in window)) {
        return
      } else if (Notification.permission === "granted" && this.inqueue.line_in) {
        //let body = `Number: ${this.call_info['Caller-Destination-Number']}\nClient: ${this.inqueue.line_in.client.name}\nQueue: ${this.inqueue.queue.name}`
        //this.notification = new Notification("Incoming call", { body: body })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    },
    handleState ({ state }) {
      this.inqueue.state = state.state
      if (state.state === 'conference') {
        this.queryCall()
      }
      else if (state.state === 'wrapup') {
        this.title = 'Voicemail Processing'
        this.queryCallInfo()
        this.dialer_visible = true
      }
    }
  }
}
</script>
