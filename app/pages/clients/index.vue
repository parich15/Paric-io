<script setup lang="ts">
import { clients, getClientProjects } from '~/data/clients'
import { isEditingTarget } from '~/utils/keyboard'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const root = useTemplateRef('root')
const selectedIndex = ref(0)
const enhanced = ref(false)

onMounted(() => { enhanced.value = true })

/** Los atajos recorren enlaces nativos; Tab y las acciones del menú conservan su comportamiento. */
function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isEditingTarget(event.target)) return
  const target = event.target instanceof HTMLElement ? event.target : null
  if (target?.closest('[role="menu"], [role="dialog"], [aria-modal="true"], [inert]')) return
  if (target !== root.value && !target?.closest('.clients-list')) return
  const links = root.value?.querySelectorAll<HTMLAnchorElement>('.client-row')
  if (!links?.length) return

  if (event.key === 'Enter' && (target === root.value || target?.classList.contains('clients-list'))) {
    event.preventDefault()
    links[selectedIndex.value]?.click()
    return
  }

  let index = selectedIndex.value
  if (event.key === 'ArrowUp') index--
  else if (event.key === 'ArrowDown') index++
  else if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = links.length - 1
  else return

  event.preventDefault()
  selectedIndex.value = (index + links.length) % links.length
  links[selectedIndex.value]?.focus()
}

useSeoMeta({ title: () => t('meta.clientsTitle'), description: () => t('meta.clientsDescription'), ogTitle: () => t('meta.clientsTitle'), ogDescription: () => t('meta.clientsDescription') })
</script>

<template>
  <main id="main-content" ref="root" tabindex="-1" class="clients-page" data-theme="dark" @keydown="onKeydown">
    <div class="clients-plane" aria-hidden="true">
      <ClientsStars />
    </div>
    <header class="clients-intro" data-motion="rise">
      <h1><P5Heading :text="t('common.clients')" size="h1" /></h1>
      <p class="clients-lead">{{ t('clients.intro') }}</p>
      <p v-if="clients.some(client => client.demo)" class="clients-notice">{{ t('clients.demoNotice') }}</p>
      <div v-if="enhanced" class="clients-keyboard keyboard-hints">
        <P5Kbd keys="↑↓">{{ t('common.navigate') }}</P5Kbd>
        <P5Kbd keys="↵">{{ t('common.open') }}</P5Kbd>
      </div>
    </header>
    <ul class="clients-list" tabindex="0" :aria-label="t('common.clients')">
      <li v-for="(client, index) in clients" :key="client.slug" data-motion="rise">
        <NuxtLink
          :to="localePath({ name: 'clients-slug', params: { slug: client.slug } })"
          class="client-row"
          :data-active="selectedIndex === index"
          :aria-label="t('clients.open', { name: client.name })"
          :aria-describedby="`client-count-${client.slug}`"
          @focus="selectedIndex = index"
          @pointerenter="selectedIndex = index"
        >
          <ClientLogo :client="client" />
          <div class="client-row-copy">
            <span class="client-sector label-p5">{{ client.content[locale].sector }}</span>
            <h2 class="display-p5">{{ client.name }}</h2>
          </div>
          <span :id="`client-count-${client.slug}`" class="client-count label-p5">{{ t('clients.projectCount', getClientProjects(client).length) }}</span>
          <span class="client-arrow display-p5" aria-hidden="true">→</span>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<style scoped src="~/assets/css/pages/clients.css"></style>
