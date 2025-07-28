import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LayoutDemo = () => {
  return (
    <div className="space-y-8">
      {/* Container Fluid - Ancho completo sin padding */}
      <section className="bg-blue-50 py-8">
        <div className="container-fluid">
          <Card>
            <CardHeader>
              <CardTitle>Container Fluid</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ancho completo sin padding lateral. Ideal para elementos que necesitan ocupar todo el ancho como imágenes de fondo o gráficos.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Container Full - Ancho completo con padding mínimo */}
      <section className="bg-green-50 py-8">
        <div className="container-full">
          <Card>
            <CardHeader>
              <CardTitle>Container Full</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ancho completo con padding responsivo. Ideal para la mayoría de páginas - aprovecha mejor el espacio disponible.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Container Minimal - Ancho máximo con padding mínimo */}
      <section className="bg-yellow-50 py-8">
        <div className="container-minimal">
          <Card>
            <CardHeader>
              <CardTitle>Container Minimal</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ancho máximo de 7xl con padding mínimo. Bueno para contenido que necesita estar centrado pero sin mucho padding.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Container Max (el anterior) - Para comparación */}
      <section className="bg-red-50 py-8">
        <div className="container-max">
          <Card>
            <CardHeader>
              <CardTitle>Container Max (Anterior)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>El contenedor anterior con más padding. Comparar con las opciones de arriba.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tailwind Container por defecto */}
      <section className="bg-purple-50 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Container Tailwind (por defecto)</CardTitle>
            </CardHeader>
            <CardContent>
              <p>El container estándar de Tailwind con padding actualizado (menos restrictivo que antes).</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LayoutDemo;
