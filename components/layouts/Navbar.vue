<template>
  <b-navbar toggleable="lg" type="light" fixed="top" class="MenuNav" :class="{ 'navSolid': !showNavbar }">
    <b-navbar-brand tag="h1" class="mb-0 titulo" to="/">
      <logoOscar />
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" :class="{'bordes': !showNavbar}">
      <template v-slot:default="{ expanded }">
        <b-icon v-if="expanded" icon="three-dots-vertical" />
        <b-icon v-else icon="three-dots" :class="{'color-basico':!showNavbar}" />
      </template>
    </b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-navbar-nav class="my-auto linksMenu">
          <b-nav-item to="/Cooperativa">
            Diseño Web
          </b-nav-item>
          <b-nav-item to="#">
            Marketing
          </b-nav-item>
          <b-nav-item to="#">
            Branding
          </b-nav-item>
          <b-nav-item to="#">
            Sobre Mi
          </b-nav-item>
          <b-nav-item to="#">
            Blog
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import LogoOscar from '~/components/LogoOscar.vue'
export default {
  name: 'Navbar',
  components: {
    LogoOscar
  },
  data () {
    return {
      showNavbar: true,
      lastScrollPosition: 0
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll () {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
      if (currentScrollPosition < 0) {
        return
      }
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return
      }
      this.showNavbar = currentScrollPosition < 100
      this.lastScrollPosition = currentScrollPosition
    }
  }
}

</script>
