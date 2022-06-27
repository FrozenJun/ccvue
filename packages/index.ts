import { emit, reveice } from './utils/service/provider.service'
import { CvueOptions, setConfig } from './utils/config'
import './utils/lodash'
import { App } from 'vue'
import './utils/vee-validate'
import _ from 'lodash'

import * as AntDesign from './ant-design'
import * as Combine from './combine'
export * from './ant-design'
export * from './combine'

const components = [..._.values(AntDesign), ..._.values(Combine)]

const install = function (app: App, opt: CvueOptions) {
  setConfig(opt)
  components.forEach((component) => {
    app.component(component.name, component)
  })
}

export { install, emit, reveice }
export default {
  install,
}
