import { FormItemAdapter } from './../../form/form-item/form-item.adapter'
import { ButtonAdapter } from './../../base/button/button.adapter'
import { CsAdapter } from './cs.adapter'
import { computed, ComputedRef, reactive } from 'vue'
import { FormOutput } from '@/core/form/form/form.adapter'
import { emit } from '@/core/utils/service/provider.service'
import _ from 'lodash'
import { useOutputChange } from '@/core/utils/hooks/useOutputChange'

interface UseCsOpt {
  attrs: ComputedRef<CsAdapter>
}

export interface CsState {
  formOutput: Partial<FormOutput>
  searchButton: ButtonAdapter
  resetButton: ButtonAdapter
  originalModels: Record<string, any>
}
export const useCs = ({ attrs }: UseCsOpt) => {
  const state = reactive<CsState>({
    formOutput: {},
    originalModels: _.cloneDeep((attrs.value.form && attrs.value.form.models) || {}),
    searchButton: {
      text: '搜索',
      type: 'primary',
      onClick: searchCt,
    },
    resetButton: {
      text: '重置',
      onClick() {
        state.formOutput.reset && state.formOutput.reset()
        searchCt()
      },
    },
  })

  /** 搜索方法 */
  function searchCt() {
    const baseModels = (attrs.value.form && attrs.value.form.models) || {}
    const models = attrs.value.modelsHandler
      ? attrs.value.modelsHandler(_.cloneDeep(baseModels))
      : _.cloneDeep(baseModels)
    if (attrs.value.searchHandler) {
      attrs.value.searchHandler(models)
    } else {
      emit({ type: 'ct-setParams', name: attrs.value.n || '' }, (params) => {
        _.assign(params, state.originalModels)
        return _.pickBy(
          _.assign(params, models),
          (v) => !_.isUndefined(v) && !_.isNull(v) && v !== ''
        )
      })
      emit({ type: 'ct-setPageNo', name: attrs.value.n || '' }, 1)
      emit({ type: 'ct-update', name: attrs.value.n || '' })
    }
  }

  if (attrs.value.searchButton) {
    state.searchButton = _.assign(state.searchButton, attrs.value.searchButton)
  }
  if (attrs.value.resetButton) {
    state.resetButton = _.assign(state.resetButton, attrs.value.resetButton)
  }

  /** 在formItems末尾添加searchButton */
  const items = attrs.value.form!.formItems
  const width = attrs.value.form?.itemWidth || '25%'
  let no = 0
  let widthNumber = Number(width.split('%').join(''))
  if (width.endsWith('%')) {
    no = Math.floor(100 / widthNumber)
  }
  items?.forEach((item) => {
    item.width = width
  })
  const len = items?.length || 0
  const addItem: FormItemAdapter = {
    type: 'slot',
    width: no ? widthNumber * (no - (len % no)) + '%' : 'fit-content',
    control: { name: 'csSearchButton' },
  }
  if (items && !items.find((i: any) => i.item && i.item.name && i.item.name === 'csSearchButton')) {
    items.push(addItem)
  } else {
    attrs.value.form!.formItems = [addItem]
  }

  const { onOutputChange } = useOutputChange(state)

  const output = computed(() => ({}))
  return { output, state, onOutputChange }
}
