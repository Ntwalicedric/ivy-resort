// Simple test to isolate the Supabase issue
export default async function handler(req, res) {
  try {
    console.log('Simple test function called');
    
    // Test environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase URL exists:', !!supabaseUrl);
    console.log('Supabase Service Key exists:', !!supabaseServiceKey);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey
      });
    }
    
    // Test Supabase client creation
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      console.log('Supabase client created successfully');
      
      // Test a simple query
      const { data, error } = await supabase.from('reservations').select('count').limit(1);
      
      if (error) {
        console.error('Supabase query error:', error);
        return res.status(500).json({ 
          error: 'Supabase query failed',
          details: error.message
        });
      }
      
      console.log('Supabase query successful');
      return res.status(200).json({ 
        success: true, 
        message: 'Supabase connection working',
        data: data
      });
      
    } catch (supabaseError) {
      console.error('Supabase client error:', supabaseError);
      return res.status(500).json({ 
        error: 'Supabase client creation failed',
        details: supabaseError.message
      });
    }
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Handler failed',
      details: error.message
    });
  }
}
