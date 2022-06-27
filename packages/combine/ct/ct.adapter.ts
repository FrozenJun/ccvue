import { ImageAdapter } from './../../base/image/image.adapter'
import { PopconfirmAdapter } from './../../base/popconfirm/popconfirm.adapter'
import { ButtonAdapter } from './../../base/button/button.adapter'
import { TableAdapter } from './../../base/table/table.adapter'
import { ElCommonAdapter } from '../../utils/dtos'
import { ColumnGroupType, ColumnType } from 'ant-design-vue/lib/table'
import { AsyncDataAdapter } from '@/core/utils/hooks/useAsyncData'
import { ModalAdapter } from '../../base/modal/modal.adapter'

export type CtSlots = 'default'
export const ctSlots = ['default']

export interface OperateItem {
  button?: ButtonAdapter
  popconfirm?: PopconfirmAdapter
  isDanger?: boolean
}
type CtColumnBaseType = Partial<ColumnGroupType<any> | ColumnType>
export interface CtColumnExtraType {
  type?: 'text' | 'operate' | 'image' | 'images' | 'index' | 'convert' | 'slot'
  image?: ImageAdapter
  onlyShowFirstImage?: boolean
  operateRender?: (scope: {
    column: Record<string, any>
    index: number
    text: any
    record: Record<string, any>
  }) => OperateItem[]
  asyncData?: AsyncDataAdapter
  convertHandle?: (
    scope: {
      column: Record<string, any>
      index: number
      text: any
      record: Record<string, any>
    },
    asyncData?: AsyncDataAdapter
  ) => string
  enumTypes?: { label: string; value: string | number }[]
  // 格式化时间
  format?: string
  textHandler?: (scope: {
    column: Record<string, any>
    index: number
    text: any
    record: Record<string, any>
  }) => string
  slotName?: string
}
export type CtColumnType = CtColumnExtraType & CtColumnBaseType

export const CtBindsOmitKeys: (keyof CtAdapter)[] = ['dataSourceAsync', 'columns']
export interface CtAdapter
  extends Partial<TableAdapter & ElCommonAdapter<CtAdapter, CtOutput, CtSlots>> {
  dataSourceAsync?: AsyncDataAdapter<any[]>
  columns?: CtColumnType[]

  sink?: boolean // grid是否沉底
  sinkAdapter?: number // 偏移量，默认值失效时可设置调节
}

export interface CtOutput {
  setData(data: any[]): unknown
  setPageNo(pageNo: number): void
  setPageSize(pageSize: number): void
  setParams(
    params: Record<string, any> | ((params?: Record<string, any>) => Record<string, any>)
  ): unknown
  setExtraParams(
    params: Record<string, any> | ((params?: Record<string, any>) => Record<string, any>),
    name?: string
  ): unknown
  update(): unknown
}

export const CT_DEFAULT: CtAdapter = {
  sinkAdapter: 21,
}
export const CT_IMAGE: ImageAdapter = {}
export const CT_BUTTON: ButtonAdapter = {
  visible: true,
  type: 'text',
}
export const CT_POPCONFIRM: PopconfirmAdapter = {}
