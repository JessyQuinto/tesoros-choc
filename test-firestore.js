// Script para probar la conexión con Firestore
const testFirestore = async () => {
  try {
    console.log('🧪 Probando conexión con Firestore...');
    
    // Probar el endpoint de prueba
    const response = await fetch('http://localhost:3000/test-firestore');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Firestore está conectado correctamente');
      console.log('📄 Datos de prueba:', data.data);
    } else {
      console.error('❌ Error en Firestore:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error conectando al backend:', error.message);
  }
};

testFirestore(); 