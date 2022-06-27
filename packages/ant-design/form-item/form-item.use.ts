import { ArrayFormAdapter } from './../array-form/array-form.adapter'
import { FormItemAdapter, FormItemAlign, FormItemSlotConfig } from './form-item.adapter'
import { computed, ComputedRef, inject, reactive } from 'vue'
import { FormAdapter } from '../form/form.adapter'
import _ from 'lodash'

interface UseFormItemOpt {
  attrs: ComputedRef<FormItemAdapter>
  props: Record<string, any>
}

export interface FormItemState {
  align: ComputedRef<FormItemAlign | undefined>
  isRequired: ComputedRef<boolean>
  slotConfig: ComputedRef<FormItemSlotConfig>
  models: Record<string, any>
  fieldName: ComputedRef<string>
  rules: ComputedRef<string | Record<string, any> | undefined>
}

export const useFormItem = ({ attrs, props }: UseFormItemOpt) => {
  const formAttrs = inject<ComputedRef<FormAdapter>>(
    'formAttrs',
    computed(() => ({}))
  )
  const arrayFormAttrs = inject<ComputedRef<ArrayFormAdapter>>(
    'arrayFormAttrs',
    computed(() => ({}))
  )

  const state = reactive<FormItemState>({
    align: computed(() => attrs.value.align || formAttrs.value.itemAlign),
    isRequired: computed(() => {
      const rules = attrs.value.rules
      return rules && (_.isString(rules) ? rules.includes('required') : rules.required)
    }),
    slotConfig: computed(() => {
      if (attrs.value.type === 'slot') {
        const slot = attrs.value.control || {}
        return {
          name: slot.name,
          scope:
            typeof props.formIndex === 'number'
              ? { formIndex: props.formIndex, ...slot.scope }
              : slot.scope,
        }
      }
      return {}
    }),
    models: computed(() => {
      const res =
        arrayFormAttrs.value &&
        arrayFormAttrs.value.modelValue &&
        typeof props.formIndex === 'number'
          ? arrayFormAttrs.value.modelValue![props.formIndex]
          : formAttrs.value.models
      return res || {}
    }),
    fieldName: computed(() => {
      // 为每个表单验证字段name独一无二，在arrayForm中name = fieldName + formIndex
      const fieldName = attrs.value.validateFieldName || attrs.value.label || attrs.value.prop || ''
      if (typeof props.formIndex === 'number') {
        return fieldName + props.formIndex
      } else {
        return fieldName
      }
    }),
    rules: computed(() => {
      // 当formIndex存在时，替换rules中 :(@) | 和 :(@) , 之间的fieldName添加formIndex
      if (typeof props.formIndex === 'number' && typeof attrs.value.rules === 'string') {
        return attrs.value.rules.replaceAll(/([,:]@?)(.+)([\|,]?)/g, `$1$2${props.formIndex}$3`)
      } else {
        return attrs.value.rules
      }
    }),
  })

  const output = computed(() => ({}))
  return { output, formAttrs, state }
}
