<template>
  <div class="containerTjtBrand d-flex">
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="tarjetaBrand d-flex"
      :class="item.class"
      data-aos="fade-up"
      :data-aos-delay="item.tiempo"
    >
      <h5 class="proyecto">
        {{ item.proyecto }}
      </h5>
      <p class="descripcion">
        {{ item.descripcion }}
      </p>
      <b-link :to="item.link" class="linkTjt">
        Ir al proyecto
        <b-icon icon="chevron-double-right" />
      </b-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TarjetasProyecto',
  data () {
    return {
      items: [
        { proyecto: 'Proyecto CapTotal', descripcion: 'Informacion Proyecto Cap Total', class: 'Captotal', link: '/Captotal', tiempo: '0' },
        { proyecto: 'Proyecto Cemar', descripcion: 'Informacion Proyecto Cemar', class: 'Cemar', link: '/Cemar', tiempo: '3000' },
        { proyecto: 'Proyecto Hortec', descripcion: 'Informacion Proyecto Hortec', class: 'Hortec', link: '/Hortec', tiempo: '5000' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
