"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, FileText, Loader2, LogOut, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useOwnerApplicationStore } from "@/store/useOwnerApplicationStore";

export default function OwnerApplicationWaitingPage() {
  const router = useRouter();
  const application = useOwnerApplicationStore((state) => state.application);
  const loadMyApplication = useOwnerApplicationStore((state) => state.loadMyApplication);
  const submitApplication = useOwnerApplicationStore((state) => state.submitApplication);
  const signOut = useAuthStore((state) => state.signOut);
  const [refreshing, setRefreshing] = useState(false);
  const [registryDocument, setRegistryDocument] = useState<File | null>(null);
  const [partnershipDocument, setPartnershipDocument] = useState<File | null>(null);
  const [documentInputsVersion, setDocumentInputsVersion] = useState(0);
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const current = await loadMyApplication();
      if (current?.status === "APPROUVE") router.replace("/owners");
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Impossible d’actualiser le statut.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleResubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registryDocument || !partnershipDocument) {
      setError("Veuillez joindre les deux documents obligatoires.");
      return;
    }

    setResubmitting(true);
    setError(null);
    setResubmitSuccess(false);
    try {
      const updatedApplication = await submitApplication(registryDocument, partnershipDocument);
      setRegistryDocument(null);
      setPartnershipDocument(null);
      setDocumentInputsVersion((version) => version + 1);
      if (updatedApplication.status === "APPROUVE") {
        router.replace("/owners");
        return;
      }
      setResubmitSuccess(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Impossible de renvoyer votre dossier.");
    } finally {
      setResubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : "La déconnexion a échoué.");
    } finally {
      router.replace("/");
    }
  };

  const rejected = application?.status === "REJETE";

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10">
        <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${rejected ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
          {rejected ? <XCircle className="h-7 w-7" /> : <Clock3 className="h-7 w-7" />}
        </div>
        <p className="mt-5 text-sm font-semibold text-emerald-700">Espace propriétaire</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {rejected ? "Votre dossier n’a pas été approuvé" : "Votre dossier est en cours de validation"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {rejected
            ? "L’accès à l’espace propriétaire reste fermé. Consultez le motif ci-dessous et contactez notre équipe pour connaître la suite à donner."
            : "Vous pourrez accéder à votre espace propriétaire et gérer vos clients dès que l’équipe BestReservs aura approuvé vos documents."}
        </p>

        {rejected && (
          <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-left text-sm text-rose-800">
            <span className="font-semibold">Motif : </span>
            {application.rejection_reason?.trim() || "Pas de motif."}
          </p>
        )}

        {application && (
          <div className="mt-6 grid gap-2 text-left sm:grid-cols-2">
            <a href={application.registry_document_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <FileText className="h-4 w-4 shrink-0 text-emerald-700" />Document d’immatriculation
            </a>
            <a href={application.partnership_document_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <FileText className="h-4 w-4 shrink-0 text-emerald-700" />Document de partenariat
            </a>
          </div>
        )}

        {rejected && (
          <form key={documentInputsVersion} onSubmit={handleResubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 p-4 text-left">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Renvoyer les documents</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Remplacez vos pièces puis soumettez à nouveau votre dossier pour examen.
              </p>
            </div>
            <label className="block text-xs font-semibold text-slate-700">
              Document d’immatriculation <span className="text-rose-600">*</span>
              <input
                required
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) => setRegistryDocument(event.target.files?.[0] ?? null)}
                className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-700"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Document de partenariat <span className="text-rose-600">*</span>
              <input
                required
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(event) => setPartnershipDocument(event.target.files?.[0] ?? null)}
                className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-700"
              />
            </label>
            <Button type="submit" disabled={resubmitting} className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800">
              {resubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi du dossier…</> : "Soumettre à nouveau"}
            </Button>
          </form>
        )}

        {resubmitSuccess && (
          <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-left text-sm text-emerald-800">
            Vos nouveaux documents ont été envoyés. Votre dossier est de nouveau en attente de validation.
          </p>
        )}
        {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" disabled={refreshing} onClick={() => void refreshStatus()} variant="outline" className="rounded-xl">
            {refreshing ? "Actualisation…" : "Actualiser le statut"}
          </Button>
          <Button type="button" onClick={() => void handleSignOut()} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
            <LogOut className="mr-2 h-4 w-4" />Se déconnecter
          </Button>
        </div>
        {application?.status === "APPROUVE" && <CheckCircle2 className="mx-auto mt-5 h-5 w-5 text-emerald-700" />}
      </section>
    </main>
  );
}
