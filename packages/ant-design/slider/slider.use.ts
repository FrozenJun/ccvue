import { SliderAdapter } from './slider.adapter'
import { computed, ComputedRef, SetupContext } from 'vue'
import { useModelValue } from '@/core/utils/hooks/useModelValue'

interface UseSliderOpt {
  attrs: ComputedRef<SliderAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}

export const useSlider = ({ attrs, ctx, props }: UseSliderOpt) => {

  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output }
}
