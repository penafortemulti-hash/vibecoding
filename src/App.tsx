import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Sparkles, 
  BrainCircuit, 
  Bot, 
  Youtube, 
  Send, 
  ArrowRight, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  X,
  Target,
  Minus,
  Plus,
  HelpCircle,
  Github,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface CurriculumModule {
  id: number;
  title: string;
  description: string;
  topics: string[];
}

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- Data ---

const FEATURES: FeatureItem[] = [
  {
    id: 'speed',
    title: 'Скорость X10',
    description: 'Больше не нужно гуглить часами. ИИ пишет базу, вы управляете смыслом. Создавайте MVP за вечер, а не за месяц.',
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: 'no-routine',
    title: 'Никакой рутины',
    description: 'Бойлерплейт, настройки среды и типичные баги — это работа для машины. Оставьте себе только творчество.',
    icon: <Bot className="w-6 h-6" />,
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'architecture',
    title: 'Фокус на Продукте',
    description: 'Вайбкодинг — это не про синтаксис. Это про то, как быстро собрать решение, которое приносит пользу и деньги.',
    icon: <Layers className="w-6 h-6" />,
    color: 'bg-cyan-500/20 text-cyan-400',
  },
];

const AUDIENCES = [
  {
    title: 'Новичкам',
    desc: 'Создадите свой первый рабочий проект без страха перед черным экраном терминала.',
    icon: <Target className="w-5 h-5 text-purple-400" />
  },
  {
    title: 'Предпринимателям',
    desc: 'Научитесь сами собирать лендинги и CRM для своего бизнеса без трат на агентства.',
    icon: <Rocket className="w-5 h-5 text-blue-400" />
  },
  {
    title: 'Фрилансерам',
    desc: 'Ускорите выполнение заказов в 5-10 раз, увеличив свою прибыль при тех же усилиях.',
    icon: <Zap className="w-5 h-5 text-cyan-400" />
  }
];

const CURRICULUM: CurriculumModule[] = [
  { 
    id: 1, 
    title: 'Фундамент Вайбкодинга', 
    description: 'Как перестать учить синтаксис и начать строить. Настройка мышления и инструментов (Cursor, Claude, GPT).',
    topics: ['Философия вайбкодинга', 'Промпт-инжиниринг для кода', 'Правильный сетап']
  },
  { 
    id: 2, 
    title: 'Современный Web за 24 часа', 
    description: 'Создание адаптивных лендингов, которые выглядят на миллион. React, Tailwind и магия ИИ.',
    topics: ['Быстрая верстка', 'Анимации (Framer Motion)', 'Деплой в облако']
  },
  { 
    id: 3, 
    title: 'Ваш первый AI-проект', 
    description: 'Интеграция Gemini API и создание умных приложений, которые умеют думать.',
    topics: ['Работа с API', 'Обработка данных', 'AI-ассистенты']
  },
  { 
    id: 4, 
    title: 'Сложные системы - Lovable', 
    description: 'Проектирование логики, баз данных и авторизации. От одностраничников к сервисам.',
    topics: ['Fullstack подход', 'Работа с БД', 'Архитектурные паттерны']
  },
  { 
    id: 5, 
    title: 'Боты и Автоматизации', 
    description: 'Создание Telegram ботов и связок процессов через Make/n8n. ИИ на службе бизнеса.',
    topics: ['Telegram Bot API', 'Автоматизация рутины', 'Интеграции']
  },
  { 
    id: 6, 
    title: 'Упаковка и Монетизация', 
    description: 'Как продать то, что вы создали. Личный бренд, выход на рынок и масштабирование.',
    topics: ['Маркетинг продукта', 'Поиск клиентов', 'Масштабирование']
  },
  { 
    id: 7, 
    title: 'Claude Code & Deep Research', 
    description: 'Продвинутые техники работы с кодом и исследования через самые мощные ИИ модели.',
    topics: ['Анализ кода', 'Deep Research инструменты', 'Будущее разработки']
  },
];

