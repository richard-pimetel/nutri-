import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('nutriPlannerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('nutriPlannerUsers')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password); // Em um app real, a senha seria hasheada

    if (foundUser) {
      const userData = { email: foundUser.email, name: foundUser.name };
      localStorage.setItem('nutriPlannerUser', JSON.stringify(userData));
      setUser(userData);
      toast({ title: "Login bem-sucedido!", description: `Bem-vindo(a) de volta, ${foundUser.name}!`, variant: "default" });
      return true;
    }
    toast({ title: "Erro no Login", description: "Email ou senha inválidos.", variant: "destructive" });
    return false;
  };

  const register = (name, email, password) => {
    let users = JSON.parse(localStorage.getItem('nutriPlannerUsers')) || [];
    if (users.find(u => u.email === email)) {
      toast({ title: "Erro no Cadastro", description: "Este email já está cadastrado.", variant: "destructive" });
      return false;
    }
    // Em um app real, a senha seria hasheada antes de salvar
    users.push({ name, email, password });
    localStorage.setItem('nutriPlannerUsers', JSON.stringify(users));
    toast({ title: "Cadastro realizado!", description: "Sua conta foi criada com sucesso. Faça o login.", variant: "default" });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('nutriPlannerUser');
    setUser(null);
    toast({ title: "Logout realizado", description: "Até breve!", variant: "default" });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};