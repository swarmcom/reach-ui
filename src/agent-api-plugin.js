import Agent from '@/agent.js'
import {EventBus} from '@/event-bus.js'

export default {
  install: function(Vue) {
    if (!Vue.prototype.$agent) {
      Vue.prototype.$agent = new Agent()
    }
    if (!Vue.prototype.$bus) {
      Vue.prototype.$bus = EventBus
    }
  }
}
