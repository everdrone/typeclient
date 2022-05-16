import { CollectionSchema, SearchParams } from './store/types'
import { getAllFieldsOfType } from './store/common'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sampleItems(array: any[], items: number) {
  const shuffled = array.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, items)
}

export default function generateDefaultSearchParams(schema: CollectionSchema) {
  const result: SearchParams = {
    q: '*',
    // all string fields
    query_by: getAllFieldsOfType(schema, ['string', 'string[]'])
      .map(field => field.name)
      .join(', '),
    // all string fields with random weights
    query_by_weights: getAllFieldsOfType(schema, ['string', 'string[]'])
      .map(() => Math.ceil(Math.random() * 5))
      .join(', '),
    sort_by: '_text_match:desc',
    // from zero to two random string fields
    group_by: sampleItems(
      getAllFieldsOfType(schema, ['string', 'string[]'])
        .filter(field => field.facet)
        .map(field => field.name),
      Math.floor(Math.random() * 2)
    ).join(', '),
    // from zero to two random string fields
    facet_by: sampleItems(
      getAllFieldsOfType(schema, ['string', 'string[]'])
        .filter(field => field.facet)
        .map(fields => fields.name),
      Math.floor(Math.random() * 2)
    ).join(', '),
    exhaustive_search: true,
    prioritize_exact_match: true,
  }

  return result
}
