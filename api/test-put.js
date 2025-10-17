// Simple PUT test
export default async function handler(req, res) {
  try {
    console.log('PUT test handler called:', { method: req.method, url: req.url })
    
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    return res.status(200).json({
      success: true,
      message: 'PUT test working',
      method: req.method,
      url: req.url
    })
    
  } catch (error) {
    console.error('PUT test error:', error)
    return res.status(500).json({ 
      error: 'PUT test failed',
      message: error.message 
    })
  }
}
