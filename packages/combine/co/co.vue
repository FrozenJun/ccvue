<template>
  <div :class="className">
    <div class="co__left">
      <!-- <p class="co__page-name">{{ currentName }}</p> -->
      <Button
        v-for="(button, index) in attrs.selectButtons"
        :key="index"
        :c="setInner(button)"
      ></Button>
      <Button
        v-for="(operate, index) in attrs.operateButtons"
        :key="index"
        :c="setInner(operate.button)"
      >
        <template #icon-add><PlusOutlined></PlusOutlined></template>
      </Button>
    </div>
    <div class="co__right">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'
import { CoAdapter, CoBindsOmitKeys, CO_DEFAULT, coSlots } from './co.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCo } from './co.use'
import { dasherize } from '@/core/utils/string'
import Button from '@/core/base/button/button.vue'
import { PlusOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: COMPONENT_NAME.co,
  inheritAttrs: false,
  emits: ['output-change'],
  components: { Button, PlusOutlined },
  props: {
    c: {
      type: Object as PropType<CoAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.co
    const className = dasherize(COMPONENT_NAME.co)
    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CoAdapter>({
      props,
      defaultOption: CO_DEFAULT,
      type,
      omitKeys: CoBindsOmitKeys,
    })
    /** 组件输出 */
    const { output, currentName } = useCo({ attrs })
    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })
    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: coSlots,
    })
    return { className, attrs, binds, computedSlots, setInner, currentName }
  },
})
</script>

<style lang="scss">
@import 'src/styles/export.scss';

@include b(co) {
  display: flex;
  padding: 15px 20px;
  justify-content: space-between;
  align-items: center;
  @include e(left) {
    .c-button {
      margin-right: 20px;
    }
    @include e(page-name) {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 0;
      line-height: 22px;
    }
  }
  @include e(right) {
    margin-right: 20px;
    .c-button {
      margin-right: 20px;
    }
  }
}
</style>
