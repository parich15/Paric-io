<template>
  <div class="Inicio">
    <div class="cabecera clear-filter" filter-color="black">
      <parallax
        class="imagen-cabecera"
        style="background-image:url('/img/PortadaParicio.jpg')"
      />
      <div class="container-cabecera">
        <div class="content-center displayTitulo">
          <h1 class="tituloInicio text-focus-in">
            Experiencias Digitales Increibles
          </h1>
          <h3 class="subtInicio tracking-in-expand">
            Web Design & Marketing Digital
          </h3>
        </div>
      </div>
    </div>

    <b-container class="contenedorPrincipal" fluid>
      <tarjetas />
      <b-row class="presentacion" fluid>
        <b-col class="col-12 col-md-10 titPresentacion">
          <div class="d-flex cajaTitulo">
            <div class="titulo d-flex" data-aos="fade-in">
              <h2 id="presentacionWeb">
                ¿Necesitas una página Web?
              </h2>
              <div class="subtitulos d-flex">
                <div class="s1 d-flex">
                  <h6 class="subt">
                    Páginas Corporativas
                  </h6>
                </div>
                <div class="s2 d-flex">
                  <h6 class="subt">
                    Ecommerce
                  </h6>
                </div>
                <div class="s3 d-flex">
                  <h6 class="subt">
                    Apps Móviles
                  </h6>
                </div>
                <div class="s4 d-flex">
                  <h6 class="subt">
                    Márketing Digital
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="containerPresentacion" fluid>
      <b-row class="filaPresentacion">
        <b-col class="col-12 col-md-6 txtPresentacion">
          <div class="cajaPresentacion d-flex" data-aos="fade-in" data-aos-duration="700">
            <h3 class="ctaTit">
              Bienvenido a <span class="logo">Paric.<span class="i">I</span><span class="o">O</span></span>
            </h3>
            <hr class="separadorEspecial">
            <p class="parrafoPres">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita dolor ut ipsa. Eos nulla, ab ipsa eaque dolorem quae sequi doloremque voluptates cum temporibus repudiandae. Eum, libero sapiente! Suscipit, possimus.
            </p>
          </div>
        </b-col>
        <b-col class="col-12 col-md-6 fotoPresentacion">
          <div class="imagenCta" data-aos="zoom-in" data-aos-delay="300" data-aos-duration="700">
            <b-img src="~/static/img/TechStack.png" class="techStack" />
          </div>
        </b-col>
      </b-row>
      <b-row class="filaAccesible">
        <b-col class="col-12 col-md-6 txtAccesible">
          <div class="d-flex cajaAccesible" data-aos="zoom-in-left">
            <h3 class="titAcc">
              Proyectos Dedicados y <span>Accesibles</span>
            </h3>
            <hr class="separadorEspecial">
            <p class="parrafoAcc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita dolor ut ipsa. Eos nulla, ab ipsa eaque dolorem quae sequi doloremque voluptates cum temporibus repudiandae. Eum, libero sapiente! Suscipit, possimus.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores harum vitae Asperiores harum vitae
            </p>
          </div>
        </b-col>
        <b-col class="col-12 col-md-6 fotoAccesible">
          <div data-aos="zoom-in-right">
            <icono-animado />
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="componentePrincipal" fluid>
      <componente-principal />
    </b-container>
    <b-container class="Brands" fluid>
      <b-row class="filaBrand">
        <b-col class="col-12 col-md-2 contadores d-flex">
          <div class="containerContadores d-flex">
            <contador :numero="10" titulo="Proyectos" />
            <contador :numero="2500" titulo="Visitas Promedio" />
            <contador :numero="300" titulo="Backlinks" />
          </div>
        </b-col>
        <b-col class="col-12 col-md-10 brandText d-flex">
          <div class="textoBrand d-flex">
            <div data-aos="fade-up">
              <h2 class="tit">
                Mi Portfol<span class="io">io</span>
              </h2>
              <hr class="subEspecial">
              <p class="txtBrand">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius quidem et dolores at repellat incidunt rerum tempora optio cumque animi? Natus dolorem neque excepturi odit quos quisquam vero id unde.
              </p>
            </div>
          </div>
          <div class="tjtsBrands d-flex">
            <tarjetas-proyecto />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Parallax from '../components/layouts/Parallax.vue'
import Tarjetas from '../components/varios/Tarjetas.vue'
import iconoAnimado from '../components/varios/iconoAnimado.vue'
import componentePrincipal from '../components/layouts/componentePrincipal.vue'
import Contador from '../components/varios/Contador.vue'
import TarjetasProyecto from '../components/varios/TarjetasProyecto.vue'
export default {
  components: {
    Parallax,
    Tarjetas,
    iconoAnimado,
    componentePrincipal,
    Contador,
    TarjetasProyecto
  }
}
</script>

<style lang="scss" scoped>

</style>
