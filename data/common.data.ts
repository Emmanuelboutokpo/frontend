import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Heart,
  MapPin,
  Palmtree,
  Send,
  ShieldCheck,
  Compass,
  Sun,
  Utensils,
  Users,
} from 'lucide-react'

export const categoryAccents = [
  { icon: BedDouble, color: 'bg-teal-500', description: 'Dormez en toute sérénité' },
  { icon: Utensils, color: 'bg-orange-500', description: 'Savourez les meilleures adresses' },
  { icon: Palmtree, color: 'bg-amber-400', description: 'Profitez de votre temps libre' },
]

export const moods = [
  { label: 'Un moment à deux', icon: Heart, href: 'hebergement', color: 'bg-rose-50 text-rose-500' },
  { label: 'Bien manger', icon: Utensils, href: 'restaurant', color: 'bg-amber-50 text-amber-500' },
  { label: 'Profiter de la plage', icon: Sun, href: 'loisir', color: 'bg-orange-50 text-orange-500' },
  { label: 'Séjourner en famille', icon: Users, href: 'hebergement', color: 'bg-sky-50 text-sky-600' },
]

export const tabs = [
    {
      key: "hebergement" as const,
      label: "Hébergement",
      icon: BedDouble,
    },
    {
      key: "restaurant" as const,
      label: "Restaurant",
      icon: Utensils,
    },
    {
      key: "loisir" as const,
      label: "Loisirs",
      icon: Compass,
    },
  ]