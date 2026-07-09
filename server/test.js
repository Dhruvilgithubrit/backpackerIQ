async function test() {
  try {
    const response = await fetch('http://localhost:3001/api/search-accommodations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: 'Goa',
        budget: '₹10,000 (Backpacker)',
        travelers: 'Solo'
      })
    });
    
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
