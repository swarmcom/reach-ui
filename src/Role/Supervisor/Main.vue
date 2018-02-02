<template>
  <div v-access:main-ui v-bind:class="classObject">
    <draggable :list="widgets" :options="{draggable:'.itemDragable'}" @end="onDragEnd">
      <b-row v-for="(item, index) in widgets" :key="index" class="itemDragable">
        <b-col>
          <component v-if="showWidget(item)" v-bind:is="item" />
        </b-col>
      </b-row>
    </draggable>
  </div>

</template>

<script>
    import SessionManager from '@/Agent/SessionManager.vue'
    import MyStatistics from '@/Agent/MyStatistics.vue'
    import Agents from '@/Monitor/Agents'
    import Inqueues from '@/Monitor/Inqueues'
    import draggable from 'vuedraggable'
    export default {
        data () {
            return {
                widgets: []
            }
        },
        methods: {
            showWidget(name) {
                if (name === 'session-manager')
                    return true
                else if (name === 'my-statistics' && this.$agent.vm.layoutSM.isActiveMS && this.$agent.vm.agent.permissions['myStatistics-widget'])
                    return true
                else if (name === 'agents' && this.$agent.vm.layoutSM.isActiveAM  &&
                    this.$agent.vm.agent.permissions['agentManager-widget'])
                    return true
                else if (name === 'inqueues' && this.$agent.vm.layoutSM.isActiveQM  &&
                    this.$agent.vm.agent.permissions['queueManager-widget'])
                    return true
                else
                    return false
            },
            onDragEnd () {
                this.$agent.vm.storage_data["agentWidgets"] = this.widgets
                localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
            },
            moveWidgetmoj () {
                console.log("moveWidgetmojsadfasd" + this.$agent.vm.storage_data.navBarMoveWidget)

                if (this.$agent.vm.storage_data.navBarMoveWidget != undefined) {
                    return true
                    activeClass = ''
                }
                else {
                    return true//this.$agent.vm.storage_data.navBarMoveWidget
                    activeClass = 'itemDragable'
                }
            }
        },
        created () {
            if (this.$agent.vm.storage_data.agentWidgets != undefined)
                this.widgets = this.$agent.vm.storage_data.agentWidgets
            else
                this.widgets = ['session-manager', 'my-statistics', 'agents', 'inqueues']
            if (this.$agent.vm.storage_data.navBarMoveWidget != undefined)
                this.isMoveActive = this.$agent.vm.storage_data.navBarMoveWidget
        },
        computed: {
            classObject: function () {
                this.$agent.vm.storage_data["narrowScreenMain"] = this.$agent.vm.isNarrowLayout.main
                localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
                return {
                    container: this.$agent.vm.isNarrowLayout.main,
                    'padding-container-fluid': !this.$agent.vm.isNarrowLayout.main
                }
            },
            moveWidget: function () {
                console.log("moveWidget"+this.$agent.vm.storage_data.navBarMoveWidget)
                //return true
                if (this.$agent.vm.storage_data.navBarMoveWidget != undefined)
                    return false
                else
                    return this.$agent.vm.storage_data.navBarMoveWidget
            }
        },
        components: {
            'session-manager': SessionManager,
            'my-statistics': MyStatistics,
            'agents': Agents,
            'inqueues': Inqueues,
            draggable
        }
    }
</script>
