import { createClient } from '@supabase/supabase-js'

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(url, key)

  // Set all prices to 0 (no individual pricing)
  const { data: allCourses } = await supabase.from('courses').select('id')
  const ids = (allCourses || []).map((c: { id: string }) => c.id)
  if (ids.length > 0) {
    const { error: priceError } = await supabase
      .from('courses')
      .update({ price: 0 })
      .in('id', ids)
    if (priceError) console.error('Price update error:', priceError.message)
    else console.log(`✓ All ${ids.length} prices set to 0`)
  }
}

main()