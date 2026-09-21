"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
    Sparkles, 
    ArrowRight, 
    Check, 
    Building2, 
    Globe, 
    Users, 
    Star, 
    HeartHandshake,
    ShieldCheck,
    Linkedin,
    Mail
  } from "lucide-react";

const ICONS: Record<string, any> = {
  building: Building2,
  globe: Globe,
  users: Users,
  star: Star,
  "heart-handshake": HeartHandshake,
  "shield-check": ShieldCheck,
};

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const ABOUT_MISSION = {
  badge: "Notre mission",
  title: "Rendre le voyage accessible à tous.",
  description:
    "BestReserv est né d'un constat simple : trouver un hébergement, un restaurant ou un lieu de loisir en Afrique reste compliqué. Nous avons créé une plateforme unique, moderne et adaptée aux réalités locales, pour connecter voyageurs et établissements en toute confiance.",
  bullets: [
    "Une plateforme pensée pour le marché africain",
    "Des établissements vérifiés manuellement",
    "Un paiement adapté aux moyens locaux (Mobile Money)",
    "Un support client réactif en français et anglais",
  ],
};

const ABOUT_STATS = [
  { id: 1, value: "262+", label: "Établissements", icon: "building" },
  { id: 2, value: "12", label: "Pays couverts", icon: "globe" },
  { id: 3, value: "15k+", label: "Voyageurs", icon: "users" },
  { id: 4, value: "4.8/5", label: "Satisfaction", icon: "star" },
];

const ABOUT_VALUES = [
  {
    id: 1,
    icon: "shield-check",
    title: "Confiance",
    description:
      "Chaque établissement est vérifié manuellement par notre équipe avant publication.",
  },
  {
    id: 2,
    icon: "sparkles",
    title: "Simplicité",
    description:
      "Une expérience fluide, pensée pour le marché africain et ses réalités.",
  },
  {
    id: 3,
    icon: "globe",
    title: "Ouverture",
    description:
      "Lancé en Afrique de l'Ouest, avec une ambition internationale progressive.",
  },
  {
    id: 4,
    icon: "heart-handshake",
    title: "Proximité",
    description:
      "Un support client réactif, disponible en français et en anglais.",
  },
];

const ABOUT_STORY = [
  {
    id: 1,
    year: "2023",
    title: "Naissance de l'idée",
    description:
      "Un constat simple : le marché africain manque d'une plateforme unique pour réserver hébergements, restaurants et loisirs.",
  },
  {
    id: 2,
    year: "2024",
    title: "Premiers partenariats",
    description:
      "Plus de 100 établissements nous font confiance au Bénin, Togo et Côte d'Ivoire.",
  },
  {
    id: 3,
    year: "2025",
    title: "Lancement officiel",
    description:
      "BestReserv ouvre au public avec une ambition : devenir la référence en Afrique de l'Ouest.",
  },
  {
    id: 4,
    year: "2026",
    title: "Expansion internationale",
    description:
      "Cap sur l'Afrique centrale et l'Europe, avec de nouvelles fonctionnalités (billetterie, avis, fidélité).",
  },
];

const ABOUT_TEAM = [
  {
    id: 1,
    name: "Aïcha Bello",
    role: "Fondatrice & CEO",
    avatar: "https://i.pravatar.cc/200?img=47",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Kofi Mensah",
    role: "Directeur Technique",
    avatar: "https://i.pravatar.cc/200?img=12",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Sophie Dossou",
    role: "Responsable Partenariats",
    avatar: "https://i.pravatar.cc/200?img=32",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Yves Adékambi",
    role: "Responsable Client",
    avatar: "https://i.pravatar.cc/200?img=15",
    linkedin: "#",
  },
];

