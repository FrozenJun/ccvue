import { CtAdapter, CT_BUTTON, CT_POPCONFIRM, OperateItem } from './ct.adapter'
import {
  computed,
  ComputedRef,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import _ from 'lodash'
import { useAsyncData } from '@/core/utils/hooks/useAsyncData'
import { getOperateColumnLengthAuto } from '@/core/utils/tools'

interface UseCtOpt {
  attrs: ComputedRef<CtAdapter>
}

export const useCt = ({ attrs }: UseCtOpt) => {
  const instance = getCurrentInstance()

  /** 获取表格最小高度 */
  const minHeight = ref<string>()
  const computedMinHeight = () => {
    const el = instance?.proxy?.$el
    if (el && attrs.value.sink) {
      const top = el.getBoundingClientRect().top
      const adapterValue = attrs.value.sinkAdapter || 0
      el.style.minHeight = `calc(100vh - ${top + adapterValue}px)`
      el.style.height = `calc(100vh - ${top + adapterValue}px)`
    } else {
      el.style.height = null
      el.style.minHeight = null
    }
  }
  onMounted(() => {
    computedMinHeight()
    window.addEventListener('resize', computedMinHeight)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', computedMinHeight)
  })

  /** 异步数据 */
  const { data, setParams, setExtraParams, sendAlways } = useAsyncData(attrs.value.dataSourceAsync)

  /** computed pageNo */
  const pagination = attrs.value.pagination
  if (pagination) {
    setExtraParams({ current: pagination!.current, size: pagination!.pageSize })
    const fn = pagination.onChange
    pagination.onChange = (page, pageSize) => {
      pagination.current = page
      pagination.pageSize = pageSize
      setExtraParams({ current: pagination!.current, size: pagination!.pageSize })
      sendAlways()
      fn && fn(page, pageSize)
    }
  }
  const setPageNo = (pageNo: number) => {
    if (pagination) {
      pagination.current = pageNo
      setExtraParams({ current: pagination!.current, size: pagination!.pageSize })
    }
  }
  const setPageSize = (pageSize: number) => {
    if (pagination) {
      pagination.pageSize = pageSize
      setExtraParams({ current: pagination!.current, size: pagination!.pageSize })
    }
  }

  if (attrs.value.dataSourceAsync && _.isFunction(attrs.value.dataSourceAsync.api)) {
    watch(
      () => data.value,
      (v) => {
        attrs.value.dataSource = v || []
        // 每页条数改变也需要重新计算
        nextTick(computedMinHeight)
      }
    )
    watch(
      () => attrs.value.dataSourceAsync!.loading,
      (v) => {
        attrs.value.loading = v
      }
    )
  }
  if (attrs.value.dataSourceAsync && _.isFunction(attrs.value.dataSourceAsync.api)) {
    const originDataHandle = attrs.value.dataSourceAsync.dataHandle
    attrs.value.dataSourceAsync.dataHandle = (data) => {
      if (attrs.value.pagination) {
        attrs.value.pagination.total = data.total
      }

      if (_.isFunction(originDataHandle)) {
        return originDataHandle(data)
      } else {
        return attrs.value.pagination === false ? data : data.records
      }
    }
  }

  // 计算操作列的宽度
  getOperateColumnLengthAuto(attrs.value)

  /** 表格更新操作 */
  type UpdateOpt = {
    deletedCount?: number
  }
  const update = ({ deletedCount }: UpdateOpt = {}) => {
    // 有删除表格数据并且是分页时，需要重新计算下次刷新是的当前页
    if (deletedCount && deletedCount > 0 && attrs.value.pagination) {
      const { current, pageSize } = attrs.value.pagination
      const dataLen = attrs.value.dataSource ? attrs.value.dataSource.length : 0
      const diff = Math.floor(deletedCount) - dataLen
      if ((diff > 0 || diff === 0) && current && pageSize) {
        const newCurrent = current - Math.floor(diff / pageSize) - 1
        setPageNo(newCurrent < 1 ? 1 : newCurrent)
      }
    }
    sendAlways()
  }

  /** columns的异步数据 */
  attrs.value.columns?.forEach((column) => {
    if (column.asyncData) useAsyncData(column.asyncData)
  })

  /** 操作功能按钮 */
  const generateOperates = (scope: any) => {
    if (scope.column.operateRender) {
      const operates = scope.column.operateRender(scope)
      operates.forEach((operate: OperateItem) => {
        _.defaults(operate.button, CT_BUTTON)
        _.defaults(operate.popconfirm, CT_POPCONFIRM)
      })
      return operates
    } else {
      return []
    }
  }

  const output = computed(() => ({
    setData(data: any[]) {
      attrs.value.dataSource = data
    },
    setPageNo,
    setPageSize,
    setParams,
    setExtraParams,
    update,
  }))
  return { output, generateOperates, minHeight }
}
