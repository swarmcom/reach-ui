<template>
  <b-container fluid style="margin-left: unset; margin-right: unset; padding-left: 0; padding-right: 0; margin-top: 15px">
    <b-row style="width: 100%; margin-left: unset; margin-right: unset">
      <b-col style="width: 20%; max-width: 20%; min-width: 200px; padding: 0 2px 0 0;">
        <table style="width: 100%;">
          <tr>
            <td class='report-headers' style="width: 100%; max-width: 100%; min-width: 100%">
              Input Controls
            </td>
          </tr>
          <tr>
            <td style="padding: 15px;">
              <b-row style="padding: 0; margin: 0">
                <b-col style="padding: 0; margin: 0">
                  <div>
                    <slot name="input-controls">
                      Put some input controls here.
                    </slot>
                  </div>
                  <b-button @click="reset" class="btn btn-outline-secondary float-right" size="sm">Reset</b-button>
                  <b-button @click="apply" class="btn btn-outline-secondary float-right" style="margin-right: 20px" size="sm">Apply</b-button>
                </b-col>
              </b-row>
            </td>
          </tr>
        </table>
      </b-col>
      <b-col style="overflow-x: auto; padding: unset;">
        <table style="width: 100%;">
          <tr>
            <td class='report-headers'>
              Report: {{name}}
            </td>
          </tr>
        </table>
        <div style="overflow-x: auto; margin: 15px">
          <table style="margin-bottom: 3px">
            <tr>
              <td class='report-title' style="width: 100%">
                {{title}}
              </td>
            </tr>
            <tr>
              <td class='datetime-info' style="width: 100%">
                {{from}} - {{to}}
              </td>
            </tr>
            <tr style="margin-bottom: 7px">
              <td class='timezone-info' style="width: 100%">
                Time zone: GMT
              </td>
            </tr>
          </table>
          <slot name="report">
            Put report content here.
          </slot>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'ReportTemplate',
  props: {
    name: {
      type: String,
      default: "unknown"
    },
    title: {
      default: "undefined"
    },
    from: {
      default: undefined
    },
    to: {
      default: undefined
    }
  },
  data () {
    return {
      reportFromTo: {
        date_start: undefined,
        date_end: undefined,
      },
    }
  },
  methods: {
    reset () {
      this.$emit('reset')
    },
    apply () {
      this.$emit('apply')
    }
  }
}
</script>

<style lang="scss">
@import "../reports";
</style>
