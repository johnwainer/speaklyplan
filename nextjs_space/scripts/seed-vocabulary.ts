import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config()

const prisma = new PrismaClient()

const vocabularyData = [
  {
    category: '🏗️ ARQUITECTURA DE SOFTWARE',
    terms: [
      { english: 'Microservices', spanish: 'Arquitectura de microservicios', example: 'Our system uses a microservices architecture for better scalability' },
      { english: 'Monolithic', spanish: 'Sistema monolítico', example: "We're migrating from a monolithic to a microservices architecture" },
      { english: 'API Gateway', spanish: 'Puerta de enlace de API', example: 'The API gateway handles all incoming requests' },
      { english: 'Load Balancer', spanish: 'Balanceador de carga', example: 'We need to configure the load balancer for better distribution' },
      { english: 'Scalability', spanish: 'Escalabilidad', example: 'Horizontal scalability is crucial for our growth' },
      { english: 'High Availability', spanish: 'Alta disponibilidad', example: 'We guarantee 99.99% high availability' },
      { english: 'Fault Tolerance', spanish: 'Tolerancia a fallos', example: 'The system is designed with fault tolerance in mind' },
      { english: 'Service Mesh', spanish: 'Malla de servicios', example: 'We implemented a service mesh for better observability' },
      { english: 'Event-Driven', spanish: 'Dirigido por eventos', example: 'Our architecture is event-driven for real-time processing' },
      { english: 'CQRS', spanish: 'Segregación de responsabilidades', example: 'We use CQRS pattern for complex queries' }
    ]
  },
  {
    category: '☁️ CLOUD & DEVOPS',
    terms: [
      { english: 'Infrastructure as Code', spanish: 'Infraestructura como código', example: 'We manage all infrastructure as code using Terraform' },
      { english: 'CI/CD Pipeline', spanish: 'Pipeline de integración continua', example: 'Our CI/CD pipeline automates testing and deployment' },
      { english: 'Container Orchestration', spanish: 'Orquestación de contenedores', example: 'Kubernetes handles our container orchestration' },
      { english: 'Blue-Green Deployment', spanish: 'Despliegue azul-verde', example: 'We use blue-green deployment to minimize downtime' },
      { english: 'Auto-scaling', spanish: 'Escalado automático', example: 'Auto-scaling helps us handle traffic spikes' },
      { english: 'Serverless', spanish: 'Sin servidor', example: "We're moving to serverless for cost optimization" },
      { english: 'Multi-cloud Strategy', spanish: 'Estrategia multi-nube', example: 'Our multi-cloud strategy reduces vendor lock-in' },
      { english: 'Disaster Recovery', spanish: 'Recuperación ante desastres', example: 'We have a robust disaster recovery plan' },
      { english: 'Monitoring & Observability', spanish: 'Monitoreo y observabilidad', example: 'Observability is key to understanding system behavior' },
      { english: 'GitOps', spanish: 'GitOps', example: 'We practice GitOps for infrastructure management' }
    ]
  },
  {
    category: '🔒 SEGURIDAD',
    terms: [
      { english: 'Zero Trust Architecture', spanish: 'Arquitectura de confianza cero', example: 'We implement zero trust architecture for security' },
      { english: 'Encryption at Rest', spanish: 'Cifrado en reposo', example: 'All data is encrypted at rest and in transit' },
      { english: 'OAuth 2.0', spanish: 'OAuth 2.0', example: 'We use OAuth 2.0 for secure authentication' },
      { english: 'Penetration Testing', spanish: 'Pruebas de penetración', example: 'We conduct regular penetration testing' },
      { english: 'Vulnerability Assessment', spanish: 'Evaluación de vulnerabilidades', example: 'Quarterly vulnerability assessments are mandatory' },
      { english: 'Compliance (SOC2, GDPR)', spanish: 'Cumplimiento normativo', example: "We're SOC2 and GDPR compliant" },
      { english: 'Security Audit', spanish: 'Auditoría de seguridad', example: 'The security audit revealed some critical issues' },
      { english: 'Identity Management', spanish: 'Gestión de identidades', example: 'We need better identity management solutions' },
      { english: 'DDoS Protection', spanish: 'Protección DDoS', example: 'Our DDoS protection handles attacks up to 100 Gbps' },
      { english: 'Security Incident', spanish: 'Incidente de seguridad', example: 'We must report any security incident immediately' }
    ]
  },
  {
    category: '📊 DATA & ANALYTICS',
    terms: [
      { english: 'Data Pipeline', spanish: 'Pipeline de datos', example: 'Our data pipeline processes millions of events daily' },
      { english: 'Data Lake', spanish: 'Lago de datos', example: 'We store raw data in our data lake' },
      { english: 'Data Warehouse', spanish: 'Almacén de datos', example: 'The data warehouse powers our business intelligence' },
      { english: 'ETL Process', spanish: 'Proceso ETL', example: 'The ETL process runs every night' },
      { english: 'Real-time Analytics', spanish: 'Análisis en tiempo real', example: 'We provide real-time analytics to our customers' },
      { english: 'Machine Learning Model', spanish: 'Modelo de aprendizaje automático', example: 'Our ML model predicts customer churn' },
      { english: 'A/B Testing', spanish: 'Pruebas A/B', example: 'We run A/B tests for all major features' },
      { english: 'Data Governance', spanish: 'Gobernanza de datos', example: 'Strong data governance is essential for compliance' },
      { english: 'Predictive Analytics', spanish: 'Análisis predictivo', example: 'Predictive analytics helps us forecast demand' },
      { english: 'Data Quality', spanish: 'Calidad de datos', example: 'We implemented checks to ensure data quality' }
    ]
  },
  {
    category: '👥 LIDERAZGO & GESTIÓN',
    terms: [
      { english: 'Technical Debt', spanish: 'Deuda técnica', example: 'We need to address our technical debt' },
      { english: 'Roadmap', spanish: 'Hoja de ruta', example: 'Our product roadmap spans the next 18 months' },
      { english: 'OKRs', spanish: 'Objetivos y resultados clave', example: 'We set quarterly OKRs for all teams' },
      { english: 'Stakeholder Management', spanish: 'Gestión de partes interesadas', example: 'Effective stakeholder management is crucial' },
      { english: 'Resource Allocation', spanish: 'Asignación de recursos', example: 'We need better resource allocation' },
      { english: 'Team Capacity', spanish: 'Capacidad del equipo', example: "Let's assess our team capacity before committing" },
      { english: 'Hiring Pipeline', spanish: 'Pipeline de contratación', example: 'Our hiring pipeline is strong this quarter' },
      { english: '1-on-1 Meetings', spanish: 'Reuniones individuales', example: 'I have weekly 1-on-1s with all direct reports' },
      { english: 'Performance Review', spanish: 'Evaluación de desempeño', example: 'Annual performance reviews are coming up' },
      { english: 'Knowledge Transfer', spanish: 'Transferencia de conocimiento', example: 'We need better knowledge transfer processes' }
    ]
  },
  {
    category: '💼 BUSINESS & STRATEGY',
    terms: [
      { english: 'Go-to-Market Strategy', spanish: 'Estrategia de salida al mercado', example: 'Our go-to-market strategy focuses on enterprises' },
      { english: 'Total Cost of Ownership', spanish: 'Costo total de propiedad', example: 'The TCO includes infrastructure and maintenance' },
      { english: 'Return on Investment', spanish: 'Retorno de la inversión', example: 'The ROI of this project is approximately 300%' },
      { english: 'Market Fit', spanish: 'Ajuste al mercado', example: "We've achieved strong product-market fit" },
      { english: 'Competitive Advantage', spanish: 'Ventaja competitiva', example: 'Our tech stack is our competitive advantage' },
      { english: 'Unit Economics', spanish: 'Economía unitaria', example: 'We need to improve our unit economics' },
      { english: 'Burn Rate', spanish: 'Tasa de consumo', example: 'Our current burn rate is sustainable for 18 months' },
      { english: 'Revenue Stream', spanish: 'Flujo de ingresos', example: "We're diversifying our revenue streams" },
      { english: 'Customer Acquisition Cost', spanish: 'Costo de adquisición', example: 'CAC has decreased by 30% this quarter' },
      { english: 'Churn Rate', spanish: 'Tasa de abandono', example: 'Our churn rate is below industry average' }
    ]
  },
  {
    category: '🗣️ FRASES PARA REUNIONES',
    terms: [
      { english: 'Let me give you some context', spanish: 'Déjame darte contexto', example: 'Let me give you some context before we dive in' },
      { english: 'From a technical standpoint', spanish: 'Desde un punto de vista técnico', example: 'From a technical standpoint, this approach is superior' },
      { english: 'That being said', spanish: 'Dicho esto', example: 'That being said, we need to consider the costs' },
      { english: 'To put it simply', spanish: 'Para decirlo simplemente', example: "To put it simply, we can't scale with this architecture" },
      { english: 'The bottom line is', spanish: 'La conclusión es', example: 'The bottom line is we need to act fast' },
      { english: "I'd like to push back on that", spanish: 'Quisiera objetar eso', example: "I'd like to push back on that assumption" },
      { english: "Let's circle back to", spanish: 'Volvamos a', example: "Let's circle back to the security concerns" },
      { english: "We're on the same page", spanish: 'Estamos de acuerdo', example: "Great, so we're on the same page" },
      { english: "Let's take this offline", spanish: 'Hablemos esto fuera', example: "Let's take this offline and reconvene" },
      { english: 'Moving forward', spanish: 'De aquí en adelante', example: "Moving forward, we'll implement this new process" }
    ]
  },
  {
    category: '🎤 FRASES PARA PRESENTACIONES',
    terms: [
      { english: 'Thank you for joining', spanish: 'Gracias por unirse', example: "Thank you for joining today's presentation" },
      { english: "I'll walk you through", spanish: 'Les guiaré por', example: "I'll walk you through our architecture" },
      { english: 'As you can see here', spanish: 'Como pueden ver aquí', example: 'As you can see here, our metrics are improving' },
      { english: 'This chart illustrates', spanish: 'Este gráfico ilustra', example: 'This chart illustrates our growth trajectory' },
      { english: 'The key takeaway is', spanish: 'La conclusión clave es', example: "The key takeaway is that we're ahead of schedule" },
      { english: 'In a nutshell', spanish: 'En resumen', example: 'In a nutshell, we exceeded all targets' },
      { english: 'This brings me to my next point', spanish: 'Esto me lleva al siguiente punto', example: 'This brings me to my next point about scalability' },
      { english: 'To wrap up', spanish: 'Para concluir', example: 'To wrap up, let me summarize our achievements' },
      { english: 'Are there any questions?', spanish: '¿Hay preguntas?', example: 'Are there any questions before we move on?' },
      { english: 'Let me clarify', spanish: 'Permítanme aclarar', example: 'Let me clarify what I mean by that' }
    ]
  },
  {
    category: '🤝 FRASES PARA NEGOCIACIONES',
    terms: [
      { english: 'What are your thoughts on', spanish: '¿Qué opinas de', example: 'What are your thoughts on this proposal?' },
      { english: "I see where you're coming from", spanish: 'Entiendo tu punto', example: "I see where you're coming from, but..." },
      { english: "Let's find a middle ground", spanish: 'Encontremos un punto medio', example: "Let's find a middle ground that works for both" },
      { english: "That's a fair point", spanish: 'Ese es un buen punto', example: "That's a fair point, let me address it" },
      { english: 'Would you be open to', spanish: '¿Estarías abierto a', example: 'Would you be open to extending the deadline?' },
      { english: 'We can work with that', spanish: 'Podemos trabajar con eso', example: 'We can work with that timeframe' },
      { english: 'Let me run this by my team', spanish: 'Déjame consultarlo con mi equipo', example: 'Let me run this by my team and get back to you' },
      { english: "That's a deal-breaker for us", spanish: 'Eso es inaceptable para nosotros', example: "Unfortunately, that's a deal-breaker for us" },
      { english: "We're willing to compromise on", spanish: 'Estamos dispuestos a ceder en', example: "We're willing to compromise on the budget" },
      { english: 'What would it take to', spanish: '¿Qué se necesitaría para', example: 'What would it take to close this deal today?' }
    ]
  }
]

async function main() {
  console.log('🌱 Seeding vocabulary data...')
  
  // Clear existing vocabulary data
  await prisma.userVocabularyProgress.deleteMany()
  await prisma.vocabularyWord.deleteMany()
  await prisma.vocabularyCategory.deleteMany()
  
  for (const categoryData of vocabularyData) {
    console.log(`  📚 Creating category: ${categoryData.category}`)
    
    const category = await prisma.vocabularyCategory.create({
      data: {
        name: categoryData.category,
        description: `Vocabulario técnico de ${categoryData.category}`
      }
    })
    
    for (const term of categoryData.terms) {
      await prisma.vocabularyWord.create({
        data: {
          categoryId: category.id,
          english: term.english,
          spanish: term.spanish,
          example: term.example
        }
      })
    }
    
    console.log(`    ✅ Added ${categoryData.terms.length} terms`)
  }
  
  console.log('✅ Vocabulary seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
