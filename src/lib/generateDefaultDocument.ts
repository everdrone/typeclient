import { FieldType, CollectionSchema } from './store/types'

function getFieldDefaultValue(type: FieldType): any {
  switch (type) {
    case 'string':
      return ''
    case 'int32':
    case 'int64':
      return 0
    case 'float':
      return 0.0
    case 'bool':
      return false
    case 'geopoint':
      return []
    case 'geopoint[]':
      return [[]]
    case 'string*':
      return ''
    case 'auto':
      return ''
    default:
      return []
  }
}

export default function generateDefaultDocument(collection: CollectionSchema): any {
  const result: any = {}

  collection.fields.map(field => {
    if (!field.optional) {
      result[field.name] = getFieldDefaultValue(field.type)
    }
  })

  return result
}
