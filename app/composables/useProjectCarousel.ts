import { computed, nextTick, onMounted, onScopeDispose, ref, type Ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { getProjects, type ProjectCategory } from '~/data/projects'
import { carouselDistance, circularIndex, dragTarget, projectQuery, resolveCarouselState, type CarouselState } from '~/utils/carousel'
import { isEditingTarget } from '~/utils/keyboard'

/** Estado navegable del carrusel; hidrata el HTML generado antes de aplicar la query del navegador. */
export function useProjectCarousel(root: Ref<HTMLElement | null>) {
  const route = useRoute()
  const router = useRouter()
  const localePath = useLocalePath()
  const state = ref<CarouselState>({ category: 'pro', index: 0 })
  const query = ref<typeof route.query>({})
  const category = computed(() => state.value.category)
  const projects = computed(() => getProjects(category.value))
  const index = computed(() => state.value.index)
  const current = computed(() => projects.value[index.value]!)
  const position = ref(index.value)
  const dragging = ref(false)
  const detailTarget = computed(() => localePath({ name: 'projects-slug', params: { slug: current.value.slug }, query: projectQuery(current.value, query.value) }))
  let gesture: { id: number, startX: number, startY: number, position: number, width: number, target: HTMLElement } | undefined
  let suppressClick = false

  function readRoute() {
    query.value = route.query
    state.value = resolveCarouselState(route.query)
    position.value = state.value.index
  }

  onMounted(readRoute)
  watch(() => route.query, readRoute)

  async function select(nextIndex: number) {
    state.value = { category: category.value, index: circularIndex(nextIndex, projects.value.length) }
    position.value = index.value
    await router.replace({ path: route.path, query: projectQuery(current.value, route.query), hash: route.hash })
  }

  function step(direction: number) {
    return select(index.value + direction)
  }

  async function setCategory(nextCategory: ProjectCategory) {
    if (nextCategory === category.value) return
    cancelDrag()
    state.value = { category: nextCategory, index: 0 }
    position.value = 0
    await router.replace({ path: route.path, query: projectQuery(current.value, route.query), hash: route.hash })
  }

  async function onKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isEditingTarget(event.target)) return
    const target = event.target instanceof HTMLElement ? event.target : null
    if (target?.closest('[role="menu"], [role="dialog"], [aria-modal="true"], [inert]')) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const cardFocused = Boolean(target?.closest('[data-project-card]'))
      await step(event.key === 'ArrowLeft' ? -1 : 1)
      if (cardFocused) {
        await nextTick()
        root.value?.querySelector<HTMLElement>('[data-project-card][aria-current="true"]')?.focus({ preventScroll: true })
      }
    }
    else if (event.key === 'Enter' && !target?.closest('a, button, [role="button"]')) {
      event.preventDefault()
      await router.push(detailTarget.value)
    }
  }

  useEventListener(root, 'keydown', onKeydown)

  function onPointerDown(event: PointerEvent) {
    if (!event.isPrimary || event.button !== 0 || gesture) return
    const target = event.currentTarget as HTMLElement
    suppressClick = false
    gesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, position: index.value, width: target.clientWidth * (target.clientWidth < 760 ? 0.6 : 0.42), target }
  }

  /** Transfiere la captura táctil implícita del contenido al escenario sin cancelar el gesto. */
  function onPointerMove(event: PointerEvent) {
    if (!gesture || event.pointerId !== gesture.id) return
    const deltaX = event.clientX - gesture.startX
    const deltaY = event.clientY - gesture.startY
    if (!dragging.value) {
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        cancelDrag()
        return
      }
      if (Math.abs(deltaX) < 8) return
      dragging.value = true
      gesture.target.setPointerCapture(event.pointerId)
    }
    suppressClick = true
    position.value = gesture.position - Math.max(-2, Math.min(2, deltaX / gesture.width))
  }

  function cancelDrag() {
    const previous = gesture
    gesture = undefined
    dragging.value = false
    position.value = index.value
    if (previous?.target.hasPointerCapture(previous.id)) previous.target.releasePointerCapture(previous.id)
  }

  function onPointerUp(event: PointerEvent) {
    if (!gesture || event.pointerId !== gesture.id) return
    const nextPosition = dragTarget(gesture.position, event.clientX - gesture.startX, event.clientY - gesture.startY, gesture.width)
    const moved = dragging.value
    cancelDrag()
    if (moved) void select(nextPosition)
  }

  function onClickCapture(event: MouseEvent) {
    if (suppressClick && event.detail !== 0) {
      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }
  }

  function distance(cardIndex: number) {
    return carouselDistance(cardIndex, position.value, projects.value.length)
  }

  onScopeDispose(cancelDrag)

  return { category, projects, index, current, query, dragging, detailTarget, select, step, setCategory, distance, onPointerDown, onPointerMove, onPointerUp, cancelDrag, onClickCapture }
}
