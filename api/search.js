// ============================================
// API Key Configuration
// ============================================
const VALID_API_KEYS = [
  'ABHAY_SINGH_KEY_2024',
  'DEMO_KEY_123',
  'TEST_KEY_456'
];

// Function to validate API key
function isValidApiKey(apiKey) {
  return VALID_API_KEYS.includes(apiKey);
}

// ============================================
// Main Handler
// ============================================
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ============================================
  // API Key Authentication
  // ============================================
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API Key required',
      message: 'Please provide API key in header: X-API-Key or ?api_key= parameter',
      developer: 'Abhay Singh'
    });
  }
  
  if (!isValidApiKey(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API Key',
      message: 'The provided API key is not valid',
      developer: 'Abhay Singh'
    });
  }

  // ============================================
  // Query Parameter
  // ============================================
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Missing query parameter "q"',
      example: '/api/search?q=QUERY',
      developer: 'Abhay Singh'
    });
  }

  try {
    // ============================================
    // Scraping Target URL
    // ============================================
    const targetUrl = `https://noneusrxleakosintpro.vercel.app/db/TG-@None_usernam3/@None_usernam3/search=${encodeURIComponent(q)}`;
    
    console.log(`[${new Date().toISOString()}] Fetching: ${targetUrl}`);
    console.log(`[${new Date().toISOString()}] API Key Used: ${apiKey.substring(0, 8)}...`);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'AbhaySingh-Scraper/1.0',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Source API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract data array
    const extractedData = data.data || [];
    
    // Filter passwords only
    const passwords = extractedData.filter(item => 
      typeof item === 'string' && item.toLowerCase().startsWith('password:')
    );
    
    // ============================================
    // Response with Developer Credit
    // ============================================
    res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      developer_contact: '@abhay_singh_official',
      api_version: '1.0.0',
      query: q,
      timestamp: new Date().toISOString(),
      totalResults: extractedData.length,
      passwordCount: passwords.length,
      data: extractedData,
      passwords: passwords
    });
    
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      query: q,
      developer: 'Abhay Singh',
      message: 'Please contact @abhay_singh_official for support'
    });
  }
}
