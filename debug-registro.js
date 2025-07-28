// Script de debugging para probar el registro
// Abre las herramientas de desarrollador (F12) y pega este código en la consola

console.log('🔧 DEBUGGING REGISTRO DE COMPRADORES');

// Monitorear llamadas a Firebase
const originalSetDoc = window.firebase?.firestore?.setDoc;
if (originalSetDoc) {
  window.firebase.firestore.setDoc = function(...args) {
    console.log('📝 setDoc llamado con:', args);
    return originalSetDoc.apply(this, args);
  };
}

// Monitorear errores de registro
window.addEventListener('unhandledrejection', function(event) {
  console.error('❌ Error no manejado:', event.reason);
});

// Función de prueba del registro
async function testRegisterBuyer() {
  console.log('🧪 Iniciando prueba de registro para comprador...');
  
  const testData = {
    name: 'Test Usuario Comprador',
    email: 'test.comprador@example.com',
    password: 'test123456',
    role: 'buyer',
    phone: '3145376069',
    address: 'cll 27 - N20-19 Rosales'
  };
  
  try {
    // Obtener el servicio de auth del contexto global
    const authService = window.__authService;
    if (!authService) {
      console.error('❌ AuthService no disponible en window.__authService');
      return;
    }
    
    const result = await authService.register(testData);
    console.log('✅ Registro exitoso:', result);
    
  } catch (error) {
    console.error('❌ Error en registro de prueba:', error);
  }
}

// Exponer función para uso manual
window.testRegisterBuyer = testRegisterBuyer;

console.log('✅ Script de debugging cargado. Usa testRegisterBuyer() para probar.');
