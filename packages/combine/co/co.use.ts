import { CoAdapter } from './co.adapter'
import { computed, ComputedRef, ref } from 'vue'
import { useMenuStore } from '@/store/modules/menu'
import { useRoute } from 'vue-router'

interface UseCoOpt {
  attrs: ComputedRef<CoAdapter>
}

export const useCo = ({ attrs }: UseCoOpt) => {
  const menuList = useMenuStore().GET_MENU() || []
  const route = useRoute()
  const currentName = ref('')
  getCurrentName(menuList)

  function getCurrentName(menu: any[]) {
    if (currentName.value) return
    menu.forEach((item, index) => {
      if (item.path === route.path) {
        currentName.value = item.name
      }
      if (Array.isArray(item.children) && item.children.length) {
        getCurrentName(item.children)
      }
    })
  }

  const output = computed(() => ({}))
  return { output, currentName }
}
