<template>
  <b-row
    class="containerCp "
  >
    <b-col class="col-12 col-md-5 d-flex lateralCp">
      <div class="cajaSelector d-flex design" :class="{ 'activo': design }" @mouseenter="design = true ; marketing = false; branding = false">
        <h3 class="titCp">
          Diseño Web
        </h3>
        <hr class="subEspecial">
        <p class="txtCp">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. <br>Numquam assumenda quibusdam temporibus illo maiores ea ad.
        </p>
      </div>

      <div
        class=" cajaSelector d-flex marketing"
        data-num="1"
        :class="{ 'activo': marketing }"
        @mouseenter="marketing = true ; design = false; branding = false"
      >
        <h3 class="titCp">
          Marketing Digital
        </h3>
        <hr class="subEspecial">
        <p class="txtCp">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. <br>Numquam assumenda quibusdam temporibus illo maiores ea ad.
        </p>
      </div>

      <div
        class=" cajaSelector d-flex branding"
        data-num="2"
        :class="{ 'activo': branding }"
        @mouseenter="branding = true ; design = false; marketing = false"
      >
        <h3 class="titCp">
          Branding  Multimedia
        </h3>
        <hr class="subEspecial">
        <p class="txtCp">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.<br>Numquam assumenda quibusdam temporibus illo maiores ea ad.
        </p>
      </div>
    </b-col>

    <b-col id="rejillaDinamica" class="col-12 col-md-7 gridDinamica" data-num="3">
      <transition name="fade" mode="out-in">
        <div v-show="design" class="grid grid_1">
          <ul class="grid_list">
            <li class="item_1">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Web Corporativa</h4>
                  <p class="txt">Offering a comprehensive suite of communications and social services that connect people to make communication easy and intuitive.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_2">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">E-Commerce</h4>
                  <p class="txt">Delivering high-quality content through industry-leading technologies, to shape our next-generation social and content offering.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_3">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Single Page App</h4>
                  <p class="txt">Connecting users to merchants via fast and secure payment service,and to financial institutions via innovative consumer finance products.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_4">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Progressive WebApp</h4>
                  <p class="txt">Developing a range of powerful software tools to meet the evolving needs of users.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div v-show="marketing" class="grid grid_2">
          <ul class="grid_list">
            <li class="item_1">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Posicionamiento SEO</h4>
                  <p class="txt">Offering a comprehensive suite of communications and social services that connect people to make communication easy and intuitive.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_2">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Campañas SEM</h4>
                  <p class="txt">Delivering high-quality content through industry-leading technologies, to shape our next-generation social and content offering.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_3">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Remarketing Dinámico</h4>
                  <p class="txt">Connecting users to merchants via fast and secure payment service,and to financial institutions via innovative consumer finance products.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_4">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Marketing Social</h4>
                  <p class="txt">Developing a range of powerful software tools to meet the evolving needs of users.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div v-show="branding" class="grid grid_3">
          <ul class="grid_list">
            <li class="item_1">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Branding Estratégico</h4>
                  <p class="txt">Offering a comprehensive suite of communications and social services that connect people to make communication easy and intuitive.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_2">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Diseño de Marca</h4>
                  <p class="txt">Delivering high-quality content through industry-leading technologies, to shape our next-generation social and content offering.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_3">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Fotografía Profesional</h4>
                  <p class="txt">Connecting users to merchants via fast and secure payment service,and to financial institutions via innovative consumer finance products.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
            <li class="item_4">
              <a class="linkItem" href="#">
                <div class="script">
                  <h4 class="tit">Video Corporativo</h4>
                  <p class="txt">Developing a range of powerful software tools to meet the evolving needs of users.</p>
                  <p class="txt-mvl" style="display:none">Lorem ipsum dolor sit aetum</p>
                  <i class="icon icon_arrow_r" />
                </div>
              </a>
            </li>
          </ul>
        </div>
      </transition>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ComponentePrincipal',
  data () {
    return {
      design: true,
      marketing: false,
      branding: false
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
