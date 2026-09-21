"use client"
import dynamic from "next/dynamic";

import { useState } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock3,
  Send,
  ChevronDown,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ICONS: Record<string, any> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
};

export default function ContactPage() {
  const CONTACT_INFO = [
    {
      id: 1,
      icon: "mail",
      label: "Email",
      value: "contact@bestreserv.com",
      href: "mailto:contact@bestreserv.com",
      description: "Réponse sous 24h ouvrées",
    },
    {
      id: 2,
      icon: "phone",
      label: "Téléphone",
      value: "+229 0196673274",
      href: "tel:+229 0196673274",
      description: "Lun – Ven : 8h – 18h",
    },
    {
      id: 3,
      icon: "map-pin",
      label: "Adresse",
      value: "Boulevard de la Marina, Cotonou, Bénin",
      href: null,
      description: "Siège social",
    },
    {
      id: 4,
      icon: "message-circle",
      label: "WhatsApp",
      value: "+229 0196673274",
      href: "https://wa.me/2290196673274",
      description: "Support rapide",
    },
  ];

  const CONTACT_SUBJECTS = [
    { value: "general", label: "Question générale" },
    { value: "partenariat", label: "Partenariat / Établissement" },
    { value: "support", label: "Support technique" },
    { value: "presse", label: "Presse & Médias" },
    { value: "autre", label: "Autre" },
  ];

  const CONTACT_FAQ = [
    {
      id: 1,
      question: "Comment devenir partenaire ?",
      answer:
        "Remplissez le formulaire en choisissant « Partenariat / Établissement ». Notre équipe vous contactera sous 48h pour valider votre dossier et vous accompagner dans la mise en ligne.",
    },
    {
      id: 2,
      question: "Quels sont les moyens de paiement acceptés ?",
      answer:
        "Nous acceptons les cartes bancaires (Visa, Mastercard) et le Mobile Money (MTN, Moov, Orange Money, Wave). D'autres solutions locales seront ajoutées progressivement.",
    },
    {
      id: 3,
      question: "Puis-je annuler une réservation ?",
      answer:
        "Oui, chaque établissement définit sa politique d'annulation. Vous pouvez annuler depuis votre espace client, sous réserve de respecter les conditions de l'établissement.",
    },
    {
      id: 4,
      question: "Comment signaler un problème ?",
      answer:
        "Contactez-nous via le formulaire en choisissant « Support technique », ou par email à support@bestreserv.com. Nous traitons chaque demande sous 24h ouvrées.",
    },
    {
      id: 5,
      question: "BestReserv est-il disponible dans mon pays ?",
      answer:
        "Nous sommes actuellement présents au Bénin, Togo et Côte d'Ivoire. D'autres pays d'Afrique de l'Ouest seront ajoutés prochainement.",
    },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [openId, setOpenId] = useState<number | null>(1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-700" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Message envoyé !</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Merci {form.name || "pour votre message"}. Notre équipe vous répondra
          sous 24h ouvrées à l'adresse {form.email || "indiquée"}.
        </p>
      </div>
    );
  }

  const CONTACT_CTA = {
    title: "Une question urgente ?",
    description:
      "Notre équipe support est disponible par WhatsApp pour vous répondre en temps réel.",
    primaryCta: { label: "Discuter sur WhatsApp", href: "https://wa.me/22997000000" },
    secondaryCta: { label: "Voir la FAQ", href: "#faq" },
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div
          className="relative h-[280px] w-full bg-cover bg-center lg:h-[360px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          <div className="relative mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Contact
            </span>

            <h1 className="text-3xl font-bold leading-tight text-white lg:text-5xl">
              Parlons de votre prochain voyage.
            </h1>

            <p className="mt-4 max-w-2xl text-sm text-white/85 lg:text-base">
              Une question, un partenariat, un problème ? Notre équipe vous
              répond sous 24h ouvrées.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 mb-6 pt-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_INFO.map((info) => {
            const Icon = ICONS[info.icon] ?? Mail;
            const Wrapper: any = info.href ? "a" : "div";
            const linkProps = info.href
              ? {
                href: info.href,
                target: info.href.startsWith("http") ? "_blank" : undefined,
                rel: info.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined,
              }
              : {};

            return (
              <Wrapper
                key={info.id}
                {...linkProps}
                className="group flex flex-col rounded-2xl border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {info.label}
                </div>
                <div className="mt-1 text-sm font-semibold">{info.value}</div>
                {info.description && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {info.description}
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 bg-card p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold lg:text-2xl">Envoyez-nous un message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Remplissez le formulaire ci-dessous, nous vous répondrons rapidement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="Ex : Aïcha Bello"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                required
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Téléphone
              </label>
              <Input
                type="tel"
                placeholder="+229 ..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Sujet <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.subject}
                onValueChange={(v) => setForm({ ...form, subject: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_SUBJECTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              placeholder="Décrivez votre demande en quelques lignes..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-800 py-6 text-base font-semibold hover:bg-emerald-900"
          >
            <Send className="mr-2 h-4 w-4" />
            Envoyer le message
          </Button>
        </form>
      </section>
      <section id="faq" className="bg-muted/30 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              <HelpCircle className="h-3 w-3" />
              FAQ
            </span>
            <h2 className="text-2xl font-bold lg:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-3 text-sm text-muted-foreground lg:text-base">
              Les réponses aux questions les plus posées par nos utilisateurs.
            </p>
          </div>

          <div className="space-y-3">
            {CONTACT_FAQ.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-2xl border bg-card transition"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-muted/30"
                  >
                    <span className="text-sm font-semibold lg:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-800 px-6 py-14 text-center text-white lg:px-16 lg:py-16">
          {/* Motifs décoratifs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-700/50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-600/40 blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl font-bold leading-tight lg:text-4xl">
              {CONTACT_CTA.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 lg:text-base">
              {CONTACT_CTA.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="rounded-full bg-white px-6 text-emerald-800 hover:bg-white/90"
              >
                <a
                  href={CONTACT_CTA.primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {CONTACT_CTA.primaryCta.label}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              >
                <a href={CONTACT_CTA.secondaryCta.href}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {CONTACT_CTA.secondaryCta.label}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
