<template>
  <Field
    v-if="attrs.visible"
    :class="className"
    :name="fieldName"
    :rules="rules || ''"
    v-slot="{ errors }"
    v-model="models[attrs.prop || '']"
  >
    <FormItem
      v-show="!attrs.hidden"
      :class="{
        'c-form-item__item': true,
        [attrs.className || '']: true,
        'is-required': isRequired,
        'is-error': errors[0],
        [`is-content-${align}`]: align,
      }"
      :style="{ width: attrs.width || formAttrs.itemWidth }"
      :ref="$options.name"
      v-bind="binds"
    >
      <template v-for="slots in computedSlots($slots)" #[slots.type]="scope" :key="slots.type">
        <template v-if="slots.type === 'default'">
          <!-- TYPE ITEM -->
          <Input
            v-if="!attrs.type || attrs.type === 'input'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Input>

          <InputNumber
            v-else-if="attrs.type === 'input-number'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </InputNumber>

          <InputNumberRange
            v-else-if="attrs.type === 'input-number-range'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </InputNumberRange>

          <InputSearch
            v-else-if="attrs.type === 'input-search'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </InputSearch>

          <InputPassword
            v-else-if="attrs.type === 'input-password'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </InputPassword>

          <AutoComplete
            v-else-if="attrs.type === 'auto-complete'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </AutoComplete>

          <Textarea
            v-else-if="attrs.type === 'textarea'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Textarea>

          <Select
            v-else-if="attrs.type === 'select'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Select>

          <TreeSelect
            v-else-if="attrs.type === 'tree-select'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </TreeSelect>

          <DatePicker
            v-else-if="attrs.type === 'date-picker'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </DatePicker>

          <RangePicker
            v-else-if="attrs.type === 'range-picker'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </RangePicker>

          <TimePicker
            v-else-if="attrs.type === 'time-picker'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </TimePicker>

          <TimeRangePicker
            v-else-if="attrs.type === 'time-range-picker'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </TimeRangePicker>

          <Checkbox
            v-else-if="attrs.type === 'checkbox'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Checkbox>

          <CheckboxGroup
            v-else-if="attrs.type === 'checkbox-group'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </CheckboxGroup>

          <Radio
            v-else-if="attrs.type === 'radio'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Radio>

          <RadioGroup
            v-else-if="attrs.type === 'radio-group'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </RadioGroup>

          <Switch
            v-else-if="attrs.type === 'switch'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Switch>

          <Cascader
            v-else-if="attrs.type === 'cascader'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Cascader>

          <Upload
            v-else-if="attrs.type === 'upload'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Upload>

          <ArrayForm
            v-else-if="attrs.type === 'array-form'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </ArrayForm>

          <Slider
            v-else-if="attrs.type === 'slider'"
            :class="[attrs.formControlClassName]"
            :c="setInner(attrs.control)"
            v-model="models[attrs.prop || '']"
          >
            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope"></slot>
            </template>
          </Slider>

          <template v-else-if="attrs.type === 'empty'"></template>

          <slot
            v-else-if="attrs.type === 'slot'"
            :name="slotConfig.name"
            :scope="slotConfig.scope"
          ></slot>
          <!-- Error And Tip  -->
          <span class="c-form-item__error">{{ errors[0] }}</span>
          <span v-if="!errors[0] && attrs.tip" class="c-form-item__tip">
            {{ attrs.tip }}
          </span>
        </template>
        <slot v-for="name in slots.names" :name="name" v-bind="scope" :key="name"></slot>
      </template>
    </FormItem>
  </Field>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from 'vue'
import {
  FormItemAdapter,
  FormItemBindsOmitKeys,
  FORM_ITEM_DEFAULT,
  formItemSlots,
} from './form-item.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useFormItem } from './form-item.use'
import { FormItem } from 'ant-design-vue'
import { formItemProps } from 'ant-design-vue/lib/form'
import { dasherize } from '@/core/utils/string'
import Input from '../input/input.vue'
import InputNumber from '../input-number/input-number.vue'
import { Field } from 'vee-validate'
import DatePicker from '../date-picker/date-picker.vue'
import Select from '../select/select.vue'
import RangePicker from '../range-picker/range-picker.vue'
import TimePicker from '../time-picker/time-picker.vue'
import TimeRangePicker from '../time-range-picker/time-range-picker.vue'
import Checkbox from '../checkbox/checkbox.vue'
import CheckboxGroup from '../checkbox-group/checkbox-group.vue'
import Radio from '../radio/radio.vue'
import RadioGroup from '../radio-group/radio-group.vue'
import Cascader from '../cascader/cascader.vue'
import Upload from '../upload/upload.vue'
import InputSearch from '../input-search/input-search.vue'
import Switch from '../switch/switch.vue'
import TreeSelect from '../tree-select/tree-select.vue'
import Textarea from '../textarea/textarea.vue'
import InputPassword from '../input-password/input-password.vue'
import AutoComplete from '../auto-complete/auto-complete.vue'
import InputNumberRange from '../input-number-range/input-number-range.vue'
import ArrayForm from '../array-form/array-form.vue'
import Slider from '../slider/slider.vue'

export default defineComponent({
  name: COMPONENT_NAME.formItem,
  inheritAttrs: false,
  components: {
    FormItem,
    Field,
    Input,
    InputNumber,
    DatePicker,
    Select,
    RangePicker,
    TimePicker,
    TimeRangePicker,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Cascader,
    Upload,
    InputSearch,
    Switch,
    TreeSelect,
    Textarea,
    InputPassword,
    AutoComplete,
    InputNumberRange,
    ArrayForm,
    Slider
},
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<FormItemAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    // 当item位于forms数组时，index表示当前item所在的form在forms中的序号
    formIndex: {
      type: Number,
      default: undefined,
    },
    ...formItemProps,
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.formItem
    const className = dasherize(COMPONENT_NAME.formItem)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<FormItemAdapter>({
      props,
      defaultOption: FORM_ITEM_DEFAULT,
      type,
      omitKeys: FormItemBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, formAttrs, state } = useFormItem({ attrs, props })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: formItemSlots,
    })
    return {
      className,
      attrs,
      binds,
      computedSlots,
      setInner,
      formAttrs,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss">
@import 'src/styles/export.scss';
$namespace: 'c';

@include b(form-item) {
  @include e(item) {
    @include when(content-left) {
      .el-form-item__content {
        text-align: left;
      }
    }
    @include when(content-mid) {
      .el-form-item__content {
        text-align: center;
      }
    }
    @include when(content-right) {
      .el-form-item__content {
        text-align: right;
        align-self: start;
      }
    }
    @include when(error) {
      .el-input__inner {
        border-color: #eb2828;
      }
    }
    @include when(required) {
      .ant-form-item-label label::before {
        display: inline-block;
        margin-right: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
  }

  @include e(error) {
    display: inline;
    position: absolute;
    bottom: -18px;
    left: 8px;
    width: 100%;
    color: red;
    font-size: 12px;
    line-height: 1;
    text-align: left;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @include e(tip) {
    display: inline;
    position: absolute;
    bottom: -15px;
    left: 8px;
    width: 100%;
    color: #aaa;
    font-size: 12px;
    line-height: 1;
    text-align: left;
  }
}
</style>
