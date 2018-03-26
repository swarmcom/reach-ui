<script>
import moment from 'moment'

export default {
  methods: {
    isNarrow () {
      return this.$agent.vm.isNarrowLayout[this.page]
    },
    isMain () {
      return this.page == 'main'
    },
    changeLayout () {
      this.$agent.vm.isNarrowLayout[this.page] = ! this.$agent.vm.isNarrowLayout[this.page]
    },
    canMyStat() {
      return this.$agent.permAllowed('widget-my-statistics')
    },
    canAgentManager() {
      return this.$agent.permAllowed('widget-agent-manager')
    },
    canQueueManager() {
      return this.$agent.permAllowed('widget-queue-manager')
    },
    isMyStat () {
      return this.$agent.vm.layoutSM.isActiveMS
    },
    isAgentManager () {
      return this.$agent.vm.layoutSM.isActiveAM
    },
    isQueueManager () {
      return this.$agent.vm.layoutSM.isActiveQM
    },
    changeWidget (name) {
      let state = ! this.$agent.vm.layoutSM[name]
      this.$agent.vm.layoutSM[name] = state
      this.$agent.vm.storage_data[name] = state
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      console.log(name, state)
    },
  },
  created () {
    this.date = new Date()
    setInterval(() => this.date = new Date, 1000)
  },
  filters: {
    filterDate: function (date) {
      return moment(date).format('ddd[,] Do MMM YYYY[,] HH:mm:ss');
    }
  },
  watch:{
    $route (to, from) {
      if (to.matched[0] && to.matched[0].name) {
        this.page = to.matched[0].name
      }
    }
  } 
}
</script>