const FAQS = [
  { q: 'Нужно ли знать математику?', a: 'Нет, современный ИИ берет расчеты на себя. Вам нужно только понимание логики.' },
  { q: 'Сколько времени занимает обучение?', a: 'Курс рассчитан на 6-8 недель интенсивной практики с готовым портфолио на выходе.' },
  { q: 'А если я никогда не писал код?', a: 'Вайбкодинг идеально подходит для старта. Мы учим работать с кодом через ИИ, а не зубрить справочники.' }
];

const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Telegram', url: '#', icon: <Send className="w-5 h-5" /> },
  { name: 'YouTube', url: '#', icon: <Youtube className="w-5 h-5" /> },
  { name: 'GitHub', url: '#', icon: <Github className="w-5 h-5" /> },
];

// --- Helpers ---

const SYSTEM_INSTRUCTION = `Вы — AI-ассистент курса «Вайбкодинг: Твори с ИИ». 
Курс обучает создавать сайты, приложения и ботов с помощью ИИ.
Отвечайте коротко, вдохновляюще и дружелюбно.
Если спрашивают про программу, упоминайте модули:
1. Фундамент
2. Web разработка
3. AI-проекты
4. Сложные системы
5. Автоматизации
6. Монетизация
7. Claude Code.
Отвечайте на русском языке.`;

