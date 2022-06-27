<template>
  <Table
    :class="className"
    :ref="$options.name"
    :c="attrs"
    :key="attrs.dataSourceAsync?.data?.length"
  >
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="!column.type || column.type === 'text'">
        <!-- 枚举 column -->
        <template
          v-if="column.enumTypes && column.enumTypes.length"
          >{{ (column.enumTypes.find((i: any) => i.value === text) || {}).label }}</template
        >
        <!-- 时间 column -->
        <template v-else-if="column.format">{{
          text ? dayjs(new Date(text)).format(column.format) : ''
        }}</template>
        <!-- handler column -->
        <template v-else-if="column.textHandler">{{
          column.textHandler({ column, text, record, index })
        }}</template>
        <!-- 默认字符串 column -->
        <template v-else>{{ text }}</template>
      </template>
      <template v-else-if="column.type === 'image'">
        <a-popover trigger="hover" placement="right">
          <!-- 直接暴露Image组件popover组件会失效，这里加一个span -->
          <span>
            <Image
              class="ct__image"
              :c="setInner({ src: text, ...(column.image || {}), ...CT_IMAGE })"
            ></Image>
          </span>
          <template #content>
            <img class="ct__image-popover" :src="text" />
          </template>
        </a-popover>
      </template>
      <template v-else-if="column.type === 'images'">
        <ImagePreviewGroup>
          <template v-for="(src, index) in text" :key="index">
            <a-popover trigger="hover" placement="right">
              <span v-show="!column.onlyShowFirstImage || index === 0">
                <Image
                  class="ct__image"
                  :c="setInner({ src, ...(column.image || {}), ...CT_IMAGE })"
                ></Image>
              </span>
              <template #content>
                <img class="ct__image-popover" :src="src" />
              </template>
            </a-popover>
          </template>
        </ImagePreviewGroup>
      </template>
      <template v-else-if="column.type === 'index' && attrs.pagination">
        {{ (attrs.pagination!.current - 1) * attrs.pagination!.pageSize + index + 1 }}
      </template>
      <template v-else-if="column.type === 'convert' && typeof column.convertHandle === 'function'">
        <template v-if="!column.asyncData && !column.asyncData.api">
          {{ column.convertHandle({ column, text, record, index }) }}
        </template>
        <template v-else-if="!!column.asyncData.data">
          {{ column.convertHandle({ column, text, record, index }, column.asyncData) }}
        </template>
      </template>
      <template v-else-if="column.type === 'operate' && typeof column.operateRender === 'function'">
        <template
          v-for="(operate, no) in generateOperates({
            column,
            text,
            record,
            index,
          })"
          :key="no"
        >
          <Popconfirm
            v-if="operate.isDanger && operate.button.visible"
            :c="setInner(operate.popconfirm)"
          >
            <a class="ct__operate-button is-danger" @click="operate.button.onClick">{{
              operate.button.text
            }}</a>
          </Popconfirm>

          <a
            v-if="!operate.isDanger && operate.button.visible"
            @click="operate.button.onClick"
            class="ct__operate-button"
            >{{ operate.button.text }}</a
          >

          <a-divider
            v-if="
              no !==
                generateOperates({
                  column,
                  text,
                  record,
                  index,
                }).length -
                  1 && operate.button.visible
            "
            type="vertical"
          />
        </template>
      </template>
      <template v-else-if="column.type === 'slot'">
        <slot :name="column.slotName" v-bind="{ column, text, record, index }"></slot>
      </template>
    </template>

    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"></slot>
    </template>
  </Table>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, PropType, reactive, ref } from 'vue'
import { CtAdapter, CtBindsOmitKeys, CT_DEFAULT, ctSlots, CT_IMAGE } from './ct.adapter'
import { COMPONENT_NAME, COMPONENT_TYPE } from '../../utils/constants/component'
import { useProvider } from '../../utils/hooks/useProvider'
import { useCommonSetup } from '../../utils/hooks/useCommonSetup'
import { useComputeAttrs } from '../../utils/hooks/useComputeAttrs'
import { useCt } from './ct.use'
import { dasherize } from '@/core/utils/string'
import Table from '@/core/base/table/table.vue'
import Image from '@/core/base/image/image.vue'
import Button from '@/core/base/button/button.vue'
import Popconfirm from '../../base/popconfirm/popconfirm.vue'
import dayjs from 'dayjs'
import { ImagePreviewGroup } from 'ant-design-vue'
import Modal from '@/core/base/modal/modal.vue'

export default defineComponent({
  name: COMPONENT_NAME.ct,
  inheritAttrs: false,
  components: { Table, Image, Button, Popconfirm, ImagePreviewGroup, Modal },
  emits: ['output-change'],
  props: {
    c: {
      type: Object as PropType<CtAdapter>,
      default: () => reactive({}),
    },
    n: {
      type: String,
    },
  },
  setup(props, ctx) {
    const type = COMPONENT_TYPE.ct
    const className = dasherize(COMPONENT_NAME.ct)

    /** 合并配置，获取attrs */
    const { attrs, binds } = useComputeAttrs<CtAdapter>({
      props,
      defaultOption: CT_DEFAULT,
      type,
      omitKeys: CtBindsOmitKeys,
    })

    /** 组件输出 */
    const { output, generateOperates } = useCt({ attrs })

    /** 注册、注销组件 */
    useProvider({ attrs, output, type, ctx })

    /** 组件通用setup */
    const { computedSlots, setInner } = useCommonSetup({
      attrs,
      output,
      slotTypes: ctSlots,
    })
    return {
      className,
      attrs,
      binds,
      computedSlots,
      CT_IMAGE,
      generateOperates,
      setInner,
      dayjs,
    }
  },
})
</script>

<style lang="scss">
@import 'src/styles/export.scss';

@include b(ct) {
  .ant-spin-nested-loading {
    height: 100%;
  }
  .ant-spin-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .ant-table {
    overflow-y: auto;
  }

  @include e(image) {
    cursor: pointer;
    vertical-align: middle;
    width: 30px;
    height: 30px;
    object-fit: contain;
  }
  @include e(image-popover) {
    width: 90px;
    height: 90px;
    object-fit: contain;
  }

  @include e(operate-button) {
    color: #1890ff;
    &:hover,
    &:visited,
    &:focus,
    &:active {
      color: #1890ff;
    }

    @include when(danger) {
      color: #ff7875;
    }
  }
}
</style>
