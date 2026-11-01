"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { AlertCircle, CheckCircle2, CreditCard, LoaderCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CustomerReservation, PaymentCheckout } from "@/store/useCustomerReservationsStore";

interface Props {
  reservation: CustomerReservation;
  checkout: PaymentCheckout | null;
  isCreatingCheckout: boolean;
  checkoutError: string | null;
  providerTransactionId: string | null;
  isConfirmingPayment: boolean;
  confirmationError: string | null;
  confirmationStatus: string | null;
  widgetError: string | null;
  email: string | null;
  paymentMethod: "CARTE_BANCAIRE" | "MOBILE_MONEY";
  onRetryCheckout: () => void;
  onPaymentSuccess: (providerTransactionId: string) => void;
  onVerifyPayment: () => void;
  onWidgetError: (message: string) => void;
}

interface KkiapayWindow extends Window {
  openKkiapayWidget?: (options: {
    amount: number;
    key: string;
    partnerId: string;
    sandbox: boolean;
    data: string;
    position: "center";
    email?: string;
    paymentmethod: ("momo" | "card")[];
  }) => void;
  addSuccessListener?: (callback: (response: unknown) => void) => void;
  addFailedListener?: (callback: (error: unknown) => void) => void;
}

interface PaymentHandlers {
  onSuccess: (response: unknown) => void;
  onFailure: (error: unknown) => void;
}

let activePaymentHandlers: PaymentHandlers | null = null;
let sdkListenersRegistered = false;

function getProviderTransactionId(response: unknown): string | null {
  if (typeof response !== "object" || response === null) return null;
  const record = response as Record<string, unknown>;
  const transactionId = record.transactionId ?? record.transaction_id ?? record.id;
  return typeof transactionId === "string" && transactionId.trim()
    ? transactionId.trim()
    : null;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Le paiement KKiaPay a échoué. Vous pouvez réessayer.";
}

