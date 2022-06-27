import { CtAdapter } from './../combine/ct/ct.adapter'
export async function waitUnitExist(fn: () => boolean, maxWaitTime = 10000) {
  let count = 0
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (fn() || count > 30) {
        clearInterval(interval)
        resolve(true)
      }
      count++
    }, 300)
  })
}

export function getOperateColumnLengthAuto(ct: CtAdapter) {
  const opreateColumn = ct.columns?.find((i) => i.type === 'operate')
  if (opreateColumn && !opreateColumn.width) {
    const operates = opreateColumn.operateRender
      ? opreateColumn
          .operateRender({
            record: {},
            column: opreateColumn,
            index: 0,
            text: '',
          })
          .filter((operate) => operate.button && operate.button.visible !== false)
      : []
    opreateColumn.width = operates.reduce((a, b) => a + (b.button?.text?.length || 0) * 14 + 22, 16)
  }
}
export function getOperateColumnLengthBySelf(numbers: [buttonNumber: number, textNumber: number]) {
  return numbers[0] * 22 + numbers[1] * 14 + 16
}
