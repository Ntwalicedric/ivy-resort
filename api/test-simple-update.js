// Simple update test
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  try {
    console.log('Simple update test called')
    
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    // Test simple update with just status
    const { data, error } = await supabase
      .from('reservations')
      .update({ status: 'test-update' })
      .eq('id', 16)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Simple update test successful',
      data: data
    })
    
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ 
      error: 'Handler failed',
      message: error.message 
    })
  }
}
