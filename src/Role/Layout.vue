<script>
import moment from 'moment'

export default {
  methods: {
    isNarrow () {
      return ! this.$agent.vm.wide_page[this.path]
    },
    isMain () {
      return this.path == '/main'
    },
    maybeWide () {
      return this.$agent.vm.wide_page[this.path]? 'padding-container-fluid' : 'container'
    },
    changeWide () {
      this.$agent.vm.wide_page[this.path] = ! this.$agent.vm.wide_page[this.path]
      this.$agent.saveWidePage()
    },
    canMyStat() {
      return this.$agent.permAllowed('widget-my-statistics')
    },
    canAgentManager() {
      return this.$agent.permAllowed('widget-agent-manager') && this.$agent.role() == 'supervisor'
    },
    canQueueManager() {
      return this.$agent.permAllowed('widget-queue-manager') && this.$agent.role() == 'supervisor'
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
      this.path = to.matched[to.matched.length - 1].path
      let wp = this.$agent.vm.wide_page
      this.$agent.vm.wide_page[this.path] = wp[this.path] == undefined? false : wp[this.path]
    }
  } 
}
</script>
