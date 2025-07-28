import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const pagesDir = './src/pages';

// Obtener todos los archivos .tsx en el directorio pages
const files = readdirSync(pagesDir).filter(file => file.endsWith('.tsx'));

console.log(`Procesando ${files.length} archivos...`);

files.forEach(file => {
  const filePath = join(pagesDir, file);
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;

  console.log(`\nProcesando: ${file}`);

  // Remover imports de Header y Footer
  const headerImportRegex = /import\s+\{\s*Header\s*\}\s+from\s+['"]@\/components\/Layout\/Header['"];\s*\n?/g;
  const footerImportRegex = /import\s+\{\s*Footer\s*\}\s+from\s+['"]@\/components\/Layout\/Footer['"];\s*\n?/g;
  
  if (headerImportRegex.test(content)) {
    content = content.replace(headerImportRegex, '');
    console.log('  ✅ Removido import de Header');
    modified = true;
  }

  if (footerImportRegex.test(content)) {
    content = content.replace(footerImportRegex, '');
    console.log('  ✅ Removido import de Footer');
    modified = true;
  }

  // Remover elementos JSX de Header y Footer en estructuras comunes
  // Patrón 1: <div className="min-h-screen..."><Header />...contenido...<Footer /></div>
  const fullLayoutRegex = /<div\s+className="min-h-screen[^"]*">\s*<Header\s*\/>\s*(.*?)\s*<Footer\s*\/>\s*<\/div>/gs;
  if (fullLayoutRegex.test(content)) {
    content = content.replace(fullLayoutRegex, (match, innerContent) => {
      console.log('  ✅ Removido layout completo con Header/Footer');
      return `<div>${innerContent}</div>`;
    });
    modified = true;
  }

  // Patrón 2: Solo <Header /> y <Footer /> sueltos
  const headerJsxRegex = /\s*<Header\s*\/>\s*\n?/g;
  const footerJsxRegex = /\s*<Footer\s*\/>\s*\n?/g;

  if (headerJsxRegex.test(content)) {
    content = content.replace(headerJsxRegex, '');
    console.log('  ✅ Removido JSX de Header');
    modified = true;
  }

  if (footerJsxRegex.test(content)) {
    content = content.replace(footerJsxRegex, '');
    console.log('  ✅ Removido JSX de Footer');
    modified = true;
  }

  if (modified) {
    writeFileSync(filePath, content);
    console.log(`  💾 Archivo guardado: ${file}`);
  } else {
    console.log(`  ⏭️  Sin cambios: ${file}`);
  }
});

console.log('\n🎉 Limpieza completada!');
