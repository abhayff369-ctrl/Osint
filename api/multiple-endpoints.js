// POST endpoint for multiple queries
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  
  const VALID_API_KEYS = ['ABHAY_SINGH_KEY_2024', 'DEMO_KEY_123'];
  
  // API Key check
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !VALID_API_KEYS.includes(apiKey)) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid API Key',
      developer: 'Abhay Singh'
    });
  }
  
  if (req.method === 'POST') {
    const { queries } = req.body;
    if (!queries || !Array.isArray(queries)) {
      return res.status(400).json({ 
        error: 'Please provide queries array',
        developer: 'Abhay Singh'
      });
    }
    
    const results = [];
    for (const q of queries) {
      try {
        const targetUrl = `https://noneusrxleakosintpro.vercel.app/db/TG-@None_usernam3/@None_usernam3/search=${encodeURIComponent(q)}`;
        const response = await fetch(targetUrl);
        const data = await response.json();
        results.push({ query: q, data: data.data || [] });
      } catch (err) {
        results.push({ query: q, error: err.message });
      }
    }
    
    return res.status(200).json({
      success: true,
      developer: 'Abhay Singh',
      results: results
    });
  }
  
  res.status(405).json({ error: 'Method not allowed', developer: 'Abhay Singh' });
}
