// types/course.ts

export interface Category {
  id: string;
  name: string;
}

export interface InstrumentCategory {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  instrumentCategoryId?: string;
  coachId: string;
  startDate: Date;
  endDate: Date;
  planRequired: number;
  isOnline: boolean;
  createdAt: Date;
  videoUrl?: string;
  content?: string;
  banner: string;
  category: {
    id: string;
    name: string;
  };
  instrumentCategory?: {
    id: string;
    name: string;
  };
}

export const coursesMocks = [
  {
    id: "1",
    title: "Cours de Guitare Débutant",
    description: "Apprenez les bases de la guitare en 4 semaines.",
    categoryId: "cat1",
    instrumentCategoryId: "guitar",
    coachId: "coach1",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-30"),
    planRequired: 0,
    isOnline: true,
    createdAt: new Date(),
    videoUrl: "https://example.com/video1.mp4",
    content: "Contenu détaillé du cours de guitare",
    banner:'/images/solfege-banner.webp',
    category: { id: "cat1", name: "Débutant" },
    instrumentCategory: { id: "guitar", name: "Guitare" },
  },
  {
    id: "2",
    title: "Piano pour Enfants",
    description: "Cours ludique de piano pour les 6-12 ans.",
    categoryId: "cat2",
    instrumentCategoryId: "piano",
    coachId: "coach2",
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-08-01"),
    planRequired: 0 as 0,
    isOnline: false,
    createdAt: new Date(),
    videoUrl: "https://example.com/video2.mp4",
    content: "Contenu du cours piano enfants",
    banner:  '/images/chant-banner.jpg',
    category: { id: "cat2", name: "Enfants" },
    instrumentCategory: { id: "piano", name: "Piano" },
  },
  {
    id: "3",
    title: "Chant Professionnel",
    description: "Technique vocale avancée pour chanteurs confirmés.",
    categoryId: "cat3",
    instrumentCategoryId: "voice",
    coachId: "coach3",
    startDate: new Date("2025-08-15"),
    endDate: new Date("2025-09-15"),
    planRequired: 0 as 0,
    isOnline: true,
    createdAt: new Date(),
    videoUrl: "https://example.com/video3.mp4",
    content: "Exercices et vocalises avancées",
    banner: '/images/piano-banner.jpg',
    category: { id: "cat3", name: "Avancé" },
    instrumentCategory: { id: "voice", name: "Chant" },
  },
  {
    id: "4",
    title: "Batterie Rythmique",
    description: "Maîtrisez les bases de la batterie avec un pro.",
    categoryId: "cat1",
    instrumentCategoryId: "drums",
    coachId: "coach4",
    startDate: new Date("2025-06-20"),
    endDate: new Date("2025-07-20"),
    planRequired: 0 as 0,
    isOnline: true,
    createdAt: new Date(),
    videoUrl: "https://example.com/video4.mp4",
    content: "Cours avec partitions et vidéos",
    banner: '/images/guitare-banner.jpg',
    category: { id: "cat1", name: "Débutant" },
    instrumentCategory: { id: "drums", name: "Batterie" },
  },
];

export const coachesMock = [
  { id: "coach1", name: "John Doe" },
  { id: "coach2", name: "Jane Smith" },
];


export const categoriesMock = [
  { id: "cat1", name: "Débutant" },
  { id: "cat2", name: "Enfants" },
  { id: "cat3", name: "Avancé" },
];

export const instrumentCategoriesMock = [
  { id: "guitar", name: "Guitare" },
  { id: "piano", name: "Piano" },
  { id: "voice", name: "Chant" },
  { id: "drums", name: "Batterie" },
];

export const planOptions = [
  { value: 0, label: "Gratuit" },
  { value: 1, label: "Premium" },
  { value: 2, label: "Gold" },
];


export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPostalCode: string;
  companyCity: string;
  companySIRET: string;
  companyPhone: string;
  
  clientName: string;
  clientAddress: string;
  clientPostalCode: string;
  clientCity: string;
  
  invoiceNumber: string;
  invoiceDate: string;
  deliveryDate: string;
  paymentDueDate: string;
  
  items: InvoiceItem[];
  
  additionalInfo: string;
}

export interface InvoiceItem {
  quantity: number;
  description: string;
  unitPrice: number;
}