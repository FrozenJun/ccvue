import { ModalAdapter } from './modal.adapter'
import { computed, ComputedRef, getCurrentInstance } from 'vue'

interface UseModalOpt {
  attrs: ComputedRef<ModalAdapter>
}

export const useModal = ({ attrs }: UseModalOpt) => {
  const instance = getCurrentInstance()

  const open = (data?: any) => {
    attrs.value.preload = data
    attrs.value.visible = true
  }
  const close = (data?: any) => {
    attrs.value.preload = data
    attrs.value.visible = false
  }

  const output = computed(() => ({ open, close, data: attrs.value }))
  return { output }
}
