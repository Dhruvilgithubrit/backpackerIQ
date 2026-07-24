import fs from 'fs'
import { destinations } from './src/data/destinationsData.js'

function escapeSql(str) {
  if (typeof str !== 'string') return str
  return str.replace(/'/g, "''")
}

function formatArray(arr) {
  if (!arr || !arr.length) return "'{}'"
  const inner = arr.map(a => `"${escapeSql(a)}"`).join(',')
  return `'{${inner}}'`
}

const chunks = []
const BATCH_SIZE = 100

for (let i = 0; i < destinations.length; i += BATCH_SIZE) {
  const batch = destinations.slice(i, i + BATCH_SIZE)
  
  const values = batch.map(d => {
    return `(
      '${escapeSql(d.name)}',
      '${escapeSql(d.state)}',
      ${d.latitude},
      ${d.longitude},
      ${formatArray(d.category)},
      ${formatArray(d.season_best)},
      ${d.budget_range ? `'${escapeSql(d.budget_range)}'` : 'NULL'},
      ${d.image_url ? `'${escapeSql(d.image_url)}'` : 'NULL'},
      ${d.description ? `'${escapeSql(d.description)}'` : 'NULL'},
      ${formatArray(d.popular_activities)},
      ${d.best_months ? `'${escapeSql(d.best_months)}'` : 'NULL'},
      ${d.rating || 4.5},
      ${d.review_count || 0}
    )`
  }).join(',\n')

  const sql = `INSERT INTO destinations (
    name, state, latitude, longitude, category, season_best, budget_range,
    image_url, description, popular_activities, best_months, rating, review_count
  ) VALUES \n${values};`
  
  chunks.push(sql)
}

fs.writeFileSync('seed.sql', chunks.join('\n\n'))
console.log(`Generated seed.sql with ${destinations.length} records in ${chunks.length} batches.`)
