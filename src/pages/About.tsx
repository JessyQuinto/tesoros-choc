import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Award, Leaf } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "María Elena Mosquera",
      role: "Coordinadora Regional",
      location: "Quibdó, Chocó",
      specialty: "Desarrollo comunitario",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Carlos Andrés Palacios",
      role: "Especialista en Artesanías",
      location: "Istmina, Chocó",
      specialty: "Certificación de productos",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Rosa Mena Córdoba",
      role: "Coordinadora de Ventas",
      location: "Condoto, Chocó",
      specialty: "Marketing digital",
      image: "/api/placeholder/150/150"
    }
  ];

  const stats = [
    { label: "Artesanos Registrados", value: "150+", icon: Users },
    { label: "Productos Únicos", value: "500+", icon: Award },
    { label: "Municipios del Chocó", value: "15", icon: MapPin },
    { label: "Familias Beneficiadas", value: "300+", icon: Leaf }
  ];

  return (
    <div><div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-choco-earth to-choco-wood bg-clip-text text-transparent">
            Sobre Tesoros Chocó
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Somos un marketplace que conecta la riqueza artesanal del Chocó con el mundo, 
            promoviendo el comercio justo y el desarrollo sostenible de nuestras comunidades campesinas.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card className="border-l-4 border-l-choco-earth">
            <CardHeader>
              <CardTitle className="text-2xl text-choco-earth">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Preservar y promover las tradiciones artesanales del Chocó, generando oportunidades 
                económicas justas para nuestros campesinos y artesanos, mientras conectamos sus 
                creaciones únicas con compradores que valoran la autenticidad y la cultura.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-choco-green">
            <CardHeader>
              <CardTitle className="text-2xl text-choco-green">Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Ser la plataforma líder en Colombia para el comercio de productos artesanales 
                del Pacífico, reconocida por impulsar el desarrollo sostenible de las comunidades 
                rurales y preservar el patrimonio cultural de nuestra región.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestro Impacto</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-choco-earth" />
                  <div className="text-3xl font-bold text-choco-earth mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-choco-earth rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Sostenibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Promovemos prácticas que respetan el medio ambiente y aseguran 
                  la viabilidad a largo plazo de nuestras comunidades.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-choco-green rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fortalecemos los lazos comunitarios y trabajamos juntos para 
                  el desarrollo colectivo de nuestros artesanos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-choco-gold rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-choco-earth" />
                </div>
                <CardTitle>Autenticidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Garantizamos que cada producto refleje las técnicas y tradiciones 
                  ancestrales de nuestras comunidades.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-2">{member.role}</Badge>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    {member.location}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div></div>
  );
};

export default About;