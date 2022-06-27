import { createMousseRunner } from '../../utils/testing'
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing'

describe('Schematics: core', () => {
  let runner: SchematicTestRunner
  let tree: UnitTestTree

  beforeEach(async () => {
    runner = createMousseRunner()
    tree = await runner
      .runSchematicAsync('core', { name: 'test' }, tree)
      .toPromise()
  })

  it('should be generate dependent page', () => {})
})
