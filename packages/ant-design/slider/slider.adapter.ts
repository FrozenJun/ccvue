import { SliderProps } from 'ant-design-vue'
import { ElFormCtrlCommonAdapter } from '../../utils/dtos'

export type SliderSlots = 'mark'
export const sliderSlots = ['mark']

export const SliderBindsOmitKeys: (keyof SliderAdapter)[] = ['modelValue']
export interface SliderAdapter
  extends Partial<SliderProps & ElFormCtrlCommonAdapter<SliderAdapter, SliderOutput, SliderSlots>> {
  modelValue?: number | [number, number]

  showValue?: Boolean
  valueUnit?: String
}

export interface SliderOutput {}

export const SLIDER_DEFAULT: SliderAdapter = {}
