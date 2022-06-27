import {
  MOBILE_REGEXP,
  ID_CARD_REGEXP,
  TELEPHONE_REGEXP,
  POS_INT_REGEXP,
  POS_FLOAT_REGEXP,
  CHINESE_REGEXP,
  PASSPORT_REGEXP,
  IP_REGEXP,
} from './constants/reg-exp'
import { defineRule, configure } from 'vee-validate'
import rules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import cn from '@vee-validate/i18n/dist/locale/zh_CN.json'

Object.keys(rules).forEach((rule) => {
  defineRule(rule, rules[rule])
})

configure({
  generateMessage: localize({ cn }),
})

setLocale('cn')

// 身份证
defineRule('IDCard', (value: string) => {
  if (isEmpty(value)) return true
  return ID_CARD_REGEXP.test(value) || '身份证格式不正确'
})
// 手机号验证
defineRule('mobile', (value: string) => {
  if (isEmpty(value)) return true
  return MOBILE_REGEXP.test(value) || '手机号输入不正确'
})
// 固定电话验证
defineRule('telephone', (value: string) => {
  if (isEmpty(value)) return true
  return TELEPHONE_REGEXP.test(value) || '固定电话输入不正确'
})
// 正整数
defineRule('pos_int', (value: string) => {
  if (isEmpty(value)) return true
  return POS_INT_REGEXP.test(value) || '只能是正整数'
})
// 正实数
defineRule('pos_float', (value: string) => {
  if (isEmpty(value)) return true
  return POS_FLOAT_REGEXP.test(value) || '只能是正实数'
})
// 非负浮点数
defineRule('no_neg_float', (value: string) => {
  if (isEmpty(value)) return true
  return /^\d+(\.\d+)?$/.test(value) || '只能是非负实数'
})
// 汉字
defineRule('chinese', (value: string) => {
  if (isEmpty(value)) return true
  return CHINESE_REGEXP.test(value) || '只能是汉字'
})
// 数字或大写字母
defineRule('upper_num', (value: string) => {
  if (isEmpty(value)) return true
  return /^[A-Z0-9]+$/.test(value) || '只能是数字或者大写字母'
})
// 地址 - 汉字、数字、—。
defineRule('address', (value: string) => {
  if (isEmpty(value)) return true
  return /^[\u4e00-\u9fa5A-Za-z0-9-]+$/.test(value) || '只能由汉字、数字、大小写字母、—组成'
})
// 不包含数字
defineRule('no_num', (value: string) => {
  return /^[\D]+$/.test(value) || '不能包含数字'
})
// 不包含特殊字符
defineRule('no_special', (value: string) => {
  if (isEmpty(value)) return true
  return /^[\u4e00-\u9fa5A-Za-z0-9]{0,}$/.test(value) || '不能包含特殊字符'
})
// 护照
defineRule('hz', (value: string) => {
  if (isEmpty(value)) return true
  return PASSPORT_REGEXP.test(value) || '请输入正确的护照'
})
// IP
defineRule('ip', (value: string) => {
  if (isEmpty(value)) return true
  return IP_REGEXP.test(value) || '请输入正确的IP地址'
})
// 确认密码
defineRule('confirmed', (value: string, [target]: any, ctx) => {
  return value === ctx.form[target] || '确认密码和密码不一致'
})
/**
 * 至少存在一个值
 *
 * ```javascript
 * rules: 'at_least_one:@field1,@field2'
 * ```
 */
defineRule('at_least_one', (value: any, targets) => {
  const values = [value, ...targets]
  const isValid = values.some((v) => {
    if (Array.isArray(v)) {
      return !!v.length
    }
    return !!v
  })
  return isValid || '至少需要有一个值'
})

function isEmpty(value: any) {
  if (value === null || value === undefined || value === '') {
    return true
  }
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  return false
}
