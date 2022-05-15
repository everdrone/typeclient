/*

{
  "q": "hai",
  "query_by": "name,alt_names,region.name,region.alt_names,subregion.name,subregion.alt_names",
  "query_by_weights": "3,3,2,2,1,1",
  "exclude_fields": "alt_names,region.alt_names,subregion.alt_names",
  "sort_by": "location(48.853, 2.344):asc,_text_match:desc",
  "group_by": "country.name,region.name",
  "exhaustive_search": true,
  "prioritize_exact_match": true,
  "facet_by": "timezone",
  "per_page": 20
}

*/

import { CollectionSchema, SearchParams } from './store/types'
import { getAllFieldsOfType } from './store/common'

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
