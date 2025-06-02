import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DietFormPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sex: '',
    age: '',
    weight: '',
    height: '',
    objective: '',
    activityLevel: '',
    restrictions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (restriction) => {
    setFormData(prev => {
      const newRestrictions = prev.restrictions.includes(restriction)
        ? prev.restrictions.filter(r => r !== restriction)
        : [...prev.restrictions, restriction];
      return { ...prev, restrictions: newRestrictions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !user.email) {
        toast({ title: "Erro", description: "Você precisa estar logado para criar uma dieta.", variant: "destructive" });
        navigate("/login");
        return;
    }

    const dietPlan = generateDietPlan(formData);
    
    const userDietDataKey = `dietData_${user.email}`;
    const existingData = JSON.parse(localStorage.getItem(userDietDataKey)) || { forms: [], plans: [] };
    
    const newFormEntry = { ...formData, date: new Date().toISOString() };
    const newPlanEntry = { ...dietPlan, date: new Date().toISOString(), formUsed: newFormEntry };

    localStorage.setItem(userDietDataKey, JSON.stringify({
        forms: [...existingData.forms, newFormEntry],
        plans: [...existingData.plans, newPlanEntry]
    }));

    toast({ title: "Dieta Gerada!", description: "Seu plano alimentar personalizado está pronto!", variant: "default" });
    navigate('/diet-plan');
  };

  const foodDatabase = {
    breakfastProtein: ["Ovos mexidos com espinafre", "Omelete com queijo cottage", "Iogurte grego natural (sem açúcar)", "Tofu mexido com cúrcuma"],
    breakfastCarb: ["Uma fatia de pão integral", "Tapioca simples", "Aveia em flocos com frutas", "Batata doce cozida (pequena porção)"],
    breakfastFat: ["Abacate fatiado (1/4)", "Pasta de amendoim (1 colher de sopa)", "Mix de castanhas (pequeno punhado)"],
    
    lunchDinnerProtein: ["Peito de frango grelhado", "Salmão assado", "Tilápia no vapor", "Carne magra moída (patinho)", "Lentilha cozida", "Grão de bico ensopado", "Tofu grelhado com shoyu"],
    lunchDinnerCarb: ["Arroz integral", "Quinoa cozida", "Batata doce assada", "Mandioca cozida", "Macarrão integral"],
    lunchDinnerVegetables: ["Salada colorida (alface, tomate, pepino)", "Brócolis cozido no vapor", "Couve refogada com alho", "Legumes assados (abobrinha, berinjela, pimentão)", "Purê de abóbora"],
    
    snackProtein: ["Whey protein com água", "Ovo cozido", "Queijo cottage", "Um punhado de amêndoas"],
    snackCarbFruit: ["Maçã", "Banana", "Pera", "Laranja", "Morangos (1 xícara)", "Uvas (pequeno cacho)"],
    snackFat: ["Castanha-do-pará (1-2 unidades)", "Nozes (3-4 unidades)", "Sementes de chia (1 colher de sopa) com iogurte"],
  };

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const applyRestrictions = (foodList, restrictions, foodType = '') => {
    let filteredList = [...foodList];
    if (restrictions.includes('gluten_free')) {
      if (foodType === 'breakfastCarb' || foodType === 'lunchDinnerCarb') {
        filteredList = filteredList.filter(food => !food.toLowerCase().includes('pão') && !food.toLowerCase().includes('aveia') && !food.toLowerCase().includes('macarrão') && !food.toLowerCase().includes('tapioca'));
        if (foodType === 'breakfastCarb' && !filteredList.includes('Batata doce cozida (pequena porção)')) filteredList.push('Batata doce cozida (pequena porção)');
        if (foodType === 'lunchDinnerCarb' && !filteredList.includes('Quinoa cozida')) filteredList.push('Quinoa cozida');
      }
    }
    if (restrictions.includes('lactose_free')) {
      filteredList = filteredList.filter(food => !food.toLowerCase().includes('iogurte') && !food.toLowerCase().includes('queijo') && !food.toLowerCase().includes('whey'));
      if (foodType === 'breakfastProtein' && !filteredList.includes('Tofu mexido com cúrcuma')) filteredList.push('Tofu mexido com cúrcuma');
    }
    if (restrictions.includes('vegetarian')) {
      const meatKeywords = ['frango', 'salmão', 'tilápia', 'carne'];
      filteredList = filteredList.filter(food => !meatKeywords.some(keyword => food.toLowerCase().includes(keyword)));
      if (foodType === 'lunchDinnerProtein' && !filteredList.includes('Lentilha cozida')) filteredList.push('Lentilha cozida', 'Grão de bico ensopado', 'Tofu grelhado com shoyu');
    }
    if (restrictions.includes('vegan')) {
      const animalKeywords = ['frango', 'salmão', 'tilápia', 'carne', 'ovo', 'iogurte', 'queijo', 'whey'];
      filteredList = filteredList.filter(food => !animalKeywords.some(keyword => food.toLowerCase().includes(keyword)));
      if (foodType === 'breakfastProtein' && !filteredList.includes('Tofu mexido com cúrcuma')) filteredList.push('Tofu mexido com cúrcuma');
      if (foodType === 'lunchDinnerProtein' && !filteredList.includes('Lentilha cozida')) filteredList.push('Lentilha cozida', 'Grão de bico ensopado', 'Tofu grelhado com shoyu');
    }
    if (restrictions.includes('nut_allergy')) {
      const nutKeywords = ['castanha', 'amêndoa', 'nozes', 'amendoim'];
      filteredList = filteredList.filter(food => !nutKeywords.some(keyword => food.toLowerCase().includes(keyword)));
    }
    return filteredList.length > 0 ? filteredList : foodList; // Retorna original se filtro zerar opções
  };


  const generateDietPlan = (data) => {
    let calories = 0;
    const baseBMR = (10 * parseFloat(data.weight)) + (6.25 * parseFloat(data.height)) - (5 * parseInt(data.age));
    if (data.sex === 'male') calories = baseBMR + 5;
    else calories = baseBMR - 161;

    if (data.activityLevel === 'sedentary') calories *= 1.2;
    else if (data.activityLevel === 'light') calories *= 1.375;
    else if (data.activityLevel === 'moderate') calories *= 1.55;
    else if (data.activityLevel === 'active') calories *= 1.725;
    else if (data.activityLevel === 'very_active') calories *= 1.9;

    if (data.objective === 'lose_weight') calories -= 500;
    else if (data.objective === 'gain_mass') calories += 500;

    const protein = (calories * 0.3) / 4; 
    const carbs = (calories * 0.4) / 4; 
    const fat = (calories * 0.3) / 9;

    const breakfastP = getRandomItem(applyRestrictions(foodDatabase.breakfastProtein, data.restrictions, 'breakfastProtein'));
    const breakfastC = getRandomItem(applyRestrictions(foodDatabase.breakfastCarb, data.restrictions, 'breakfastCarb'));
    
    const lunchP = getRandomItem(applyRestrictions(foodDatabase.lunchDinnerProtein, data.restrictions, 'lunchDinnerProtein'));
    const lunchC = getRandomItem(applyRestrictions(foodDatabase.lunchDinnerCarb, data.restrictions, 'lunchDinnerCarb'));
    const lunchV = getRandomItem(applyRestrictions(foodDatabase.lunchDinnerVegetables, data.restrictions));

    const dinnerP = getRandomItem(applyRestrictions(foodDatabase.lunchDinnerProtein, data.restrictions, 'lunchDinnerProtein'));
    const dinnerC = getRandomItem(applyRestrictions(foodDatabase.lunchDinnerCarb, data.restrictions, 'lunchDinnerCarb'));
    const dinnerV = getRandomItem(applyRestrictions(foodDatabase.lunchDinnerVegetables, data.restrictions));

    const snack1 = getRandomItem(applyRestrictions(foodDatabase.snackCarbFruit, data.restrictions));
    const snack2P = getRandomItem(applyRestrictions(foodDatabase.snackProtein, data.restrictions, 'snackProtein'));
    const snack2F = getRandomItem(applyRestrictions(foodDatabase.snackFat, data.restrictions, 'snackFat'));


    let breakfastDesc = `${breakfastP} com ${breakfastC}.`;
    if (data.restrictions.includes('gluten_free') && (breakfastC.toLowerCase().includes('pão') || breakfastC.toLowerCase().includes('aveia'))) {
        breakfastDesc = `${breakfastP} com ${getRandomItem(applyRestrictions(foodDatabase.breakfastCarb, ['gluten_free'], 'breakfastCarb'))} (opção sem glúten).`;
    }
     if (data.restrictions.includes('lactose_free') && (breakfastP.toLowerCase().includes('iogurte') || breakfastP.toLowerCase().includes('queijo'))) {
        breakfastDesc = `${getRandomItem(applyRestrictions(foodDatabase.breakfastProtein, ['lactose_free'], 'breakfastProtein'))} com ${breakfastC} (opção sem lactose).`;
    }


    return {
      dailyPlan: {
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        meals: [
          { name: 'Café da Manhã', description: breakfastDesc },
          { name: 'Lanche da Manhã', description: `${snack1}.` },
          { name: 'Almoço', description: `${lunchP} com ${lunchC} e ${lunchV}.` },
          { name: 'Lanche da Tarde', description: `${snack2P} com ${snack2F}.` },
          { name: 'Jantar', description: `${dinnerP} com ${dinnerC} e ${dinnerV}.` },
        ],
      },
      imc: (parseFloat(data.weight) / ((parseFloat(data.height) / 100) ** 2)).toFixed(2),
      formDataUsed: data,
    };
  };


  const objectives = [
    { value: 'lose_weight', label: 'Emagrecer' },
    { value: 'maintain_weight', label: 'Manter Peso' },
    { value: 'gain_mass', label: 'Ganhar Massa Muscular' },
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentário (pouco ou nenhum exercício)' },
    { value: 'light', label: 'Leve (exercício leve 1-3 dias/semana)' },
    { value: 'moderate', label: 'Moderado (exercício moderado 3-5 dias/semana)' },
    { value: 'active', label: 'Ativo (exercício pesado 6-7 dias/semana)' },
    { value: 'very_active', label: 'Muito Ativo (exercício muito pesado e trabalho físico)' },
  ];

  const restrictionsList = [
    { id: 'lactose_free', label: 'Intolerância à Lactose' },
    { id: 'gluten_free', label: 'Intolerância ao Glúten' },
    { id: 'vegetarian', label: 'Vegetariano' },
    { id: 'vegan', label: 'Vegano' },
    { id: 'nut_allergy', label: 'Alergia a Oleaginosas' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <Card className="max-w-2xl mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <motion.div initial={{ rotate: -15, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <Utensils className="mx-auto h-12 w-12 text-primary mb-4" />
          </motion.div>
          <CardTitle className="text-3xl font-bold gradient-text">Crie Sua Dieta Personalizada</CardTitle>
          <CardDescription>Preencha os campos abaixo para gerarmos um plano alimentar exclusivo para você.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <Select name="sex" onValueChange={(value) => handleSelectChange('sex', value)} required>
                  <SelectTrigger id="sex"><SelectValue placeholder="Selecione seu sexo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade (anos)</Label>
                <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required placeholder="Ex: 30" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" name="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange} required placeholder="Ex: 70.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} required placeholder="Ex: 175" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Qual seu objetivo?</Label>
              <Select name="objective" onValueChange={(value) => handleSelectChange('objective', value)} required>
                <SelectTrigger id="objective"><SelectValue placeholder="Selecione seu objetivo" /></SelectTrigger>
                <SelectContent>
                  {objectives.map(obj => <SelectItem key={obj.value} value={obj.value}>{obj.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityLevel">Nível de Atividade Física</Label>
              <RadioGroup name="activityLevel" onValueChange={(value) => handleSelectChange('activityLevel', value)} required className="space-y-1">
                {activityLevels.map(level => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.value} id={`activity-${level.value}`} />
                    <Label htmlFor={`activity-${level.value}`}>{level.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Restrições Alimentares (opcional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {restrictionsList.map(restriction => (
                  <div key={restriction.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`restriction-${restriction.id}`}
                      checked={formData.restrictions.includes(restriction.id)}
                      onCheckedChange={() => handleCheckboxChange(restriction.id)}
                    />
                    <Label htmlFor={`restriction-${restriction.id}`} className="font-normal">{restriction.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              Gerar Minha Dieta!
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DietFormPage;