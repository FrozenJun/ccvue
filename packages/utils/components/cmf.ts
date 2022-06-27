import { CmfAdapter } from './../../combine/cmf/cmf.adapter'
import { FormItemAdapter } from './../../form/form-item/form-item.adapter'

export function getCmfItemByProp(
  itemProp: string,
  cmf: CmfAdapter
): FormItemAdapter | undefined {
  const items = cmf.form?.formItems || []
  return items.find((item) => item.prop === itemProp)
}

export function getCmfControlByProp<T>(
  itemProp: string,
  cmf: CmfAdapter
): T | undefined {
  const items = cmf.form?.formItems || []
  const item = items.find((item) => item.prop === itemProp)
  return item && (item.control as T)
}
