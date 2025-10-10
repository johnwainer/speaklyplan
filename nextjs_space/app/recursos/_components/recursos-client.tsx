
'use client';

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProfileImageUrl } from '@/lib/utils'
import { AppHeader } from '@/components/app-header'
import { 
  BookOpen, ArrowLeft, LogOut, User, 
  Smartphone, Globe, Youtube, Headphones, 
  Users, Bot, Rocket, ExternalLink, Star
} from 'lucide-react'

interface RecursosClientProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

interface Recurso {
  nombre: string
  descripcion: string
  url: string
  nivel?: string
  rating: number
}

export default function RecursosClient({ user }: RecursosClientProps) {
  const { data: session } = useSession() || {};
  const router = useRouter()
  const currentUser = session?.user || user;
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categorias = [
    { id: 'all', nombre: 'Todos', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'apps', nombre: 'Apps Móviles', icon: <Smartphone className="h-5 w-5" /> },
    { id: 'web', nombre: 'Plataformas Web', icon: <Globe className="h-5 w-5" /> },
    { id: 'youtube', nombre: 'YouTube', icon: <Youtube className="h-5 w-5" /> },
    { id: 'podcasts', nombre: 'Podcasts', icon: <Headphones className="h-5 w-5" /> },
    { id: 'comunidades', nombre: 'Comunidades', icon: <Users className="h-5 w-5" /> },
    { id: 'ia', nombre: 'Herramientas IA', icon: <Bot className="h-5 w-5" /> },
    { id: 'profesional', nombre: 'Inglés Profesional', icon: <Rocket className="h-5 w-5" /> },
  ]

  const recursos: Record<string, Recurso[]> = {
    apps: [
      { nombre: 'Duolingo', descripcion: 'Vocabulario y gramática básica', url: 'https://www.duolingo.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'ELSA Speak', descripcion: 'Pronunciación con IA', url: 'https://elsaspeak.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'HelloTalk', descripcion: 'Intercambio con nativos', url: 'https://www.hellotalk.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Tandem', descripcion: 'Conversaciones 1-on-1', url: 'https://www.tandem.net', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Memrise', descripcion: 'Vocabulario con spaced repetition', url: 'https://www.memrise.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Anki', descripcion: 'Flashcards personalizables', url: 'https://apps.ankiweb.net', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Speaky', descripcion: 'Comunidad de language exchange', url: 'https://www.speaky.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Busuu', descripcion: 'Lecciones interactivas', url: 'https://www.busuu.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Beelinguapp', descripcion: 'Lee textos bilingües', url: 'https://www.beelinguapp.com', nivel: 'Principiante-Intermedio', rating: 4 },
      { nombre: 'Quizlet', descripcion: 'Flashcards y juegos', url: 'https://quizlet.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Lingoda', descripcion: 'Clases en vivo (prueba gratis)', url: 'https://www.lingoda.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Mondly', descripcion: 'Realidad aumentada y chatbot', url: 'https://www.mondly.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Drops', descripcion: 'Vocabulario con ilustraciones', url: 'https://languagedrops.com', nivel: 'Principiante-Intermedio', rating: 4 },
      { nombre: 'LingQ', descripcion: 'Leer y escuchar contenido auténtico', url: 'https://www.lingq.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Clozemaster', descripcion: 'Aprender por contexto', url: 'https://www.clozemaster.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Babbel', descripcion: 'Lecciones breves (free trial)', url: 'https://www.babbel.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Mango Languages', descripcion: 'Conversación práctica', url: 'https://mangolanguages.com', nivel: 'Todos los niveles', rating: 3 },
      { nombre: 'Pimsleur', descripcion: 'Método audio (7 días gratis)', url: 'https://www.pimsleur.com', nivel: 'Principiante', rating: 4 },
      { nombre: 'Rosetta Stone', descripcion: '3 días de prueba gratis', url: 'https://www.rosettastone.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'FluentU', descripcion: 'Videos del mundo real', url: 'https://www.fluentu.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Cake', descripcion: 'Videos cortos con subtítulos', url: 'https://mycake.me', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Lingvist', descripcion: 'Vocabulario adaptativo', url: 'https://lingvist.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Cambly (15 min free)', descripcion: 'Prueba con tutores nativos', url: 'https://www.cambly.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'TOEFL Go!', descripcion: 'Preparación TOEFL oficial', url: 'https://www.ets.org/toefl', nivel: 'Intermedio-Avanzado', rating: 4 },
      { nombre: 'IELTS Word Power', descripcion: 'Vocabulario para IELTS', url: 'https://www.britishcouncil.org', nivel: 'Intermedio-Avanzado', rating: 4 },
    ],
    web: [
      { nombre: 'BBC Learning English', descripcion: 'Lecciones estructuradas + audio', url: 'https://www.bbc.co.uk/learningenglish', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'EnglishCentral', descripcion: 'Videos con subtítulos interactivos', url: 'https://www.englishcentral.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Coursera (Audit)', descripcion: 'Cursos completos gratis', url: 'https://www.coursera.org', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'edX (Audit)', descripcion: 'Cursos universitarios', url: 'https://www.edx.org', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'FutureLearn', descripcion: 'Cursos de business English', url: 'https://www.futurelearn.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Alison', descripcion: 'Certificados gratuitos', url: 'https://alison.com', nivel: 'Todos los niveles', rating: 3 },
      { nombre: 'OpenLearn', descripcion: 'Open University courses', url: 'https://www.open.edu/openlearn', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'USA Learns', descripcion: 'Curso gratuito del gobierno de EE.UU.', url: 'https://www.usalearns.org', nivel: 'Principiante-Intermedio', rating: 5 },
      { nombre: 'Perfect English Grammar', descripcion: 'Ejercicios de gramática', url: 'https://www.perfect-english-grammar.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'English Grammar Online', descripcion: 'Reglas y ejercicios', url: 'https://www.ego4u.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'English Page', descripcion: 'Tutoriales de gramática', url: 'https://www.englishpage.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'ESL Gold', descripcion: 'Miles de recursos gratis', url: 'https://www.eslgold.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Many Things', descripcion: 'Ejercicios interactivos', url: 'https://www.manythings.org', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'English Club', descripcion: 'Comunidad y lecciones', url: 'https://www.englishclub.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Dave\'s ESL Cafe', descripcion: 'Foros y recursos', url: 'https://www.eslcafe.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'British Council LearnEnglish', descripcion: 'Recursos oficiales UK', url: 'https://learnenglish.britishcouncil.org', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Engvid', descripcion: 'Videos de profesores nativos', url: 'https://www.engvid.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'English Listening Lesson Library', descripcion: 'Miles de audios gratuitos', url: 'https://www.elllo.org', nivel: 'Intermedio+', rating: 5 },
      { nombre: 'English Central', descripcion: 'Videos interactivos', url: 'https://www.englishcentral.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Talk English', descripcion: 'Conversación para principiantes', url: 'https://www.talkenglish.com', nivel: 'Principiante-Intermedio', rating: 4 },
      { nombre: 'English Forward', descripcion: 'Foro de preguntas', url: 'https://www.englishforums.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'News in Levels', descripcion: 'Noticias en 3 niveles', url: 'https://www.newsinlevels.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Simple English Wikipedia', descripcion: 'Wikipedia en inglés simple', url: 'https://simple.wikipedia.org', nivel: 'Principiante-Intermedio', rating: 5 },
      { nombre: 'Lyrics Training', descripcion: 'Aprender con música', url: 'https://lyricstraining.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Forvo', descripcion: 'Pronunciación nativa de palabras', url: 'https://forvo.com', nivel: 'Todos los niveles', rating: 5 },
    ],
    youtube: [
      { nombre: 'English with Lucy', descripcion: 'Grammar + pronunciation', url: 'https://www.youtube.com/@EnglishwithLucy', nivel: 'Principiante-Intermedio', rating: 5 },
      { nombre: 'Learn English with TV Series', descripcion: 'Aprender con series', url: 'https://www.youtube.com/@LearnEnglishWithTVSeries', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'TED-Ed', descripcion: 'Educación + vocabulario avanzado', url: 'https://www.youtube.com/@TEDEd', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: "Rachel's English", descripcion: 'Pronunciación americana', url: 'https://www.youtube.com/@RachelsEnglish', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'EngVid', descripcion: 'Gramática y vocabulario', url: 'https://www.youtube.com/@engvidmatthew', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Business English Pod', descripcion: 'Business English', url: 'https://www.youtube.com/@BusinessEnglishPod', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'Easy English', descripcion: 'Entrevistas en la calle', url: 'https://www.youtube.com/@learnlanguageswitheasyenglish', nivel: 'Intermedio', rating: 5 },
      { nombre: 'English Addict with Mr Duncan', descripcion: 'Lecciones entretenidas', url: 'https://www.youtube.com/@duncaninchina', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Speak English With Vanessa', descripcion: 'Conversación natural', url: 'https://www.youtube.com/@SpeakEnglishWithVanessa', nivel: 'Intermedio', rating: 5 },
      { nombre: 'JenniferESL', descripcion: 'Lecciones completas', url: 'https://www.youtube.com/@JenniferESL', nivel: 'Principiante-Intermedio', rating: 4 },
      { nombre: 'BBC Learning English', descripcion: 'Videos educativos de calidad', url: 'https://www.youtube.com/@bbclearningenglish', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Go Natural English', descripcion: 'Conversación fluida', url: 'https://www.youtube.com/@GoNaturalEnglish', nivel: 'Intermedio', rating: 4 },
      { nombre: 'English Lessons with Adam', descripcion: 'Gramática avanzada', url: 'https://www.youtube.com/@engvidAdam', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'mmmEnglish', descripcion: 'Pronunciación y speaking', url: 'https://www.youtube.com/@mmmEnglish_Emma', nivel: 'Intermedio', rating: 5 },
      { nombre: 'English Speeches', descripcion: 'Discursos famosos con subtítulos', url: 'https://www.youtube.com/@EnglishSpeeches', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'VOA Learning English', descripcion: 'Noticias lentas y claras', url: 'https://www.youtube.com/@VOALearningEnglish', nivel: 'Principiante-Intermedio', rating: 5 },
      { nombre: 'English Speaking Success', descripcion: 'Inglés para la vida real', url: 'https://www.youtube.com/@EnglishSpeakingSuccess', nivel: 'Intermedio', rating: 4 },
      { nombre: 'Crown Academy of English', descripcion: 'Gramática británica', url: 'https://www.youtube.com/@CrownAcademyEnglish', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'English with Emma', descripcion: 'IELTS y vocabulario', url: 'https://www.youtube.com/@EnglishWithEmma', nivel: 'Intermedio-Avanzado', rating: 4 },
      { nombre: 'Real English', descripcion: 'Conversaciones reales en la calle', url: 'https://www.youtube.com/@realenglish1', nivel: 'Intermedio+', rating: 5 },
      { nombre: 'English Anyone', descripcion: 'Fluidez y confianza', url: 'https://www.youtube.com/@EnglishAnyone', nivel: 'Intermedio', rating: 4 },
      { nombre: 'Pronunciation with Emma', descripcion: 'Mejora tu acento', url: 'https://www.youtube.com/@EmmaSaying', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'ETJ English', descripcion: 'Slang y expresiones', url: 'https://www.youtube.com/@ETJEnglish', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'LetThemTalkTV', descripcion: 'Conversaciones auténticas', url: 'https://www.youtube.com/@LetThemTalkTV', nivel: 'Intermedio-Avanzado', rating: 4 },
      { nombre: 'Linguamarina', descripcion: 'Tips para exámenes', url: 'https://www.youtube.com/@linguamarina', nivel: 'Intermedio', rating: 4 },
    ],
    podcasts: [
      { nombre: '6 Minute English (BBC)', descripcion: 'Lecciones cortas diarias', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', nivel: 'Principiante-Intermedio', rating: 5 },
      { nombre: 'All Ears English', descripcion: 'Conversación natural', url: 'https://www.allearsenglish.com', nivel: 'Intermedio', rating: 4 },
      { nombre: 'The English We Speak', descripcion: 'Expresiones idiomáticas', url: 'https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak', nivel: 'Intermedio', rating: 4 },
      { nombre: 'Business English Pod', descripcion: 'Business situations', url: 'https://www.businessenglishpod.com', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'The Daily (NY Times)', descripcion: 'Noticias + listening', url: 'https://www.nytimes.com/column/the-daily', nivel: 'Avanzado', rating: 4 },
      { nombre: 'English Learning for Curious Minds', descripcion: 'Historias interesantes', url: 'https://www.leonardoenglish.com/podcasts', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'Luke\'s English Podcast', descripcion: 'Conversaciones naturales', url: 'https://teacherluke.co.uk', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'Espresso English', descripcion: 'Lecciones cortas', url: 'https://www.espressoenglish.net', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Plain English', descripcion: 'Noticias y cultura', url: 'https://www.plainenglish.com/podcast', nivel: 'Intermedio', rating: 4 },
      { nombre: 'Voice of America News', descripcion: 'Noticias lentas', url: 'https://learningenglish.voanews.com', nivel: 'Principiante-Intermedio', rating: 5 },
      { nombre: 'Culips ESL Podcast', descripcion: 'Inglés canadiense', url: 'https://www.culips.com', nivel: 'Intermedio', rating: 4 },
      { nombre: 'Happy English Podcast', descripcion: 'Motivación y lecciones', url: 'https://www.happyenglishpodcast.com', nivel: 'Intermedio', rating: 4 },
      { nombre: 'The English Learning Podcast', descripcion: 'Historias y conversaciones', url: 'https://www.englishlearningpodcast.com', nivel: 'Intermedio', rating: 4 },
      { nombre: 'Better at English', descripcion: 'Conversación real', url: 'https://www.betteratenglish.com', nivel: 'Intermedio-Avanzado', rating: 4 },
      { nombre: 'English Class 101', descripcion: 'Lecciones estructuradas', url: 'https://www.englishclass101.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Speak English Now Podcast', descripcion: 'Método natural', url: 'https://speakenglishpodcast.com', nivel: 'Intermedio', rating: 4 },
      { nombre: 'English Made Simple', descripcion: 'Conversaciones informales', url: 'https://www.englishmadesimple.net', nivel: 'Intermedio', rating: 4 },
      { nombre: 'Effortless English', descripcion: 'Aprendizaje natural', url: 'https://www.effortlessenglishclub.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'This American Life', descripcion: 'Historias americanas reales', url: 'https://www.thisamericanlife.org', nivel: 'Avanzado', rating: 5 },
      { nombre: 'Stuff You Should Know', descripcion: 'Cultura general en inglés', url: 'https://www.iheart.com/podcast/sysk', nivel: 'Avanzado', rating: 5 },
      { nombre: 'Grammar Girl', descripcion: 'Tips rápidos de gramática', url: 'https://www.quickanddirtytips.com/grammar-girl', nivel: 'Intermedio+', rating: 5 },
      { nombre: 'NPR News Now', descripcion: 'Noticias cortas', url: 'https://www.npr.org', nivel: 'Avanzado', rating: 5 },
      { nombre: 'Radiolab', descripcion: 'Ciencia y filosofía', url: 'https://radiolab.org', nivel: 'Avanzado', rating: 5 },
    ],
    comunidades: [
      { nombre: 'r/EnglishLearning', descripcion: 'Reddit - preguntas y práctica', url: 'https://www.reddit.com/r/EnglishLearning/', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'English Discord Servers', descripcion: 'Practice servers', url: 'https://discord.me', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'iTalki (Free Exchange)', descripcion: 'Language exchange gratis', url: 'https://www.italki.com', nivel: 'Intermedio+', rating: 5 },
      { nombre: 'Conversation Exchange', descripcion: 'Find language partners', url: 'https://www.conversationexchange.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'My Language Exchange', descripcion: 'Penpal + voice chat', url: 'https://www.mylanguageexchange.com', nivel: 'Todos los niveles', rating: 3 },
      { nombre: 'Polyglot Club', descripcion: 'Eventos y meetups', url: 'https://www.polyglotclub.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'InterPals', descripcion: 'Amigos por correspondencia', url: 'https://www.interpals.net', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Slowly', descripcion: 'Cartas digitales a pen pals', url: 'https://www.getslowly.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'HiNative', descripcion: 'Pregunta a nativos', url: 'https://hinative.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Lang-8', descripcion: 'Corrección de textos', url: 'https://lang-8.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Meetup (Language Groups)', descripcion: 'Eventos locales', url: 'https://www.meetup.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Facebook English Groups', descripcion: 'Grupos de estudio', url: 'https://www.facebook.com', nivel: 'Todos los niveles', rating: 3 },
      { nombre: 'WordReference Forums', descripcion: 'Foro de dudas lingüísticas', url: 'https://forum.wordreference.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Stack Exchange English', descripcion: 'Q&A de inglés', url: 'https://english.stackexchange.com', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'English Learning Lounge', descripcion: 'Comunidad Discord activa', url: 'https://discord.gg/english', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Preply Community', descripcion: 'Foro de estudiantes', url: 'https://preply.com/en/blog', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'FluentU Community', descripcion: 'Comunidad de aprendices', url: 'https://www.fluentu.com/blog/english/', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Cambly Community', descripcion: 'Grupo de práctica', url: 'https://www.cambly.com/english', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Verbling Community', descripcion: 'Artículos y recursos', url: 'https://www.verbling.com/articles', nivel: 'Todos los niveles', rating: 4 },
    ],
    ia: [
      { nombre: 'ChatGPT', descripcion: 'Conversación ilimitada + feedback', url: 'https://chat.openai.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Google Translate', descripcion: 'Traducción + pronunciación', url: 'https://translate.google.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Grammarly Free', descripcion: 'Corrección gramatical', url: 'https://www.grammarly.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Reverso Context', descripcion: 'Contexto de palabras', url: 'https://context.reverso.net', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'DeepL', descripcion: 'Traductor preciso', url: 'https://www.deepl.com', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Hemingway Editor', descripcion: 'Simplificar escritura', url: 'https://hemingwayapp.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'QuillBot', descripcion: 'Parafrasear y mejorar textos', url: 'https://quillbot.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'LanguageTool', descripcion: 'Corrector gramatical', url: 'https://languagetool.org', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Wordtune', descripcion: 'Reescritura de oraciones', url: 'https://www.wordtune.com', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Ginger Software', descripcion: 'Corrección y traducción', url: 'https://www.gingersoftware.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'ProWritingAid', descripcion: 'Análisis de escritura', url: 'https://prowritingaid.com', nivel: 'Avanzado', rating: 4 },
      { nombre: 'Ludwig Guru', descripcion: 'Ejemplos contextuales', url: 'https://ludwig.guru', nivel: 'Intermedio+', rating: 5 },
      { nombre: 'Writefull', descripcion: 'Feedback académico', url: 'https://www.writefull.com', nivel: 'Avanzado', rating: 4 },
      { nombre: 'Linguix', descripcion: 'Asistente de escritura IA', url: 'https://linguix.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Smodin', descripcion: 'Parafraseo y resumen', url: 'https://smodin.io', nivel: 'Intermedio+', rating: 3 },
      { nombre: 'Wordvice AI', descripcion: 'Revisor de textos', url: 'https://wordvice.ai', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Trinka AI', descripcion: 'Corrección académica', url: 'https://www.trinka.ai', nivel: 'Avanzado', rating: 4 },
      { nombre: 'Readable', descripcion: 'Analiza legibilidad', url: 'https://readable.com', nivel: 'Intermedio+', rating: 4 },
    ],
    profesional: [
      { nombre: 'Business English Pod', descripcion: 'Inglés de negocios práctico', url: 'https://www.businessenglishpod.com', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'Harvard Business Review', descripcion: 'Artículos de management', url: 'https://hbr.org', nivel: 'Avanzado', rating: 5 },
      { nombre: 'LinkedIn Learning (Free)', descripcion: 'Cursos profesionales', url: 'https://www.linkedin.com/learning/', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'FluentU Business', descripcion: 'Videos de negocios reales', url: 'https://www.fluentu.com/en/business', nivel: 'Intermedio', rating: 4 },
      { nombre: 'VOA Learning English', descripcion: 'Noticias con vocabulario', url: 'https://learningenglish.voanews.com', nivel: 'Principiante-Intermedio', rating: 5 },
      { nombre: 'Breaking News English', descripcion: 'Lecciones de actualidad', url: 'https://breakingnewsenglish.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'Speak Confident English', descripcion: 'Inglés para profesionales', url: 'https://www.speakconfidentenglish.com', nivel: 'Intermedio', rating: 4 },
      { nombre: 'ESL Fast', descripcion: 'Lecturas y ejercicios', url: 'https://www.eslfast.com', nivel: 'Principiante-Intermedio', rating: 4 },
      { nombre: 'Cambridge English', descripcion: 'Recursos oficiales', url: 'https://www.cambridgeenglish.org/learning-english/', nivel: 'Todos los niveles', rating: 5 },
      { nombre: 'Bloomberg News', descripcion: 'Noticias financieras en inglés', url: 'https://www.bloomberg.com', nivel: 'Avanzado', rating: 5 },
      { nombre: 'Financial Times', descripcion: 'Inglés de finanzas', url: 'https://www.ft.com', nivel: 'Avanzado', rating: 5 },
      { nombre: 'The Economist', descripcion: 'Inglés sofisticado', url: 'https://www.economist.com', nivel: 'Avanzado', rating: 5 },
      { nombre: 'MIT OpenCourseWare', descripcion: 'Cursos gratuitos en inglés', url: 'https://ocw.mit.edu', nivel: 'Avanzado', rating: 5 },
      { nombre: 'Stanford Online', descripcion: 'Cursos universitarios', url: 'https://online.stanford.edu', nivel: 'Avanzado', rating: 5 },
      { nombre: 'Phrasal Verbs for Business', descripcion: 'Phrasal verbs profesionales', url: 'https://www.englishclub.com/business-english/', nivel: 'Intermedio+', rating: 4 },
      { nombre: 'Business English Site', descripcion: 'Recursos de inglés corporativo', url: 'https://www.businessenglishsite.com', nivel: 'Intermedio-Avanzado', rating: 4 },
      { nombre: 'ESL Library', descripcion: 'Materiales para profesionales', url: 'https://esllibrary.com', nivel: 'Todos los niveles', rating: 4 },
      { nombre: 'TechCrunch', descripcion: 'Inglés tech y startups', url: 'https://techcrunch.com', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'Wired Magazine', descripcion: 'Tecnología en inglés', url: 'https://www.wired.com', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'GitHub Docs', descripcion: 'Documentación técnica', url: 'https://docs.github.com', nivel: 'Intermedio-Avanzado', rating: 5 },
      { nombre: 'Stack Overflow', descripcion: 'Inglés técnico de programación', url: 'https://stackoverflow.com', nivel: 'Intermedio+', rating: 5 },
      { nombre: 'Medium Tech', descripcion: 'Artículos de tecnología', url: 'https://medium.com/tag/technology', nivel: 'Intermedio-Avanzado', rating: 4 },
      { nombre: 'AWS Documentation', descripcion: 'Inglés técnico cloud', url: 'https://docs.aws.amazon.com', nivel: 'Avanzado', rating: 5 },
      { nombre: 'Google Developers', descripcion: 'Documentación técnica', url: 'https://developers.google.com', nivel: 'Intermedio-Avanzado', rating: 5 },
    ],
  }

  const getRecursosFiltrados = () => {
    if (selectedCategory === 'all') {
      return Object.entries(recursos).flatMap(([categoria, items]) =>
        items.map(item => ({ ...item, categoria }))
      )
    }
    return recursos[selectedCategory]?.map(item => ({ ...item, categoria: selectedCategory })) || []
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getCategoryIcon = (categoria: string) => {
    const cat = categorias.find(c => c.id === categoria)
    return cat?.icon || <BookOpen className="h-5 w-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <AppHeader currentSection="recursos" />

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="my-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Hero Section */}
          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
                <Rocket className="h-8 w-8 text-blue-600" />
                Recursos Gratuitos Completos
              </CardTitle>
              <CardDescription className="text-center text-lg mt-2">
                Todos los recursos que necesitas para dominar el inglés - 100% gratuitos
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categorias.map((categoria) => (
                <Button
                  key={categoria.id}
                  variant={selectedCategory === categoria.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(categoria.id)}
                  className="flex items-center gap-2"
                >
                  {categoria.icon}
                  <span>{categoria.nombre}</span>
                  {selectedCategory === categoria.id && (
                    <Badge variant="secondary" className="ml-1">
                      {categoria.id === 'all' 
                        ? Object.values(recursos).reduce((acc, curr) => acc + curr.length, 0)
                        : recursos[categoria.id]?.length || 0
                      }
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRecursosFiltrados().map((recurso, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        {getCategoryIcon(recurso.categoria)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{recurso.nombre}</CardTitle>
                        {renderStars(recurso.rating)}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {recurso.descripcion}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recurso.nivel && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {recurso.nivel}
                        </Badge>
                      </div>
                    )}
                    <a
                      href={recurso.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button 
                        className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                        variant="outline"
                      >
                        Visitar Recurso
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {getRecursosFiltrados().length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No hay recursos en esta categoría
              </h3>
              <p className="text-gray-500">
                Selecciona otra categoría para ver los recursos disponibles
              </p>
            </Card>
          )}

          {/* Footer CTA */}
          <Card className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">💡 Pro Tip</h3>
              <p className="mb-6 text-green-100">
                No intentes usar todos los recursos al mismo tiempo. Escoge 2-3 de cada categoría que más te gusten
                y úsalos consistentemente. La constancia vence a la cantidad.
              </p>
              <Button 
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