// --- Components ---

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Привет! Я виртуальный куратор курса. Есть вопросы по программе?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          maxOutputTokens: 500,
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Извините, произошла ошибка со связью. Попробуйте чуть позже!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-[350px] sm:w-[400px] h-[550px] mb-4 flex flex-col shadow-2xl border-white/20 bg-slate-900/90 backdrop-blur-xl overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-white" />
                <span className="font-bold text-white">Вайб-Ассистент</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-none font-medium'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none animate-pulse text-slate-400 text-xs">
                    Печатает...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Задайте вопрос..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-tr from-purple-600 to-blue-500 hover:scale-110 active:scale-95'
        }`}
      >
        {isOpen ? <X className="w-8 h-8 text-white" /> : <MessageSquare className="w-8 h-8 text-white" />}
      </button>
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-powered образование 2026
            </div>
            
            <h1 className="text-6xl md:text-[100px] font-black leading-[0.95] tracking-tighter mb-8 neon-text">
              Вайбкодинг:<br />Твори с ИИ
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed mb-12 max-w-3xl mx-auto md:mx-0">
              Создавай сайты, приложения и AI-проекты быстрее — с помощью ИИ и правильной архитектуры. Революционный подход к разработке цифровых продуктов.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
              <button className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-full font-bold text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                Начать творить
              </button>
              <button 
                onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-3 px-12 py-6 glass border border-white/10 rounded-full font-semibold text-xl text-white hover:bg-white/10 transition-colors"
              >
                Программа курса
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Почему Вайбкодинг?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Старый подход — учить синтаксис 6 месяцев. Новый подход — построить проект за 1 неделю с силой ИИ.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-10 group hover:border-white/20 transition-all flex flex-col h-full"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-5">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-sm font-semibold text-purple-400 cursor-pointer">
                Узнать больше <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AudienceSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="glass p-12 md:p-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center md:text-left">Кому это подходит?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {AUDIENCES.map((item, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CurriculumSection: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(1);

  return (
    <section id="curriculum" className="py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Программа обучения</h2>
              <p className="text-slate-400 text-lg">Пошаговый путь от нуля до создания полноценных ИИ-сервисов.</p>
            </div>
            <div className="px-6 py-2 glass rounded-full text-purple-400 font-mono text-xl border-purple-500/30">
              07 МОДУЛЕЙ
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-12 space-y-4">
              {CURRICULUM.map((module) => (
                <div key={module.id} className="relative">
                  <button 
                    onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                    className={`w-full text-left glass p-8 flex flex-col md:flex-row md:items-center gap-6 transition-all duration-300 ${activeModule === module.id ? 'border-purple-500/50 bg-white/5' : 'hover:bg-white/5'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold border ${activeModule === module.id ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/30' : 'border-white/10 text-slate-500'}`}>
                      {module.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl md:text-2xl font-bold">{module.title}</h3>
                        <div className="text-slate-600">
                          {activeModule === module.id ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {activeModule === module.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-8 glass mt-2 border-t-0 rounded-t-none bg-slate-900/50 space-y-6">
                          <p className="text-slate-300 text-lg leading-relaxed">{module.description}</p>
                          <div className="flex flex-wrap gap-3">
                            {module.topics.map((t, i) => (
                              <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-950/40">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Часто спрашивают</h2>
        <div className="space-y-6">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass p-8">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-4">{faq.q}</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="py-16 border-t border-white/5 bg-slate-950 relative overflow-hidden">
      <div className="orb w-[300px] h-[300px] bg-purple-900/20 -top-24 -left-24"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-xl">
                <BrainCircuit className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight uppercase">Вайбкодинг</span>
            </div>
            <p className="text-slate-500 text-center md:text-left max-w-md mt-2">
              Первая образовательная платформа, сфокусированная на синергии человеческого вкуса и мощности Искусственного Интеллекта.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">Следуйте за вайбом</h4>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  aria-label={link.name}
                  className="w-14 h-14 glass rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all transform hover:-translate-y-1 text-slate-400"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © 2026 Вайбкодинг. Все права защищены.
          </p>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Политика приватности</a>
            <a href="#" className="hover:text-white transition-colors">Оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-x-hidden selection:bg-purple-500/30 selection:text-white font-sans">
      {/* Background Decorative Elements (Orbs) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="orb w-[800px] h-[800px] bg-purple-900/20 -top-1/4 -right-1/4 animate-pulse"></div>
        <div className="orb w-[600px] h-[600px] bg-blue-900/10 top-1/2 -left-1/4"></div>
        <div className="orb w-[400px] h-[400px] bg-cyan-900/5 bottom-0 right-1/4"></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="container mx-auto px-4">
          <nav className={`glass px-8 py-4 flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-slate-950/60 shadow-2xl scale-95 md:scale-100' : 'bg-transparent border-transparent'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="font-black tracking-tight text-xl uppercase hidden sm:block">Вайбкодинг</span>
            </div>
            
            <div className="hidden lg:flex gap-10 text-sm font-bold uppercase tracking-wider text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Выгода</a>
              <a href="#curriculum" className="hover:text-white transition-colors text-purple-400">Путь куратора</a>
              <a href="#" className="hover:text-white transition-colors">Отзывы</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden sm:block text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">
                Личный кабинет
              </button>
              <button className="px-8 py-3 bg-white text-slate-950 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg">
                Старт
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <HeroSection />
        <FeaturesSection />
        <AudienceSection />
        <CurriculumSection />
        <FAQSection />
        
        {/* Final CTA Banner */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="glass p-16 md:p-32 relative overflow-hidden text-center rounded-[3rem] border-white/20">
              <div className="orb w-[600px] h-[600px] bg-purple-600/10 -top-48 -left-48"></div>
              <div className="relative z-10">
                <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter">Хватит ждать.<br />Пора строить.</h2>
                <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-3xl mx-auto font-medium">
                  Это последний курс по разработке, который вам понадобится. Потому что мы учим вас не коду, а свободе воплощать любую идею.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button className="px-14 py-8 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full font-bold text-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-500/30">
                    Занять место в потоке
                  </button>
                </div>
                <p className="mt-8 text-slate-500 font-mono text-center">ОСТАЛОСЬ 12 МЕСТ ПО СПЕЦЦЕНЕ</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChat />
    </div>
  );
}
