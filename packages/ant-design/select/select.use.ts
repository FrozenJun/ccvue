import { SelectAdapter } from './select.adapter'
import { computed, ComputedRef, SetupContext, watch } from 'vue'
import { useModelValue } from '@/core/utils/hooks/useModelValue'
import { useAsyncData } from '@/core/utils/hooks/useAsyncData'

interface UseSelectOpt {
  attrs: ComputedRef<SelectAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useSelect = ({ attrs, props, ctx }: UseSelectOpt) => {
  /** 异步options */
  const { data, send } = useAsyncData(attrs.value.optionsAsync)
  if (attrs.value.optionsAsync && attrs.value.optionsAsync.api) {
    watch(
      () => data.value,
      (v) => (attrs.value.options = v || [])
    )
    watch(
      () => attrs.value.optionsAsync!.loading,
      (v) => (attrs.value.loading = v)
    )
  }
  if (attrs.value.optionsAsync && attrs.value.optionsAsync.api) {
    const fn = attrs.value.onDropdownVisibleChange
    attrs.value.onDropdownVisibleChange = (open) => {
      fn && fn(open)
      open && send()
    }
    const modelFn = attrs.value.onModelChange
    attrs.value.onModelChange = (v, oldv, data) => {
      modelFn && modelFn(v, oldv, data)
      if (v && !oldv) {
        send()
      }
    }
  }

  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
