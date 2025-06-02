import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Replace, BarChartBig, Info, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';

const DietPlanPage = () => {
  const { user } = useAuth();
  const [currentDietPlan, setCurrentDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Para pegar o plano selecionado no dashboard
  const { toast } = useToast();

  const [isSubstitutionModalOpen, setIsSubstitutionModalOpen] = useState(false);
  const [mealToSubstitute, setMealToSubstitute] = useState(null); // { mealIndex: number, mealName: string, originalFood: string }
  const [substitutionOptions, setSubstitutionOptions] = useState([]);
  const [selectedSubstitution, setSelectedSubstitution] = useState('');


  useEffect(() => {
    if (user && user.email) {
      const userDietDataKey = `dietData_${user.email}`;
      const storedData = JSON.parse(localStorage.getItem(userDietDataKey));
      
      let planToLoad = null;

      if (location.state && location.state.selectedPlan) {
        planToLoad = location.state.selectedPlan;
      } else if (storedData && storedData.plans && storedData.plans.length > 0) {
        // Carrega o plano mais recente se nenhum específico foi passado
        planToLoad = storedData.plans.reduce((latest, plan) => new Date(plan.date) > new Date(latest.date) ? plan : latest, storedData.plans[0]);
      }

      if (planToLoad) {
        setCurrentDietPlan(JSON.parse(JSON.stringify(planToLoad))); // Deep copy para evitar mutações indesejadas
      } else {
        toast({ title: "Nenhum plano encontrado", description: "Por favor, crie uma dieta primeiro.", variant: "destructive" });
        navigate('/create-diet');
      }
    } else {
      toast({ title: "Acesso Negado", description: "Faça login para ver seu plano.", variant: "destructive" });
      navigate('/login');
    }
    setLoading(false);
  }, [user, navigate, toast, location.state]);

  const foodSubstitutionDatabase = {
    // Café da Manhã
    "Ovos mexidos": ["Mingau de aveia (com whey opcional)", "Tapioca com queijo cottage e tomate", "Pão integral com abacate e ovo", "Iogurte natural com frutas e granola sem açúcar"],
    "pão integral": ["Batata doce cozida (pequena porção)", "Cuscuz de milho", "Crepioca (goma de tapioca + ovo)", "Biscoito de arroz integral"],
    // Lanches
    "Uma porção de frutas (ex: maçã)": ["Um iogurte natural desnatado", "Um punhado de castanhas (aprox. 30g)", "Palitos de cenoura com homus", "Um ovo cozido"],
    "Iogurte natural com castanhas": ["Shake de whey protein com água ou leite vegetal", "Queijo cottage com geleia sem açúcar", "Fruta com pasta de amendoim integral", "Mix de sementes (girassol, abóbora)"],
    // Almoço/Jantar
    "Frango grelhado": ["Peixe branco assado ou grelhado (tilápia, merluza)", "Carne vermelha magra grelhada (patinho, filé mignon)", "Ovos cozidos ou omelete (3-4 unidades)", "Tofu ou tempeh grelhado (opção vegetariana/vegana)"],
    "Salmão assado": ["Sardinha assada ou em lata (em azeite ou água)", "Atum em água ou azeite", "Truta grelhada", "Frango orgânico grelhado"],
    "Arroz integral": ["Quinoa cozida", "Batata doce cozida ou assada", "Mandioca cozida", "Arroz negro ou vermelho", "Macarrão integral"],
    "Salada colorida": ["Legumes cozidos no vapor (brócolis, couve-flor, vagem)", "Purê de abóbora ou cenoura", "Salada de folhas verdes com tomate cereja e pepino", "Legumes grelhados (abobrinha, berinjela)"],
    "Legumes cozidos no vapor": ["Salada crua variada", "Sopa de legumes (sem batata ou macarrão em excesso)", "Ratatouille de legumes", "Couve refogada com alho"],
    // Gerais (caso a descrição seja mais genérica)
    "proteína magra": ["Ovos", "Peito de frango", "Peixe branco", "Tofu"],
    "carboidrato complexo": ["Batata doce", "Arroz integral", "Quinoa", "Aveia"],
    "vegetais folhosos": ["Espinafre", "Alface", "Rúcula", "Couve"],
  };

  const openSubstitutionModal = (mealIndex, mealName, originalFoodDescription) => {
    let relevantOptions = [];
    const foodDescriptionLower = originalFoodDescription.toLowerCase();

    // Tenta encontrar a melhor correspondência no banco de dados
    for (const foodItem in foodSubstitutionDatabase) {
      if (foodDescriptionLower.includes(foodItem.toLowerCase())) {
        relevantOptions = foodSubstitutionDatabase[foodItem];
        break; 
      }
    }
    // Fallback se nada muito específico for encontrado
    if (relevantOptions.length === 0) {
      if (foodDescriptionLower.includes("fruta")) relevantOptions = foodSubstitutionDatabase["Uma porção de frutas (ex: maçã)"];
      else if (foodDescriptionLower.includes("frango") || foodDescriptionLower.includes("peixe") || foodDescriptionLower.includes("carne")) relevantOptions = foodSubstitutionDatabase["Frango grelhado"];
      else if (foodDescriptionLower.includes("arroz") || foodDescriptionLower.includes("pão")) relevantOptions = foodSubstitutionDatabase["Arroz integral"];
      else relevantOptions = ["Outra opção de vegetal cozido", "Uma porção de leguminosas (feijão, lentilha)", "Uma fatia de queijo magro"];
    }
    
    setMealToSubstitute({ mealIndex, mealName, originalFood: originalFoodDescription });
    setSubstitutionOptions(relevantOptions.slice(0, 4)); // Limita a 4 opções
    setSelectedSubstitution(relevantOptions[0] || ''); // Pre-seleciona a primeira opção
    setIsSubstitutionModalOpen(true);
  };

  const handleConfirmSubstitution = () => {
    if (!mealToSubstitute || !selectedSubstitution || !currentDietPlan) return;

    const updatedMeals = currentDietPlan.dailyPlan.meals.map((meal, index) => {
      if (index === mealToSubstitute.mealIndex) {
        return { ...meal, description: selectedSubstitution, originalDescription: mealToSubstitute.originalFood, isSubstituted: true };
      }
      return meal;
    });

    const updatedPlan = {
      ...currentDietPlan,
      dailyPlan: {
        ...currentDietPlan.dailyPlan,
        meals: updatedMeals,
      },
      lastModified: new Date().toISOString(), // Adiciona um campo para rastrear modificações
    };

    setCurrentDietPlan(updatedPlan); // Atualiza o estado local primeiro

    // Atualizar no localStorage
    const userDietDataKey = `dietData_${user.email}`;
    const storedData = JSON.parse(localStorage.getItem(userDietDataKey)) || { plans: [] };
    
    const planIndex = storedData.plans.findIndex(p => p.date === currentDietPlan.date); // Encontra pelo ID/data original
    if (planIndex !== -1) {
      storedData.plans[planIndex] = updatedPlan;
      localStorage.setItem(userDietDataKey, JSON.stringify(storedData));
      toast({ title: "Alimento Substituído!", description: `${mealToSubstitute.mealName} atualizado com ${selectedSubstitution}.`, variant: "default"});
    } else {
       toast({ title: "Erro ao salvar", description: "Não foi possível encontrar o plano original para atualizar.", variant: "destructive"});
    }
    setIsSubstitutionModalOpen(false);
    setMealToSubstitute(null);
  };


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div></div>;
  }

  if (!currentDietPlan) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Info size={48} className="mx-auto text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-4">Nenhum Plano Alimentar Carregado</h1>
        <p className="text-muted-foreground mb-6">Parece que houve um problema ao carregar seu plano. Tente novamente.</p>
        <Button asChild>
          <Link to="/dashboard">Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  const { dailyPlan, imc, formDataUsed, date: planCreationDate, lastModified } = currentDietPlan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <Card className="max-w-3xl mx-auto shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-green-600 text-primary-foreground p-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <Utensils className="mx-auto h-16 w-16 mb-4" />
          </motion.div>
          <CardTitle className="text-4xl font-extrabold text-center">Seu Plano Alimentar</CardTitle>
          <CardDescription className="text-center text-lg text-primary-foreground/90 mt-2">
            Criado em: {new Date(planCreationDate).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {lastModified && <span className="block text-xs opacity-80">Última modificação: {new Date(lastModified).toLocaleDateString('pt-BR', { hour:'2-digit', minute:'2-digit'})}</span>}
          </CardDescription>
           <CardDescription className="text-center text-md text-primary-foreground/90 mt-1">
            Baseado em: {formDataUsed.objective.replace(/_/g, ' ')}, {formDataUsed.sex}, {formDataUsed.age} anos, {formDataUsed.weight}kg, {formDataUsed.height}cm.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <Card className="bg-primary/5">
              <CardHeader><CardTitle className="text-xl gradient-text">Calorias Diárias</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-primary">{dailyPlan.calories} kcal</p></CardContent>
            </Card>
            <Card className="bg-secondary/5">
              <CardHeader><CardTitle className="text-xl gradient-text">Seu IMC (no momento da criação)</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-secondary">{imc}</p></CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Proteínas</p>
              <p className="text-xl font-semibold text-foreground">{dailyPlan.protein}g</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Carboidratos</p>
              <p className="text-xl font-semibold text-foreground">{dailyPlan.carbs}g</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Gorduras</p>
              <p className="text-xl font-semibold text-foreground">{dailyPlan.fat}g</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">Refeições Sugeridas</h3>
            <div className="space-y-6">
              {dailyPlan.meals.map((meal, index) => (
                <motion.div
                  key={meal.name + index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${meal.isSubstituted ? 'border-secondary border-2' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">{meal.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{meal.description}</p>
                      {meal.isSubstituted && meal.originalDescription && (
                        <p className="text-xs text-accent-foreground mt-1"><i>Original: {meal.originalDescription}</i></p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" onClick={() => openSubstitutionModal(index, meal.name, meal.description)}>
                        <Replace className="mr-2 h-4 w-4" /> Substituir Alimento
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/dashboard"><BarChartBig className="mr-2 h-5 w-5" /> Voltar ao Painel</Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-accent rounded-lg text-sm text-accent-foreground">
            <p className="font-semibold mb-1">Lembrete Importante:</p>
            <p>Este plano alimentar é uma sugestão. As substituições são automáticas e podem não ter o mesmo valor nutricional exato. Para orientações personalizadas e seguras, consulte um nutricionista.</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isSubstitutionModalOpen} onOpenChange={setIsSubstitutionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Substituir Alimento em: {mealToSubstitute?.mealName}</DialogTitle>
            <DialogDescription>
              Original: "{mealToSubstitute?.originalFood}"<br/>
              Escolha uma das opções abaixo para substituir.
            </DialogDescription>
          </DialogHeader>
          {substitutionOptions.length > 0 ? (
            <RadioGroup value={selectedSubstitution} onValueChange={setSelectedSubstitution} className="my-4 space-y-2">
              {substitutionOptions.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <p className="my-4 text-muted-foreground">Nenhuma opção de substituição clara encontrada para este item. Tente ser mais específico na descrição da dieta ou consulte um nutricionista.</p>
          )}
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmSubstitution} disabled={!selectedSubstitution || substitutionOptions.length === 0}>
              <Save className="mr-2 h-4 w-4" /> Salvar Substituição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default DietPlanPage;