export function KkiapayPaymentStep({
  reservation,
  checkout,
  isCreatingCheckout,
  checkoutError,
  providerTransactionId,
  isConfirmingPayment,
  confirmationError,
  confirmationStatus,
  widgetError,
  email,
  paymentMethod,
  onRetryCheckout,
  onPaymentSuccess,
  onVerifyPayment,
  onWidgetError,
}: Props) {
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState("");
  const [paymentConsent, setPaymentConsent] = useState(false);
  const handlersRef = useRef({ onPaymentSuccess, onWidgetError });

  useEffect(() => {
    setPaymentConsent(false);
  }, [checkout?.transaction_ref]);

  useEffect(() => {
    handlersRef.current = { onPaymentSuccess, onWidgetError };
  }, [onPaymentSuccess, onWidgetError]);

  useEffect(() => {
    activePaymentHandlers = {
      onSuccess: (response) => {
        const transactionId = getProviderTransactionId(response);
        if (!transactionId) {
          handlersRef.current.onWidgetError(
            "KKiaPay n’a pas renvoyé d’identifiant de transaction. Le paiement n’a pas pu être vérifié.",
          );
          return;
        }
        handlersRef.current.onPaymentSuccess(transactionId);
      },
      onFailure: (error) => handlersRef.current.onWidgetError(getErrorMessage(error)),
    };

    return () => {
      activePaymentHandlers = null;
    };
  }, []);

  const registerSdkListeners = () => {
    const sdk = window as KkiapayWindow;
    if (typeof sdk.openKkiapayWidget !== "function") {
      setSdkError("Le widget KKiaPay n’a pas pu être chargé. Vérifiez votre connexion puis réessayez.");
      return;
    }

    if (!sdkListenersRegistered) {
      if (typeof sdk.addSuccessListener !== "function" || typeof sdk.addFailedListener !== "function") {
        setSdkError("Le SDK KKiaPay ne fournit pas les événements de confirmation attendus.");
        return;
      }
      sdk.addSuccessListener((response) => activePaymentHandlers?.onSuccess(response));
      sdk.addFailedListener((error) => activePaymentHandlers?.onFailure(error));
      sdkListenersRegistered = true;
    }
    setSdkError("");
    setIsSdkReady(true);
  };

  const openWidget = () => {
    if (!checkout || !isSdkReady) return;
    const sdk = window as KkiapayWindow;
    if (typeof sdk.openKkiapayWidget !== "function") {
      setSdkError("Le widget KKiaPay n’est pas disponible.");
      return;
    }
    sdk.openKkiapayWidget({
      amount: checkout.amount,
      key: checkout.public_key,
      partnerId: checkout.partner_id,
      sandbox: checkout.sandbox,
      data: checkout.transaction_ref,
      position: "center",
      paymentmethod: [paymentMethod === "MOBILE_MONEY" ? "momo" : "card"],
      ...(email ? { email } : {}),
    });
  };

  const amount = checkout?.amount ?? reservation.total;
  const currency = checkout?.currency ?? reservation.currency;
  const alertMessage = sdkError || checkoutError || confirmationError || widgetError;

  return (
    <div className="space-y-6">
      {checkout?.requires_widget && checkout.sandbox && (
        <Script
          src="https://cdn.kkiapay.me/k.js"
          strategy="afterInteractive"
          onReady={registerSdkListeners}
          onError={() => setSdkError("Impossible de charger le widget KKiaPay.")}
        />
      )}

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Finalisez votre paiement
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          La réservation {reservation.reference} sera transmise à l’établissement après validation du paiement.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Montant à payer</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {amount.toLocaleString("fr-FR")} {currency}
            </p>
          </div>
          {checkout?.sandbox && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Mode test
            </span>
          )}
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Référence de réservation : <span className="font-semibold text-slate-700">{reservation.reference}</span>
        </div>
      </section>

      {!isCreatingCheckout && checkout && !checkout.sandbox && (
        <div role="alert" className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>Le paiement a été bloqué : l’API n’a pas indiqué le mode test KKiaPay.</p>
        </div>
      )}

      {!isCreatingCheckout && checkout && !checkout.requires_widget && (
        <div role="alert" className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>L’API n’a pas activé le widget KKiaPay pour cette transaction.</p>
        </div>
      )}

      {alertMessage && (
        <div role="alert" className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{alertMessage}</p>
        </div>
      )}

      {confirmationStatus === "EN_ATTENTE" && (
        <div role="status" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <LoaderCircle className="h-5 w-5 shrink-0" />
          <p>Le paiement est encore en cours de vérification. Vérifiez son statut avant de quitter cette page.</p>
        </div>
      )}

      {confirmationStatus === "PAYE" && (
        <div role="status" className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>Paiement vérifié. Redirection vers le détail de votre réservation…</p>
        </div>
      )}

      {isCreatingCheckout ? (
        <Button disabled className="h-12 w-full rounded-xl">
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Initialisation du paiement…
        </Button>
      ) : checkoutError || !checkout ? (
        <Button onClick={onRetryCheckout} className="h-12 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800">
          Réessayer l’initialisation du paiement
        </Button>
      ) : providerTransactionId ? (
        <Button
          onClick={onVerifyPayment}
          disabled={isConfirmingPayment}
          className="h-12 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800"
        >
          {isConfirmingPayment ? (
            <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Vérification du paiement…</>
          ) : (
            <><ShieldCheck className="mr-2 h-4 w-4" />Vérifier mon paiement</>
          )}
        </Button>
      ) : checkout.sandbox && checkout.requires_widget ? (
        <div className="space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={paymentConsent}
              onChange={(event) => setPaymentConsent(event.target.checked)}
              disabled={isConfirmingPayment}
              className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-700"
            />
            <span>
              Je consens à poursuivre vers KKiaPay pour régler le montant de{" "}
              <strong>{amount.toLocaleString("fr-FR")} {currency}</strong> et comprends que le paiement sera soumis à vérification.
            </span>
          </label>
          <Button
            onClick={openWidget}
            disabled={!paymentConsent || !isSdkReady || isConfirmingPayment}
            className="h-12 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800"
          >
            {!isSdkReady ? (
              <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Chargement de KKiaPay…</>
            ) : (
              <><CreditCard className="mr-2 h-4 w-4" />Continuer vers le paiement</>
            )}
          </Button>
        </div>
      ) : null}

      <div className="flex items-start gap-2 rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <p>La transaction est vérifiée par le serveur. Le retour du widget seul ne confirme pas le paiement.</p>
      </div>

      {confirmationStatus === "ECHOUE" && (
        <Button variant="outline" onClick={onRetryCheckout} className="w-full rounded-xl">
          Créer une nouvelle tentative de paiement
        </Button>
      )}
      {widgetError && !checkoutError && !providerTransactionId && (
        <Button variant="outline" onClick={onRetryCheckout} className="w-full rounded-xl">
          Créer une nouvelle tentative de paiement
        </Button>
      )}
    </div>
  );
}
