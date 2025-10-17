// Basic test without Supabase
async function handler(req, res) {
  try {
    console.log('Basic test handler called');
    
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    return res.status(200).json({
      success: true,
      message: 'Basic test working',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Basic test error:', error)
    return res.status(500).json({ 
      error: 'Basic test failed',
      message: error.message 
    })
  }
}

module.exports = handler
