// data/teachers.ts

export type Teacher = {
  id: string;
  name: string;
  email: string;
  photo: string;
  description: string;
};

export const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Emma Durand',
    email: 'emma.durand@example.com',
    photo: '/images/emma.jpg',
    description: 'Professeure de piano classique avec 10 ans d’expérience.',
  },
  {
    id: '2',
    name: 'Lucas Moreau',
    email: 'lucas.moreau@example.com',
    photo: '/images/lucas.jpg',
    description: 'Spécialiste de la guitare acoustique et électrique.',
  },
  {
    id: '3',
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    photo: '/images/sophie.jpg',
    description: 'Coach vocale pour chanteurs de tous niveaux.',
  },
  {
    id: '4',
    name: 'Thomas Leroy',
    email: 'thomas.leroy@example.com',
    photo: '/images/lucas.jpg',
    description: 'Expert en solfège et composition musicale.',
  },
]