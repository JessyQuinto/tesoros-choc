// Script simple para probar la conexión al backend
const testBackend = async () => {
  try {
    console.log('🧪 Probando conexión al backend...');
    
    const response = await fetch('http://localhost:3000/');
    const data = await response.json();
    
    console.log('✅ Backend responde correctamente:', data);
    
    // Probar también el endpoint de auth
    const authResponse = await fetch('http://localhost:3000/api/auth/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({})
    });
    
    console.log('🔐 Auth endpoint status:', authResponse.status);
    
  } catch (error) {
    console.error('❌ Error conectando al backend:', error.message);
  }
};

testBackend(); 