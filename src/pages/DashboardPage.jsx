import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { LineChart, User, Utensils, Target, Edit3, PlusCircle, Info, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [latestDiet, setLatestDiet] = useState(null);
  const [allDietPlans, setAllDietPlans] = useState([]);
  const [progress, setProgress] = useState([]);
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');

  useEffect(() => {
    if (user && user.email) {
      const userDietDataKey = `dietData_${user.email}`;
      const storedData = JSON.parse(localStorage.getItem(userDietDataKey));
      if (storedData && storedData.plans && storedData.plans.length > 0) {
        setAllDietPlans(storedData.plans.sort((a, b) => new Date(b.date) - new Date(a.date))); 
        setLatestDiet(storedData.plans.reduce((latest, plan) => new Date(plan.date) > new Date(latest.date) ? plan : latest, storedData.plans[0]));
        if (storedData.plans[storedData.plans.length - 1]?.formDataUsed?.height) {
          setNewHeight(storedData.plans[storedData.plans.length - 1].formDataUsed.height);
        }
      }
      
      const userProgressKey = `progressData_${user.email}`;
      const storedProgress = JSON.parse(localStorage.getItem(userProgressKey));
      setProgress(storedProgress || []);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleOpenAddProgressModal = () => {
    if (latestDiet && latestDiet.formDataUsed && latestDiet.formDataUsed.height) {
      setNewHeight(latestDiet.formDataUsed.height.toString());
    } else if (progress.length > 0 && progress[progress.length-1].height) {
      setNewHeight(progress[progress.length-1].height.toString());
    } else {
      setNewHeight('');
    }
    setNewWeight('');
    setShowAddProgressModal(true);
  };

  const handleSaveProgress = () => {
    const weight = parseFloat(newWeight);
    const heightCm = parseFloat(newHeight);

    if (isNaN(weight) || weight <= 0) {
      toast({ title: "Entrada inválida", description: "Por favor, insira um peso válido.", variant: "destructive" });
      return;
    }
    if (isNaN(heightCm) || heightCm <= 0) {
      toast({ title: "Entrada inválida", description: "Por favor, insira uma altura válida.", variant: "destructive" });
      return;
    }
    
    const imc = (weight / ((heightCm / 100) ** 2)).toFixed(2);

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: weight,
      height: heightCm, 
      imc: imc,
    };
    const updatedProgress = [...progress, newEntry];
    setProgress(updatedProgress);
    localStorage.setItem(`progressData_${user.email}`, JSON.stringify(updatedProgress));
    toast({ title: "Progresso Adicionado!", description: `Peso ${weight}kg e IMC ${imc} registrados.`, variant: "default" });
    setShowAddProgressModal(false);
    setNewWeight('');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold gradient-text mb-4 md:mb-0">
          Olá, {user.name || user.email}!
        </h1>
        <Button variant="outline" onClick={handleLogout}>Sair</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="shadow-xl hover:shadow-primary/20 transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meu Perfil</CardTitle>
              <User className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.name || 'Usuário'}</div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </CardContent>
            <CardContent>
                <Button variant="link" className="p-0 h-auto text-primary" onClick={() => toast({title: "Em breve!", description: "Funcionalidade de editar perfil será adicionada."})}>
                    <Edit3 className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="shadow-xl hover:shadow-primary/20 transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minha Dieta Atual</CardTitle>
              <Utensils className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {latestDiet ? (
                <>
                  <div className="text-2xl font-bold">Plano de {latestDiet.dailyPlan.calories} kcal</div>
                  <p className="text-xs text-muted-foreground">Objetivo: {latestDiet.formDataUsed.objective.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">Gerada em: {new Date(latestDiet.date).toLocaleDateString('pt-BR')}</p>
                  <Button variant="default" size="sm" className="mt-4 w-full" asChild>
                    <Link to="/diet-plan">Ver Plano Detalhado</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">Nenhuma dieta ativa.</p>
                  <Button variant="default" size="sm" className="mt-4 w-full" asChild>
                    <Link to="/create-diet">Criar Nova Dieta</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Card className="shadow-xl hover:shadow-primary/20 transition-shadow h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meu Progresso</CardTitle>
              <Target className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {progress.length > 0 ? (
                <>
                  <div className="text-2xl font-bold">Peso Atual: {progress[progress.length - 1].weight} kg</div>
                  <p className="text-xs text-muted-foreground">IMC: {progress[progress.length - 1].imc}</p>
                  <p className="text-xs text-muted-foreground">Último registro: {new Date(progress[progress.length - 1].date).toLocaleDateString('pt-BR')}</p>
                </>
              ) : (
                 <p className="text-muted-foreground">Nenhum progresso registrado.</p>
              )}
              <Dialog open={showAddProgressModal} onOpenChange={setShowAddProgressModal}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={handleOpenAddProgressModal}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Progresso
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Progresso</DialogTitle>
                    <DialogDescription>
                      Insira seu peso e altura atuais. Clique em salvar quando terminar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="weight" className="text-right">Peso (kg)</Label>
                      <Input id="weight" type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="col-span-3" placeholder="Ex: 70.5"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="height" className="text-right">Altura (cm)</Label>
                      <Input id="height" type="number" value={newHeight} onChange={(e) => setNewHeight(e.target.value)} className="col-span-3" placeholder="Ex: 175"/>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSaveProgress}>Salvar Progresso</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {allDietPlans.length > 0 && (
        <Card className="shadow-xl mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold gradient-text flex items-center">
              <History className="mr-3 h-6 w-6 text-primary" /> Histórico de Dietas
            </CardTitle>
            <CardDescription>Veja os planos alimentares que você já gerou.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {allDietPlans.map((plan, index) => (
                <motion.div 
                  key={plan.date + index} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-foreground">Plano de {plan.dailyPlan.calories} kcal ({plan.formDataUsed.objective.replace(/_/g, ' ')})</p>
                      <p className="text-xs text-muted-foreground">Gerado em: {new Date(plan.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      navigate('/diet-plan', { state: { selectedPlan: plan } });
                      toast({ title: "Visualizando Dieta", description: `Carregando plano de ${new Date(plan.date).toLocaleDateString()}`, variant: "default"});
                    }}>
                      Ver Detalhes
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold gradient-text">Evolução do Peso e IMC</CardTitle>
          <CardDescription>Acompanhe sua jornada visualmente. (Gráfico em desenvolvimento)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <LineChart size={48} className="mx-auto mb-2" />
              <p>Visualização gráfica do seu progresso aparecerá aqui em breve!</p>
              <p className="text-xs mt-2">Por enquanto, você pode ver seus registros abaixo:</p>
            </div>
          </div>
           {progress.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-foreground uppercase bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Data</th>
                    <th scope="col" className="px-6 py-3">Peso (kg)</th>
                    <th scope="col" className="px-6 py-3">Altura (cm)</th>
                    <th scope="col" className="px-6 py-3">IMC</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.slice().reverse().map((entry, index) => ( 
                    <tr key={index} className="bg-background border-b dark:border-slate-700 hover:bg-muted/30">
                      <td className="px-6 py-4">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4">{entry.weight}</td>
                      <td className="px-6 py-4">{entry.height || "N/A"}</td>
                      <td className="px-6 py-4">{entry.imc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link to="/create-diet">
            <Utensils className="mr-2 h-5 w-5" /> Gerar Nova Dieta ou Ajustar
          </Link>
        </Button>
      </div>
       <div className="mt-8 p-4 bg-accent rounded-lg text-sm text-accent-foreground">
        <Info size={20} className="inline mr-2 mb-1" />
        <span className="font-semibold">Lembrete sobre Login Global:</span> Atualmente, seus dados são salvos localmente no seu navegador. Para acessar sua conta e dietas de outros dispositivos (como celular), precisaríamos integrar um sistema de backend como o Supabase. Fale comigo quando quiser dar esse passo!
      </div>
    </motion.div>
  );
};

export default DashboardPage;