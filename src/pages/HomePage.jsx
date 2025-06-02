
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Target, BarChart2, Zap, CheckCircle, UtensilsCrossed, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, delay }) => {
  const IconComponent = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: delay * 0.2 }}
      className="bg-card p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-border/50 flex flex-col items-center text-center"
    >
      <div className="p-4 bg-primary/10 rounded-full mb-4">
        <IconComponent className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};

const StepCard = ({ number, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: delay * 0.2 }}
      className="flex flex-col items-center text-center p-6"
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};

const HomePage = () => {
  const features = [
    { icon: Target, title: 'Dietas Personalizadas', description: 'Planos alimentares criados sob medida para seus objetivos e restrições.', delay: 0 },
    { icon: Brain, title: 'Inteligência Artificial', description: 'Nossa IA avançada monta sua dieta de forma otimizada e balanceada.', delay: 1 },
    { icon: BarChart2, title: 'Acompanhe seu Progresso', description: 'Monitore sua evolução com gráficos de peso, IMC e mais.', delay: 2 },
    { icon: UtensilsCrossed, title: 'Substituições Inteligentes', description: 'Varie sua alimentação com sugestões de alimentos equivalentes.', delay: 3 },
    { icon: Zap, title: 'Receitas Deliciosas', description: 'Inspire-se com receitas saudáveis e fáceis de preparar.', delay: 4 },
    { icon: CheckCircle, title: 'Flexibilidade Total', description: 'Ajuste sua dieta conforme suas necessidades e preferências a qualquer momento.', delay: 5 },
  ];

  const steps = [
    { number: 1, title: 'Cadastre-se Rapidamente', description: 'Crie sua conta em poucos minutos e comece sua jornada.', delay: 0 },
    { number: 2, title: 'Informe Seus Dados', description: 'Compartilhe suas informações, metas e restrições alimentares.', delay: 1 },
    { number: 3, title: 'Receba Sua Dieta', description: 'Nossa IA monta um plano alimentar exclusivo para você.', delay: 2 },
    { number: 4, title: 'Evolua Conosco', description: 'Siga o plano, registre seu progresso e alcance resultados incríveis.', delay: 3 },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10">
        <div className="absolute inset-0 opacity-50 dark:opacity-30">
          {/* Decorative background elements can go here */}
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6"
          >
            <span className="block">Transforme Sua Alimentação,</span>
            <span className="gradient-text block mt-2">Transforme Sua Vida!</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Crie dietas personalizadas com inteligência artificial e alcance seus objetivos de saúde e bem-estar de forma simples e eficaz.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: 'spring', stiffness: 100 }}
          >
            <Button size="lg" className="text-lg px-10 py-6 shadow-lg hover:shadow-primary/40 transition-shadow" asChild>
              <Link to="/register">Criar Minha Dieta Grátis!</Link>
            </Button>
          </motion.div>
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <img  
              className="mx-auto rounded-xl shadow-2xl w-full max-w-3xl aspect-video object-cover" 
              alt="Prato de comida saudável e colorida com vegetais frescos"
             src="https://images.unsplash.com/photo-1542814784-133212a2e378" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y:20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Seu Planejador de Dietas <span className="gradient-text">Inteligente</span></h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Descubra como o NutriPlanner pode revolucionar sua jornada para uma vida mais saudável.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y:20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comece em <span className="gradient-text">4 Passos Simples</span></h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              É fácil e rápido ter sua dieta personalizada pronta para transformar sua saúde.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-green-600 to-teal-600 text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Pronto para dar o primeiro passo?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90"
          >
            Junte-se a milhares de pessoas que estão transformando suas vidas com o NutriPlanner. Sua jornada para uma vida mais saudável começa agora!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 shadow-xl hover:bg-secondary/90 transition-all" asChild>
               <Link to="/register">Quero Minha Dieta Personalizada!</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
