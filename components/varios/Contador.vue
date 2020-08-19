<template>
  <div class="contador d-flex">
    <h4>{{ contador }}</h4>
    <h6>{{ titulo }}</h6>
  </div>
</template>

<script>

export default {
  name: 'Contador',
  props: {
    numero: {
      type: Number,
      default: 0
    },
    titulo: {
      type: String,
      default: 'Texto Contador'
    }
  },
  data () {
    return {
      contador: 0,
      num: this.numero
    }
  },
  watch: {
    num (val) {
      this.setContador(val)
    }
  },
  mounted () {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.7) {
            this.setContador(this.num)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.7
      }
    )
    observer.observe(document.querySelector('.contador'))
  }
  /* methods: {
    setContador (val) {
      const obj = { n: this.contador }
      /anime({
        targets: obj,
        n: val,
        round: 1,
        duration: 2000,
        easing: 'linear',
        update: () => {
          this.contador = obj.n
        }
      })
    }
  } */
}
</script>

<style lang="scss" scoped>

</style>
