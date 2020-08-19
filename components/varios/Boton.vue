<template>
  <div>
    <a v-if="href" :href="href" class="botonOscar">
      <slot />
    </a>
    <b-button v-else class="botonOscar" :class="estilo" @click="callback($event)">
      <slot />
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'Boton',
  props: {
    href: {
      type: String,
      default: null
    },
    block: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null
    }

  },
  data () {
    return {
      estilo: {}
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