const ABOUT_CTA = {
  title: "Prêt à vivre l'expérience BestReserv ?",
  description:
    "Rejoignez des milliers de voyageurs et découvrez les meilleures adresses d'Afrique.",
  primaryCta: { label: "Explorer", href: "/pages/explorer" },
  secondaryCta: { label: "Nous contacter", href: "/pages/contact" },
};
  return (
    <main className="min-h-screen bg-background">
        <section className="relative overflow-hidden">
      <div
        className="relative h-[380px] w-full bg-[url('/images/hero13.jpg')] bg-cover bg-center lg:h-[480px]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Sparkles className="h-3 w-3" />
            À propos de BestReserv
          </span>

          <h1 className="text-3xl font-bold leading-tight text-white lg:text-5xl">
            Voyagez, savourez, explorez.
            <br />
            <span className="text-emerald-300">Tout en un seul endroit.</span>
          </h1>

          <p className="hidden sm:block mt-4 max-w-2xl text-sm text-white/85 lg:text-base">
            BestReserv est né d'une idée simple : offrir aux voyageurs africains
            une plateforme unique pour réserver hébergements, restaurants et
            loisirs. Moderne, fiable et pensée pour nos réalités.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-emerald-700 px-6 hover:bg-emerald-800"
            >
              <Link href="/pages/explorer">
                Explorer maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link href="/pages/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        {/* Colonne gauche : texte */}
        <div>
          <span className="mb-3 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            {ABOUT_MISSION.badge}
          </span>
          <h2 className="text-2xl font-bold leading-tight lg:text-4xl">
            {ABOUT_MISSION.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
            {ABOUT_MISSION.description}
          </p>

          <ul className="mt-6 space-y-3">
            {ABOUT_MISSION.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3 w-3 text-emerald-700" />
                </div>
                <span className="text-sm lg:text-base">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite : image */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200"
              alt="Hôtel moderne"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Badge flottant */}
          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border bg-card p-4 shadow-lg lg:block">
            <div className="text-2xl font-bold text-emerald-800">2025</div>
            <div className="text-xs text-muted-foreground">
              Lancement officiel
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="bg-emerald-800 py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ABOUT_STATS.map((stat) => {
            const Icon = ICONS[stat.icon] ?? Building2;
            return (
              <div key={stat.id} className="text-center text-white">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-white/80 lg:text-sm">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
     <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          Nos valeurs
        </span>
        <h2 className="text-2xl font-bold lg:text-4xl">
          Ce qui nous guide au quotidien
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground lg:text-base">
          Quatre principes simples qui orientent chacune de nos décisions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT_VALUES.map((value) => {
          const Icon = ICONS[value.icon] ?? Sparkles;
          return (
            <div
              key={value.id}
              className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold">{value.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
    <section className="bg-muted/30 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            Notre histoire
          </span>
          <h2 className="text-2xl font-bold lg:text-4xl">
            De l'idée à la réalité
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground lg:text-base">
            Les grandes étapes qui ont marqué l'aventure BestReserv.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-3xl">
          {/* Ligne verticale */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-200 lg:left-1/2 lg:-translate-x-1/2" />

          <div className="space-y-8">
            {ABOUT_STORY.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`relative flex items-start gap-4 lg:gap-8 ${
                    isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Contenu */}
                  <div
                    className={`ml-12 flex-1 rounded-2xl border bg-card p-5 shadow-sm lg:ml-0 ${
                      isLeft ? "lg:text-right" : "lg:text-left"
                    }`}
                  >
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {item.year}
                    </div>
                    <h3 className="mb-1 text-base font-semibold lg:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {/* Point central */}
                  <div className="absolute left-4 top-5 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-background bg-emerald-700 text-white shadow lg:left-1/2">
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  </div>

                  {/* Espace vide pour équilibrer */}
                  <div className="hidden flex-1 lg:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
      {/* <section className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
          Notre équipe
        </span>
        <h2 className="text-2xl font-bold lg:text-4xl">
          Des passionnés au service des voyageurs
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground lg:text-base">
          Une équipe jeune, engagée et à l'écoute du marché africain.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ABOUT_TEAM.map((member) => (
          <div
            key={member.id}
            className="group flex flex-col items-center rounded-2xl border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-emerald-100 transition group-hover:ring-emerald-300 lg:h-28 lg:w-28">
              <Image
                src={member.avatar}
                alt={member.name}
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
            <h3 className="text-sm font-semibold lg:text-base">
              {member.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground lg:text-sm">
              {member.role}
            </p>
            <a
              href={member.linkedin}
              className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
              aria-label={`LinkedIn de ${member.name}`}
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>
    </section> */}
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-emerald-800 px-6 py-14 text-center text-white lg:px-16 lg:py-20">
        {/* Motif décoratif */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-700/50 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-600/40 blur-3xl" />

        <div className="relative">
          <h2 className="text-2xl font-bold leading-tight lg:text-4xl">
            {ABOUT_CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 lg:text-base">
            {ABOUT_CTA.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-full bg-white px-6 text-emerald-800 hover:bg-white/90"
            >
              <Link href={ABOUT_CTA.primaryCta.href}>
                {ABOUT_CTA.primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link href={ABOUT_CTA.secondaryCta.href}>
                <Mail className="mr-2 h-4 w-4" />
                {ABOUT_CTA.secondaryCta.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
    </main>
  )
}
 
