"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, FileText, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useOwnerApplicationStore } from "@/store/useOwnerApplicationStore";

type RegistrationStep = "signup" | "verify" | "login" | "application";

const inputClassName = "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10";

export default function OwnerRegistrationPage() {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signUpOwner = useAuthStore((state) => state.signUpOwner);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);
  const signIn = useAuthStore((state) => state.signIn);
  const loadMyApplication = useOwnerApplicationStore((state) => state.loadMyApplication);
  const submitApplication = useOwnerApplicationStore((state) => state.submitApplication);
  const isLoading = useOwnerApplicationStore((state) => state.isLoading);
  const [step, setStep] = useState<RegistrationStep>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [code, setCode] = useState("");
  const [registryDocument, setRegistryDocument] = useState<File | null>(null);
  const [partnershipDocument, setPartnershipDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [applicationCheckComplete, setApplicationCheckComplete] = useState(false);
  const [applicationCheckFailed, setApplicationCheckFailed] = useState(false);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);

  const checkExistingApplication = useCallback(async () => {
    setApplicationCheckComplete(false);
    setApplicationCheckFailed(false);
    setHasExistingApplication(false);
    setError(null);
    try {
      const application = await loadMyApplication();
      if (application) {
        setHasExistingApplication(true);
        router.replace(application.status === "APPROUVE" ? "/owners" : "/owners/attente");
      } else {
        setStep("application");
      }
    } catch (loadError) {
      setApplicationCheckFailed(true);
      setError(loadError instanceof Error ? loadError.message : "Impossible de vérifier votre dossier.");
    } finally {
      setApplicationCheckComplete(true);
    }
  }, [loadMyApplication, router]);

  useEffect(() => {
    if (!isAuthenticated || role !== "PROPRIETAIRE") return;
    void checkExistingApplication();
  }, [isAuthenticated, role, checkExistingApplication]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (step === "signup") {
        await signUpOwner(email.trim(), password);
        setStep("verify");
        setSuccess("Un code de vérification a été envoyé à votre adresse email.");
      } else if (step === "verify") {
        await verifyOtp(email.trim(), code.trim());
        try {
          await signIn(email.trim(), password);
          if (useAuthStore.getState().role !== "PROPRIETAIRE") {
            useAuthStore.getState().clearSession();
            throw new Error("Ce compte n’a pas le rôle propriétaire.");
          }
          setStep("application");
          setSuccess("Votre adresse email est vérifiée. Envoyez maintenant les pièces de votre dossier.");
        } catch (loginError) {
          setStep("login");
          setSuccess("Votre email est vérifié. Connectez-vous pour poursuivre la demande.");
          if (loginError instanceof Error) setError(loginError.message);
        }
      } else if (step === "login") {
        await signIn(email.trim(), password);
        if (useAuthStore.getState().role !== "PROPRIETAIRE") {
          useAuthStore.getState().clearSession();
          throw new Error("Ce compte n’a pas le rôle propriétaire.");
        }
        setStep("application");
      } else {
        if (!registryDocument || !partnershipDocument) {
          setError("Veuillez joindre les deux documents obligatoires.");
          return;
        }
        const application = await submitApplication(registryDocument, partnershipDocument);
        router.replace(application.status === "APPROUVE" ? "/owners" : "/owners/attente");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      await resendOtp(email.trim());
      setSuccess("Un nouveau code de vérification a été envoyé.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Impossible de renvoyer le code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = {
    signup: "Créer votre compte propriétaire",
    verify: "Vérifier votre adresse email",
    login: "Connectez-vous pour continuer",
    application: "Envoyer votre dossier",
  }[step];

  if (
    isAuthenticated &&
    role === "PROPRIETAIRE" &&
    (!applicationCheckComplete || applicationCheckFailed || hasExistingApplication)
  ) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-emerald-700" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Vérification de votre dossier</h1>
          {applicationCheckFailed ? (
            <>
              <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>
              <Button type="button" onClick={() => void checkExistingApplication()} className="mt-5 rounded-xl bg-emerald-700 hover:bg-emerald-800">
                Réessayer
              </Button>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-600">Nous vérifions le statut de votre demande avant de continuer.</p>
          )}
        </section>
      </main>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          {step === "application" ? <FileText className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
        </div>
        <p className="text-sm font-semibold text-emerald-700">Espace propriétaire</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{heading}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {step === "application"
            ? "Transmettez votre document d’immatriculation et votre document de partenariat. L’accès à l’espace sera ouvert après approbation par notre équipe."
            : step === "verify"
              ? `Saisissez le code envoyé à ${email}.`
              : step === "login"
                ? "Votre adresse email est vérifiée. Connectez-vous avec votre compte propriétaire."
                : "Créez un compte propriétaire. Vous devrez vérifier votre email avant de soumettre vos documents."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {(step === "signup" || step === "login") && (
            <label className="block text-sm font-semibold text-slate-700">
              Adresse email
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClassName}
                placeholder="vous@exemple.com"
              />
            </label>
          )}

          {(step === "signup" || step === "login") && (
            <label className="block text-sm font-semibold text-slate-700">
              Mot de passe
              <span className="relative mt-2 block">
                <input
                  required
                  minLength={8}
                  maxLength={128}
                  type={passwordVisible ? "text" : "password"}
                  autoComplete={step === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-12 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  aria-label={passwordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={passwordVisible}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
          )}

          {step === "verify" && (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Code de vérification
                <input required value={code} onChange={(event) => setCode(event.target.value)} className={inputClassName} />
              </label>
              <button type="button" disabled={isSubmitting} onClick={() => void handleResendCode()} className="text-sm font-semibold text-emerald-700 disabled:opacity-50">
                Renvoyer le code
              </button>
            </>
          )}

          {step === "application" && (
            <>
              <FileField
                label="Document d’immatriculation"
                hint="Pièce officielle attestant l’existence de votre établissement."
                file={registryDocument}
                onChange={setRegistryDocument}
              />
              <FileField
                label="Document de partenariat"
                hint="Document établissant votre relation avec l’établissement."
                file={partnershipDocument}
                onChange={setPartnershipDocument}
              />
            </>
          )}

          {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          {success && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

          <Button type="submit" disabled={isSubmitting || isLoading} className="h-11 w-full rounded-xl bg-emerald-700 font-semibold hover:bg-emerald-800">
            {isSubmitting || isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Veuillez patienter…</> : {
              signup: "Créer mon compte",
              verify: "Vérifier mon compte",
              login: "Se connecter",
              application: "Soumettre mon dossier",
            }[step]}
          </Button>
        </form>

        {step === "signup" && (
          <button type="button" onClick={() => { setError(null); setSuccess(null); setStep("login"); }} className="mt-5 w-full text-center text-sm font-semibold text-emerald-700">
            Déjà inscrit ? Se connecter
          </button>
        )}
        {step === "login" && (
          <button type="button" onClick={() => { setError(null); setSuccess(null); setStep("signup"); }} className="mt-5 w-full text-center text-sm font-semibold text-emerald-700">
            Créer un compte propriétaire
          </button>
        )}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
        Votre dossier reste en attente de validation avant l’ouverture de l’espace.
      </div>
    </section>
  );
}

function FileField({
  label,
  hint,
  file,
  onChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block rounded-2xl border border-dashed border-slate-300 p-4 text-sm">
      <span className="font-semibold text-slate-800">{label} <span className="text-rose-600">*</span></span>
      <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      <input
        required
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="mt-3 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-700"
      />
      {file && <span className="mt-2 block truncate text-xs text-emerald-700">{file.name}</span>}
    </label>
  );
}
