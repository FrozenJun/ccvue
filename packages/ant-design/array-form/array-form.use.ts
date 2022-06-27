import { FormItemAdapter } from './../form-item/form-item.adapter'
import { ArrayFormAdapter } from './array-form.adapter'
import { computed, ComputedRef, provide, reactive, SetupContext, watch } from 'vue'
import { useModelValue } from '@/core/utils/hooks/useModelValue'
import _ from 'lodash'

interface UseArrayFormOpt {
  attrs: ComputedRef<ArrayFormAdapter>
  props: Record<string, any>
  ctx: SetupContext<any>
}
interface ArrayFormState {
  originalModels: Record<string, any>[]
  formList: { formItems: FormItemAdapter[] }[]
}

export const ARRAY_FORM_ITEM_INDEX = 'ARRAY_FORM_ITEM_INDEX'
export const useArrayForm = ({ attrs, ctx, props }: UseArrayFormOpt) => {
  provide('arrayFormAttrs', attrs)
  const state = reactive<ArrayFormState>({
    originalModels: _.cloneDeep(attrs.value.modelValue || []),
    formList: new Array((attrs.value.modelValue || []).length).fill({
      formItems: _.cloneDeep(attrs.value.formItems as any),
    }),
  })

  const min = computed(() => {
    return Math.floor(Math.max(attrs.value.min || 0, state.originalModels.length))
  })
  const max = computed(() => {
    return Math.floor(attrs.value.max || Infinity)
  })
  const hasMax = computed(() => {
    return max.value >= Math.floor(attrs.value.min || 0)
  })
  watch(
    () => attrs.value.modelValue,
    (v = []) => {
      if (state.formList.length > min.value && v.length === min.value) {
        // 重置了
        resetFormList()
      }
      if (state.formList.length === min.value && (v && v.length) !== min.value) {
        // 反显了
        initFormList()
      }
    },
    { flush: 'post', deep: true }
  )

  const resetFormList = () => {
    state.formList.length = 0
    attrs.value.modelValue!.length = 0
    for (let i = 0; i < min.value; i++) {
      state.formList.push({ formItems: _.cloneDeep(attrs.value.formItems as any) })
      attrs.value.modelValue!.push(_.cloneDeep(state.originalModels[i] || {}))
    }
  }
  const initFormList = () => {
    state.formList.length = 0
    const max = Math.max((attrs.value.modelValue || []).length, min.value)
    for (let i = 0; i < max; i++) {
      state.formList.push({ formItems: _.cloneDeep(attrs.value.formItems as any) })
      if (i > attrs.value.modelValue!.length - 1) {
        attrs.value.modelValue!.push(
          _.cloneDeep(state.originalModels[i] || _.cloneDeep(attrs.value.models) || {})
        )
      }
    }
  }

  const addItem = () => {
    state.formList.push({ formItems: _.cloneDeep(attrs.value.formItems as any) })
    attrs.value.modelValue!.push(_.cloneDeep(attrs.value.models || {}))
  }
  const deleteItem = (index: number) => {
    state.formList = state.formList.filter((i, n) => n !== index)
    attrs.value.modelValue = attrs.value.modelValue!.filter((i, n) => n !== index)
  }

  const up = (index: number) => {
    const current = state.formList[index]
    state.formList[index] = state.formList[index - 1]
    state.formList[index - 1] = current
    const currentModel = attrs.value.modelValue![index]
    attrs.value.modelValue![index] = attrs.value.modelValue![index - 1]
    attrs.value.modelValue![index - 1] = currentModel
  }
  const down = (index: number) => {
    const current = state.formList[index]
    state.formList[index] = state.formList[index + 1]
    state.formList[index + 1] = current
    const currentModel = attrs.value.modelValue![index]
    attrs.value.modelValue![index] = attrs.value.modelValue![index + 1]
    attrs.value.modelValue![index + 1] = currentModel
  }

  useModelValue({ props, attrs, ctx })
  const output = computed(() => ({}))
  return { output, state, addItem, deleteItem, up, down, min, max, hasMax }
}
