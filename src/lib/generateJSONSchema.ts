import { JSONSchema7 } from 'json-schema'
import { FieldType, CollectionSchema } from 'lib/store/types'

function typesenseTypeToJsonType(type: FieldType): JSONSchema7 {
  switch (type) {
    case 'string':
      return {
        type: 'string',
      }
    case 'string[]':
      return {
        type: 'array',
        items: {
          type: 'string',
        },
      }
    case 'int32':
    case 'int64':
      return {
        type: 'integer',
      }
    case 'float':
      return {
        type: 'number',
      }
    case 'int32[]':
    case 'int64[]':
      return {
        type: 'array',
        items: {
          type: 'integer',
        },
      }
    case 'float[]':
      return {
        type: 'array',
        items: {
          type: 'number',
        },
      }
    case 'bool':
      return {
        type: 'boolean',
      }
    case 'bool[]':
      return {
        type: 'array',
        items: {
          type: 'boolean',
        },
      }
    case 'geopoint':
      return {
        type: 'array',
        items: {
          type: 'number',
          minItems: 2,
          maxItems: 2,
        },
      }
    case 'geopoint[]':
      return {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'number',
            minItems: 2,
            maxItems: 2,
          },
        },
      }
    case 'string*':
      return {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
      }
    case 'auto':
      return {
        anyOf: [
          { type: 'string' },
          { type: 'integer' },
          { type: 'number' },
          { type: 'boolean' },
          {
            type: 'array',
            items: {
              anyOf: [{ type: 'string' }, { type: 'integer' }, { type: 'number' }, { type: 'boolean' }],
            },
          },
          {
            type: 'array',
            items: { type: 'number', minItems: 2, maxItems: 2 },
          },
          {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'number', minItems: 2, maxItems: 2 },
            },
          },
        ],
      }
  }
}

export default function generateJSONSchema(collection: CollectionSchema): JSONSchema7 {
  const definition: JSONSchema7 = {
    type: 'object',
    properties: {},
    required: [],
  }

  collection.fields.map(field => {
    definition.properties[field.name] = typesenseTypeToJsonType(field.type)

    if (!field.optional) {
      definition.required.push(field.name)
    }
  })

  return definition
}
