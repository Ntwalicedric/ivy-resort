// Minimal test to isolate the issue
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function handler(req, res) {
  try {
    console.log('Minimal test handler called');
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    // Simple query
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .limit(5)

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }

    console.log('Query successful, data length:', data?.length)
    
    res.status(200).json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })
    
  } catch (error) {
    console.error('Handler error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}

module.exports = handler
