
import React from 'react';
import { Leaf, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-800 border-t border-border mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">NutriPlanner</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Transformando sua saúde com dietas personalizadas e inteligentes.
            </p>
          </div>
          
          <div>
            <p className="font-semibold text-foreground mb-4">Links Úteis</p>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Termos de Serviço</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-4">Siga-nos</p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20}/></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20}/></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20}/></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} NutriPlanner Pessoal. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
