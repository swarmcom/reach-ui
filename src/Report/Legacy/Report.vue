<template>
  <b-container fluid style="margin-left: unset; margin-right: unset; padding-left: 0; padding-right: 0; margin-top: 15px">
    <b-row style="width: 100%; margin-left: unset; margin-bottom: 10px; margin-right: unset">
      <b-col cols="12" class='report-headers' style="padding-top: 10px; margin-bottom: 10px">
        <b-row>
          <b-col style="cursor:pointer" v-on:click="isVisible = !isVisible">
            <icon v-if="isVisible" name="minus" scale="0.5"></icon>
            <icon v-if="!isVisible" name="plus" scale="0.5"></icon>
            Input Controls
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12">
        <b-form v-if="isVisible" @submit="apply">
          <b-col>
            <div>
              <slot name="input-controls">
                Put some input controls here.
              </slot>
            </div>
          </b-col>
          <b-button @click="reset" class="btn btn-outline-secondary float-right" size="sm">Reset</b-button>
          <b-button type="submit" class="btn btn-outline-secondary float-right" style="margin-right: 20px" size="sm">Apply</b-button>
        </b-form>
      </b-col>
    </b-row>
    <b-row style="width: 100%; margin-left: unset; margin-right: unset">
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
                {{timeRange}}
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
    timeRange: {
      type: String,
      default: "-"
    }
  },
  data () {
    return {
      reportFromTo: {
        date_start: undefined,
        date_end: undefined,
      },
      isVisible: true
    }
  },
  methods: {
    reset () {
      this.$emit('reset')
    },
    apply (evt) {
      evt.preventDefault();
      this.$emit('apply')
    }
  }
}
</script>

<style lang="scss">
@import "../reports";
</style>
