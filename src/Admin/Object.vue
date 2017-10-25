<script>
export default {
  methods: {
    query: async function () {
      if (this.id) {
        this.rec = await this.$agent.p_mfa(this.module, 'get', [this.id])
      }
    },
    onCommit: async function () {
      try {
        if (this.id) {
          await this.$agent.p_mfa(this.module, 'update', [this.id, this.rec])
        } else {
          await this.$agent.p_mfa(this.module, 'create', [this.rec])
        }
        this.$router.push(this.redirect)
      }
      catch (error) {
        this.$notify({ title: 'Data error:', text: error, type: 'error' });
      }
    },
    onDelete: async function () {
      if (this.id) {
        await this.$agent.p_mfa(this.module, 'delete', [this.id])
        this.$router.push(this.redirect)
      }
    },
  },
  created () {
    this.query()
  }
}
</script>
