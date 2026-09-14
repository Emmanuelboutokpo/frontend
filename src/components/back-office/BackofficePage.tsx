// import { ArrowUpRight, MoreHorizontal } from "lucide-react";

// export type BackofficeStat = [label: string, value: string, detail: string];

// type BackofficePageProps = {
//   eyebrow: string;
//   title: string;
//   description: string;
//   stats?: BackofficeStat[];
// };

// export default function BackofficePage({ eyebrow, title, description, stats = [] }: BackofficePageProps) {
//   return (
//     <div className="mx-auto max-w-7xl">
//       <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end">
//         <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-600">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{title}</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p></div>
//         <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"><ArrowUpRight className="h-4 w-4" />Voir le rapport</button>
//       </div>
//       {stats.length > 0 && <div className="mt-8 grid gap-4 md:grid-cols-3">{stats.map(([label, value, detail]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{label}</p><MoreHorizontal className="h-4 w-4 text-slate-400" /></div><p className="mt-4 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs font-medium text-emerald-600">{detail}</p></div>)}</div>}
//       <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
//         <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-semibold">Activité récente</h2><div className="mt-8 flex h-48 items-end gap-3 border-b border-l border-slate-200 px-3 pb-0 pt-4">{[42, 65, 48, 78, 58, 88, 72, 94, 68, 82, 76, 100].map((height, index) => <div key={index} className="flex-1 rounded-t bg-amber-400/80" style={{ height: `${height}%` }} />)}</div><div className="mt-3 flex justify-between text-xs text-slate-400"><span>Jan</span><span>Juin</span><span>Déc</span></div></section>
//         <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-semibold">Actions rapides</h2><div className="mt-5 space-y-3">{["Ajouter un établissement", "Consulter les réservations", "Mettre à jour le profil"].map((item) => <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm"><span>{item}</span><ArrowUpRight className="h-4 w-4 text-slate-400" /></div>)}</div></section>
//       </div>
//     </div>
//   );
// }
