<template>
  <ul :class="className" :ref="$options.name">
    <li class="c-array-form__item" v-for="(form, index) in formList" :key="index">
      <div :class="['c-array-form__form', attrs.sort && 'is-sort']">
        <FormItem
          v-for="(item, no) in form.formItems"
          :key="no"
          :c="setInner(item)"
          :formIndex="index"
        >
          <template v-for="(_, slot) in $slots" #[slot]="{ scope }">
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </FormItem>
        <arrow-down-outlined
          v-show="attrs.sort && index !== formList.length - 1"
          class="c-array-form__icon down"
          @click="down(index)"
        />
        <arrow-up-outlined
          v-show="attrs.sort && index !== 0"
          class="c-array-form__icon up"
          @click="up(index)"
        />
        <delete-outlined
          v-show="index + 1 > min"
          class="c-array-form__icon"
          @click="deleteItem(index)"
        />
      </div>
    </li>

    <li class="c-array-form__add" v-show="!hasMax || formList.length < max">
      <p class="content" @click="addItem">
        <plus-circle-outlined />
        添加更多信息
      </p>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType, reactive, toRefs } from 'vue'
import {
  ArrayFormAdapter,
  ArrayFormBindsOmitKeys,
  ARRAY_FORM_DEFAULT,
  arrayFormSlots,
} from './array-form.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useArrayForm } from './array-form.use'
import { dasherize } from '@/core/utils/string'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons-vue'

export default defineComponent({
  name: COMPONENT_NAME.arrayForm,
  inheritAttrs: false,
  components: {
    FormItem: defineAsyncComponent(() => import('../form-item/form-item.vue')), // 解决循环引用问题
    ArrowUpOutlined,
    ArrowDownOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
  },
  emits: ['output-change', 'update:modelValue'],
  props: {
    c: {
      type: Object as PropType<ArrayFormAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.arrayForm
    const className = dasherize(COMPONENT_NAME.arrayForm)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<ArrayFormAdapter>({
      props,
      defaultOption: ARRAY_FORM_DEFAULT,
      type,
      omitKeys: ArrayFormBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, state, addItem, deleteItem, up, down, min, max, hasMax } = useArrayForm({
      attrs,
      ctx,
      props,
    })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: arrayFormSlots,
    })

    return {
      className,
      attrs,
      binds,
      computedSlots,
      setInner,
      addItem,
      deleteItem,
      up,
      down,
      min,
      max,
      hasMax,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss">
@import 'src/styles/export.scss';
$namespace: 'c';

@include b(array-form) {
  width: 100%;
  background: #dceafa;
  @include e(item) {
    width: 100%;
    padding-right: 10px;
    padding-top: 10px;
    @include e(form) {
      position: relative;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-left: 8px;
      padding-right: 28px;
      @include when(sort) {
        padding-right: 60px;
      }

      @include e(icon) {
        position: absolute;
        right: 0;
        top: 25%;
        transform: translateY(-50%);
        transition: color 0.3s;
        font-size: 18px;
        color: #3c8ff5;
        cursor: pointer;
        &:hover {
          opacity: 0.5;
        }
        &.down {
          right: 36px;
        }
        &.up {
          right: 18px;
        }
      }
    }
  }

  @include e(add) {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #3c8ff5;
    @include layout();
    @include layout-align(center, center);

    .content {
      cursor: pointer;
      margin-bottom: 0;
      i {
        margin-right: 3px;
      }
    }
  }
}
</style>
