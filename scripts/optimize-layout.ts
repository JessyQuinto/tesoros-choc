import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const pagesDir = './src/pages';

// Obtener todos los archivos .tsx en el directorio pages
const files = readdirSync(pagesDir).filter(file => file.endsWith('.tsx'));

console.log(`Optimizando layout en ${files.length} archivos...`);

files.forEach(file => {
  const filePath = join(pagesDir, file);
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  console.log(`\nProcesando: ${file}`);

  // Reemplazar container mx-auto px-4 con container-full
  const containerRegex = /className="container mx-auto px-4([^"]*)"/g;
  if (containerRegex.test(content)) {
    content = content.replace(containerRegex, 'className="container-full$1"');
    console.log('  ✅ Optimizado container mx-auto px-4');
    modified = true;
  }

  // Reemplazar container-max con container-full para mejor uso del espacio
  const containerMaxRegex = /className="container-max([^"]*)"/g;
  if (containerMaxRegex.test(content)) {
    content = content.replace(containerMaxRegex, 'className="container-full$1"');
    console.log('  ✅ Optimizado container-max');
    modified = true;
  }

  if (modified) {
    writeFileSync(filePath, content);
    console.log(`  💾 Archivo optimizado: ${file}`);
  } else {
    console.log(`  ⏭️  Sin cambios: ${file}`);
  }
});

console.log('\n🎉 Optimización de layout completada!');
