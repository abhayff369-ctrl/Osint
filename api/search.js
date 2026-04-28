// ============================================
// API KEY CONFIGURATION
// ============================================
const VALID_API_KEYS = [
  'ABHAY_SINGH_KEY_2024',
  'DEMO_KEY_123',
  'TEST_KEY_456'
];

function isValidApiKey(apiKey) {
  return VALID_API_KEYS.includes(apiKey);
}

// ============================================
// MAIN API HANDLER
// ============================================
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ============================================
  // API KEY AUTHENTICATION
  // ============================================
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API Key Required',
      message: 'Please provide API key in header: X-API-Key',
      developer: 'Abhay Singh'
    });
  }
  
  if (!isValidApiKey(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API Key',
      message: 'The API key you provided is not valid',
      developer: 'Abhay Singh'
    });
  }

  // ============================================
  // QUERY PARAMETER CHECK
  // ============================================
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Missing query parameter',
      example: '/api/search?q=QUERY',
      developer: 'Abhay Singh'
    });
  }

  try {
    // ============================================
    // SCRAPE SOURCE API
    // ============================================
    const targetUrl = `https://noneusrxleakosintpro.vercel.app/db/TG-@None_usernam3/@None_usernam3/search=${encodeURIComponent(q)}`;
    
    console.log(`[${new Date().toISOString()}] Query: ${q}`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'AbhaySingh-API/1.0',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Source API error: ${response.status}`);
    }
    
    const sourceData = await response.json();
    
    // ============================================
    // SEND RESPONSE - WITHOUT channel AND original_developer
    // ============================================
    res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      contact: '@abhay_singh_official',
      api_version: '3.0.0',
      query: q,
      timestamp: new Date().toISOString(),
      total_items: sourceData.data ? sourceData.data.length : 0,
      // FULL DATA - jo bhi source se aaya (channel aur developer remove kar diye)
      data: sourceData.data || []
    });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      query: q,
      developer: 'Abhay Singh'
    });
  }
}
