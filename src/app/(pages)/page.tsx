'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Send,
  ShieldCheck,
  Star,

} from 'lucide-react'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

import HeroSearch from '@/components/front-office/HeroSearch'
import { Button } from '@/components/ui/button'
import { usePropertyStore } from '@/store'
import { categoryAccents, moods } from '@/data/common.data'
import { useRouter } from "next/navigation"
import { formatLocation } from '@/utils/selectors'
import PropertyShowcase from '@/components/front-office/PropertyShowcase'

function SectionHeading({ title, description, href }: { title: string; description: string; href?: string }) {
  return <div className="lg:mb-5 flex items-center justify-between gap-4">
    <div>
      <h2 className="text-xl font-extrabold tracking-[-0.04em] text-black sm:text-2xl">{title}</h2>
      <p className="hidden lg:flex mt-1 text-sm text-slate-500">{description}</p>
    </div>
    {href && <Button asChild variant="ghost" className="shrink-0 text-emerald-700 sm:flex">
      <Link href={href}>Explorer <ArrowRight className="ml-2 h-4 w-4" /></Link>
    </Button>}
  </div>
}

export default function Home() {
  const router = useRouter();
  const data = usePropertyStore((state) => state.data)
  const setSearchQuery = usePropertyStore((state) => state.setSearchQuery)
  const photos = useMemo(() => Object.fromEntries(data.Photos.filter((photo) => photo.is_cover).map((photo) => [photo.establishment_id, photo])), [data.Photos])
  const subcategorySlugs = useMemo(() => Object.fromEntries(data.SubCategories.map((subcategory) => [subcategory.id, subcategory.slug])), [data.SubCategories])
  const destinations = useMemo(() => Array.from(new Set(data.Communes.map((commune) => commune.name))), [data.Communes])
  const approved = data.Establishments.filter((property) => property.status === 'APPROVED')
  const popular = [...approved].sort((first, second) => {
    if (second.rating !== first.rating) {
      return second.rating - first.rating
    }

    return second.id - first.id
  })
    .slice(0, 4)
  const nearby = approved.filter((property) => !popular.some((featured) => featured.id === property.id)).sort((first, second) => second.rating - first.rating).slice(0, 4)

  const handleCategoryClick = (
    e: React.MouseEvent,
    category: { id: number; slug: string; name: string }
  ) => {
    e.preventDefault();
    setSearchQuery({
      categoryId: category.id,
    });
    router.push(`/explorer`);
  };

  const handleCategoryMoodClick = (
    e: React.MouseEvent,
    slug: string
  ) => {
    e.preventDefault();

    const category = data.Categories.find((c) => c.slug === slug);
    if (!category) return;

    setSearchQuery({
      categoryId: category.id,
    });

    // 3. Naviguer vers explorer avec le paramètre d'URL
    router.push(`/explorer`);
  };

  return <div className="overflow-hidden bg-white text-slate-900">
    <section className="relative isolate min-h-[510px] overflow-visible bg-[url('/images/hero11.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#042d5d]/90 via-[#0b4771]/60 to-[#081d39]/15" />
      <div className="mx-auto flex min-h-[430px] max-w-7xl flex-col justify-center px-5 pb-28 pt-12 sm:px-8 lg:min-h-[470px] lg:px-12">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">Hébergements · Restaurants · Loisirs</p>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-[0.97] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
          Début de votre  <span className="block text-[#ffc24b]">voyage</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/90 sm:text-base">
          Trouvez les meilleures adresses pour dormir, manger et profiter de moments inoubliables.
        </p>

      </div>
      <div className="absolute inset-x-4 bottom-0 z-10 translate-y-1/2 sm:inset-x-6 lg:inset-x-10">
        <HeroSearch destinations={destinations} />
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-10 pt-60 sm:pt-32 sm:px-8 lg:px-12">
      <SectionHeading title="Que recherchez-vous ?" description="Choisissez votre envie et laissez BestReserv vous guider." />
      <p className=" lg:hidden mb-3 text-sm text-slate-500">
        Choisissez votre envie et laissez BestReserv vous guider.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {data.Categories.map((category, index) => {
          const accent = categoryAccents[index];
          const Icon = accent.icon;
          const image = photos[approved.find((property) => property.category_id === category.id)?.id ?? -1];
          return <Link key={category.id} href={`/explorer`} onClick={(e) => handleCategoryClick(e, category)} className="group relative h-56 sm:h-64 overflow-hidden rounded-2xl bg-[#09234a] shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f6ad2e]">
            {image && <img src={image.url} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061c38]/85 via-[#061c38]/10 to-transparent" />
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-white p-3 shadow-lg">
              <span className={`grid h-10 w-10 place-items-center rounded-full text-white ${accent.color}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold tracking-tight text-black">
                  {category.name}s
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                  {accent.description}
                </span>
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-black transition group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        })}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">

      <SectionHeading
        title="Les endroits populaires"
        description="Découvrez les établissements les plus appréciés dans votre destination."
        href="/explorer"
      />
      <p className=" lg:hidden mb-3 text-sm text-slate-500">
        Découvrez les établissements les plus appréciés dans votre destination.
      </p>
      <Carousel opts={{ align: 'start', loop: false }} className="-mx-1 px-1 sm:-mx-2 sm:px-2">
        <CarouselContent className="-ml-3 sm:-ml-4">
          {popular.map((property) => {
            const category = data.Categories.find((c) => c.id === property.category_id);
            const location = formatLocation(data, property) || property.address;
            const subcategory = data.SubCategories.find(
              (sc) => sc.id === property.subcategory_id
            );

            return (
              <CarouselItem key={property.id} className="basis-[78%] pl-3 sm:basis-[42%] sm:pl-4 lg:basis-1/4">
                <CarouselItem key={property.id} className="basis-[78%] pl-3 sm:basis-[42%] sm:pl-4 lg:basis-1/4">
                  <PropertyShowcase
                    key={property.id}
                    property={property}
                    photo={photos[property.id]}
                    subcategorySlugs={subcategorySlugs}
                    typeName={subcategory?.name ?? category?.name ?? "Établissement"}
                    location={location}
                  />
                </CarouselItem>

              </CarouselItem>)
          }
          )
          }

        </CarouselContent>
      </Carousel>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
      <SectionHeading title="Selon votre envie" description="Des idées pour chaque moment de votre vie." />
      <p className=" lg:hidden mb-3 text-sm text-slate-500">
        Des idées pour chaque moment de votre vie.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const category = mood.href
          return <Link key={mood.label} href={`/explorer`} onClick={(e) => handleCategoryMoodClick(e, category)} className="group flex min-h-28 flex-col hover:text-emerald-500 items-center justify-center rounded-2xl border border-slate-200 bg-white px-2 text-center shadow-sm transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md">
            <span className={`grid h-11 w-11 place-items-center rounded-full ${mood.color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="mt-3 text-xs font-extrabold tracking-tight text-[#09234a]">
              {mood.label}
            </span>
          </Link>
        })}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
      <SectionHeading title="Près de vous" description="Découvrez les meilleures adresses autour de vous." href="/explorer" />
      <p className=" lg:hidden mb-3 text-sm text-slate-500">
        Découvrez les meilleures adresses autour de vous.
      </p>
      <Carousel opts={{ align: 'start', loop: false }} className="-mx-1 px-1 sm:-mx-2 sm:px-2">
        <CarouselContent className="-ml-3 sm:-ml-4">
          {nearby.map((property) => {
            const category = data.Categories.find((c) => c.id === property.category_id);
            const location = formatLocation(data, property) || property.address;
            const subcategory = data.SubCategories.find(
              (sc) => sc.id === property.subcategory_id
            );

            return (
              <CarouselItem key={property.id} className="basis-[78%] pl-3 sm:basis-[42%] sm:pl-4 lg:basis-1/4">
                <CarouselItem key={property.id} className="basis-[78%] pl-3 sm:basis-[42%] sm:pl-4 lg:basis-1/4">
                  <PropertyShowcase
                    key={property.id}
                    property={property}
                    photo={photos[property.id]}
                    subcategorySlugs={subcategorySlugs}
                    typeName={subcategory?.name ?? category?.name ?? "Établissement"}
                    location={location}
                  />
                </CarouselItem>

              </CarouselItem>)
          }
          )
          }
        </CarouselContent>
      </Carousel>

    </section>

    <section id="pourquoi" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
      <h2 className="text-2xl font-extrabold tracking-[-0.04em] text-black sm:text-3xl">Pourquoi choisir BestReserv ?</h2>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[{ icon: ShieldCheck, title: 'Des adresses vérifiées', description: 'Qualité et fiabilité' }, { icon: CalendarDays, title: 'Réservation simple', description: 'En quelques clics' }, { icon: Star, title: 'Meilleurs prix', description: 'Des offres exclusives' }, { icon: Heart, title: 'Support local', description: 'Une équipe à votre écoute' }].map((item) => {
          const Icon = item.icon;
          return <div key={item.title} className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e9f7f7] text-emerald-500">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-black">{item.title}</span>
              <span className="block text-xs text-slate-500">{item.description}</span>
            </span>
          </div>
        })}
      </div>
    </section>

    <section id="newsletter" className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-12">
      <div className="relative overflow-hidden rounded-2xl bg-[#06294f] px-6 py-8 text-white sm:px-10 sm:py-10">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06294f] via-[#06294f]/90 to-[#067f8b]/55" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"><div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ffc24b]">Restez informé</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Recevez nos meilleures adresses</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">Inscrivez-vous à notre newsletter et découvrez en avant-première nos nouvelles adresses et offres exclusives.</p>
        </div>
          <div className="flex w-full max-w-md rounded-xl bg-white p-1.5 shadow-lg">
            <input type="email" aria-label="Votre adresse email" placeholder="Votre adresse email" className="min-w-0 flex-1 rounded-lg px-3 text-sm text-slate-800 outline-none" />
            <button type="button" aria-label="S'inscrire à la newsletter" className="grid h-10 w-11 place-items-center rounded-lg bg-[#06294f] text-white transition hover:bg-[#0a7692]">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
}
