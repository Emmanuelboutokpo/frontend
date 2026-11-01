"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Star } from "lucide-react";

import AuthDialog from "@/components/front-office/AuthDialog";
import { ReservationStepper } from "@/components/front-office/reservation/ReservationStepper";
import { Step1StayDetails } from "@/components/front-office/reservation/steps/Step2StayDetails";
import { Step3Payment, type PaymentMethod } from "@/components/front-office/reservation/steps/Step4Payment";
import { Step4Confirmation } from "@/components/front-office/reservation/steps/Step5Confirmation";
import { KkiapayPaymentStep } from "@/components/front-office/reservation/steps/KkiapayPaymentStep";
import { useAuthStore, usePropertyStore } from "@/store";
import {
  useCustomerReservationsStore,
  type CustomerReservation,
  type PaymentCheckout,
  type ReservationCreatePayload,
  type ReservationPaymentMethod,
} from "@/store/useCustomerReservationsStore";

interface Props {
  params: Promise<{ establishmentId: string }>;
}

export default function ReservationPage({ params }: Props) {
  const { establishmentId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = usePropertyStore((state) => state.data);
  const establishmentsLoaded = usePropertyStore((state) => state.establishmentsLoaded);
  const establishmentsLoading = usePropertyStore((state) => state.establishmentsLoading);
  const fetchEstablishments = usePropertyStore((state) => state.fetchEstablishments);
  const fetchEstablishmentBySlug = usePropertyStore((state) => state.fetchEstablishmentBySlug);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const email = useAuthStore((state) => state.email);
  const checkAvailability = useCustomerReservationsStore((state) => state.checkAvailability);
  const getQuote = useCustomerReservationsStore((state) => state.getQuote);
  const createReservation = useCustomerReservationsStore((state) => state.create);
  const createCheckout = useCustomerReservationsStore((state) => state.createCheckout);
  const confirmCheckout = useCustomerReservationsStore((state) => state.confirmCheckout);
  const quote = useCustomerReservationsStore((state) => state.quote);
  const availability = useCustomerReservationsStore((state) => state.availability);
  const isCheckingAvailability = useCustomerReservationsStore((state) => state.isCheckingAvailability);
  const isQuoting = useCustomerReservationsStore((state) => state.isQuoting);
  const isCreating = useCustomerReservationsStore((state) => state.isCreating);
  const isCreatingCheckout = useCustomerReservationsStore((state) => state.isCreatingCheckout);
  const isConfirmingPayment = useCustomerReservationsStore((state) => state.isConfirmingPayment);
  const checkoutError = useCustomerReservationsStore((state) => state.checkoutError);
  const paymentConfirmationError = useCustomerReservationsStore((state) => state.paymentConfirmationError);
  const clearQuote = useCustomerReservationsStore((state) => state.clearQuote);

  const property = data.Establishments.find((establishment) => String(establishment.id) === establishmentId);
  const requestStarted = useRef(false);
  const detailRequestStarted = useRef(false);
  const idempotencyKey = useRef<string | null>(null);
  const paymentConfirmationInFlight = useRef(false);
  const checkoutPaymentMethod = useRef<Extract<ReservationPaymentMethod, "CARTE_BANCAIRE" | "MOBILE_MONEY">>("MOBILE_MONEY");
  const [step, setStep] = useState(1);
  const [loadError, setLoadError] = useState("");
  const [flowError, setFlowError] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [adults, setAdults] = useState(Number(searchParams.get("guests")) || 1);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile");
  const [reservationToPay, setReservationToPay] = useState<CustomerReservation | null>(null);
  const [paymentCheckout, setPaymentCheckout] = useState<PaymentCheckout | null>(null);
  const [providerTransactionId, setProviderTransactionId] = useState<string | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<string | null>(null);
  const [widgetError, setWidgetError] = useState<string | null>(null);

  useEffect(() => {
    if (property || establishmentsLoading || loadError) return;
    if (!establishmentsLoaded && !requestStarted.current) {
      requestStarted.current = true;
      void fetchEstablishments().catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Impossible de charger l’établissement.");
      });
      return;
    }
    if (establishmentsLoaded && !detailRequestStarted.current) {
      detailRequestStarted.current = true;
      void fetchEstablishmentBySlug(establishmentId).catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "L’établissement demandé est introuvable.");
      });
    }
  }, [establishmentId, establishmentsLoaded, establishmentsLoading, fetchEstablishmentBySlug, fetchEstablishments, loadError, property]);

  const category = property
    ? data.Categories.find((item) => item.id === property.category_id) ?? property.category
    : null;
  const subcategory = property
    ? data.SubCategories.find((item) => item.id === property.subcategory_id) ?? property.subcategory
    : null;
  const country = property ? data.Countries.find((item) => item.id === property.country_id) : null;
  const isAccommodation = category?.slug?.toLowerCase() === "hebergement"
    || category?.name.toLowerCase().includes("hébergement") === true;
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.ceil(
      (new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000
    ));
  }, [checkIn, checkOut]);
  const photos = useMemo(() => {
    if (!property) return [];
    return data.Photos
      .filter((photo) => property.photo_ids.includes(photo.id) || photo.establishment_id === property.id)
      .sort((first, second) => Number(second.is_cover) - Number(first.is_cover));
  }, [data.Photos, property]);

  const createPayload = (): ReservationCreatePayload | null => {
    if (!property || !checkIn) return null;
    return {
      establishment_id: String(property.id),
      start_date: checkIn,
      end_date: isAccommodation ? checkOut : null,
      start_time: startTime || null,
      end_time: endTime || null,
      quantity: adults + children,
      adults,
      children,
      room_or_unit: isAccommodation && room.trim() ? room.trim() : null,
      options: null,
      special_requests: specialRequests.trim() || null,
    };
  };

  const clearCalculatedPrice = () => {
    clearQuote();
    idempotencyKey.current = null;
    setAvailabilityMessage("");
    setFlowError("");
  };

  const handleCheckAvailability = async () => {
    setFlowError("");
    setAvailabilityMessage("");
    if (!property) return;
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    if (isAccommodation && property.max_guests > 0 && adults + children > property.max_guests) {
      setFlowError(`Cet établissement accepte au maximum ${property.max_guests} voyageur${property.max_guests > 1 ? "s" : ""}.`);
      return;
    }
    if (!isAccommodation && startTime && endTime && endTime <= startTime) {
      setFlowError("L’heure de fin doit être postérieure à l’heure de début.");
      return;
    }

    const payload = createPayload();
    if (!payload) return;
    try {
      const checked = await checkAvailability(payload);
      if (!checked.available) {
        setAvailabilityMessage(`Aucune disponibilité pour cette date. Statut : ${checked.availability_status.toLowerCase().replaceAll("_", " ")}.`);
        return;
      }
      const calculated = await getQuote(payload);
      setAvailabilityMessage(
        checked.remaining_capacity == null
          ? "Disponibilité confirmée. Votre devis est prêt."
          : `Disponibilité confirmée (${checked.remaining_capacity} place${checked.remaining_capacity > 1 ? "s" : ""} restante${checked.remaining_capacity > 1 ? "s" : ""}). Votre devis est prêt.`
      );
      if (calculated.total < 0) throw new Error("Le devis reçu par l’API est invalide.");
      setStep(2);
    } catch (error) {
      setFlowError(error instanceof Error ? error.message : "Impossible de vérifier la disponibilité et de calculer le devis.");
    }
  };

  const handleConfirm = async () => {
    const basePayload = createPayload();
    if (!basePayload) return;
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    const paymentMethods: Record<PaymentMethod, Extract<ReservationPaymentMethod, "CARTE_BANCAIRE" | "MOBILE_MONEY">> = {
      card: "CARTE_BANCAIRE",
      mobile: "MOBILE_MONEY",
    };
    try {
      const reservation = await createReservation({
        ...basePayload,
        payment_method: paymentMethods[paymentMethod],
      }, idempotencyKey.current ?? (idempotencyKey.current = crypto.randomUUID()));
      idempotencyKey.current = null;
      setReservationToPay(reservation);
      checkoutPaymentMethod.current = paymentMethods[paymentMethod];
      setStep(4);
      await initializeCheckout(reservation, paymentMethods[paymentMethod]);
    } catch (error) {
      setFlowError(error instanceof Error ? error.message : "Impossible d’envoyer la demande de réservation.");
    }
  };

  const initializeCheckout = async (
    reservation: CustomerReservation,
    method: Extract<ReservationPaymentMethod, "CARTE_BANCAIRE" | "MOBILE_MONEY">,
  ) => {
    setWidgetError(null);
    setProviderTransactionId(null);
    setConfirmationStatus(null);
    setPaymentCheckout(null);
    try {
      const checkout = await createCheckout(
        reservation.id,
        method,
        crypto.randomUUID(),
      );
      setPaymentCheckout(checkout);
    } catch (error) {
      setWidgetError(error instanceof Error ? error.message : "Impossible d’initialiser le paiement.");
    }
  };

  const handleRetryCheckout = () => {
    if (!reservationToPay) return;
    void initializeCheckout(reservationToPay, checkoutPaymentMethod.current);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    if (!paymentCheckout || !reservationToPay || paymentConfirmationInFlight.current) return;
    paymentConfirmationInFlight.current = true;
    setProviderTransactionId(transactionId);
    setWidgetError(null);
    try {
      const payment = await confirmCheckout(paymentCheckout.transaction_ref, transactionId);
      if (
        payment.transaction_ref !== paymentCheckout.transaction_ref ||
        payment.reservation_reference !== reservationToPay.reference ||
        payment.amount !== paymentCheckout.amount ||
        payment.currency !== paymentCheckout.currency
      ) {
        throw new Error("La confirmation reçue ne correspond pas à cette réservation.");
      }
      setConfirmationStatus(payment.status);
      if (payment.status === "PAYE") {
        router.push(`/users/reservations/${encodeURIComponent(reservationToPay.reference)}`);
      } else if (payment.status === "ECHOUE") {
        setWidgetError("KKiaPay a indiqué que le paiement a échoué. Vous pouvez effectuer une nouvelle tentative.");
      }
    } catch (error) {
      setWidgetError(error instanceof Error ? error.message : "Impossible de vérifier le paiement.");
    } finally {
      paymentConfirmationInFlight.current = false;
    }
  };

  if (!property) {
    return (
      <main className="min-h-screen px-6 py-24 text-center">
        <p role={loadError ? "alert" : undefined} className={loadError ? "text-rose-700" : "text-slate-600"}>
          {loadError || "Chargement de l’établissement..."}
        </p>
        {loadError && <Link href="/explorer" className="mt-4 inline-block text-sm font-semibold text-emerald-700">Retour aux établissements</Link>}
      </main>
    );
  }

  const backUrl = `/${category?.slug === "loisir" ? "loisirs" : category?.slug ?? "explorer"}${subcategory?.slug ? `/${subcategory.slug}` : ""}/${property.slug}`;
  const subtotal = quote?.subtotal ?? 0;
  const serviceFee = quote?.service_fee ?? 0;
  const totalAmount = quote?.total ?? 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <ReservationStepper currentStep={step} />
      <div className="mx-auto max-w-2xl px-6 py-8">
        <Link href={backUrl} className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à l’établissement
        </Link>

        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          {photos[0] && <img src={photos[0].url} alt={property.name} className="h-16 w-20 shrink-0 rounded-lg object-cover" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{property.name}</p>
            <p className="truncate text-xs text-slate-500"><MapPin className="mr-1 inline h-3 w-3 text-emerald-600" />{[property.address, country?.name ?? property.location_name].filter(Boolean).join(", ")}</p>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="font-semibold text-slate-700">{property.rating.toFixed(1)}</span>
              <span className="text-slate-400">({property.review_count ?? property.review_ids.length} avis)</span>
            </div>
          </div>
        </div>

        {flowError && <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{flowError}</p>}

        {step === 1 && (
          <Step1StayDetails
            establishment={property}
            isAccommodation={isAccommodation}
            checkIn={checkIn}
            checkOut={checkOut}
            startTime={startTime}
            endTime={endTime}
            adults={adults}
            children={children}
            room={room}
            onCheckInChange={(value) => { setCheckIn(value); clearCalculatedPrice(); }}
            onCheckOutChange={(value) => { setCheckOut(value); clearCalculatedPrice(); }}
            onStartTimeChange={(value) => { setStartTime(value); clearCalculatedPrice(); }}
            onEndTimeChange={(value) => { setEndTime(value); clearCalculatedPrice(); }}
            onAdultsChange={(value) => { setAdults(value); clearCalculatedPrice(); }}
            onChildrenChange={(value) => { setChildren(value); clearCalculatedPrice(); }}
            onRoomChange={(value) => { setRoom(value); idempotencyKey.current = null; }}
            subtotal={quote?.base_subtotal ?? 0}
            nights={nights}
            isCheckingAvailability={isCheckingAvailability || isQuoting}
            availabilityMessage={availabilityMessage}
            isAvailable={availability?.available ?? null}
            onNext={() => { void handleCheckAvailability(); }}
          />
        )}

        {step === 2 && quote && (
          <Step3Payment
            paymentMethod={paymentMethod}
            onPaymentMethodChange={(value) => { setPaymentMethod(value); idempotencyKey.current = null; }}
            subtotal={subtotal}
            serviceFee={serviceFee}
            taxAmount={quote?.tax_amount ?? 0}
            discountAmount={quote?.discount_amount ?? 0}
            totalAmount={totalAmount}
            currency={quote.currency}
            specialRequests={specialRequests}
            onSpecialRequestsChange={(value) => { setSpecialRequests(value); idempotencyKey.current = null; }}
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
          />
        )}

        {step === 3 && quote && (
          <Step4Confirmation
            establishment={{
              name: property.name,
              address: property.address,
              image: photos[0]?.url ?? "",
              categoryName: category?.name ?? "",
            }}
            checkIn={checkIn}
            checkOut={quote.end_date}
            nights={quote.nights ?? nights}
            startTime={quote.start_time}
            endTime={quote.end_time}
            isAccommodation={isAccommodation}
            adults={adults}
            children={children}
            room={room}
            unitPrice={quote.unit_price}
            unitLabel={quote.unit_label}
            priceUnits={quote.price_units}
            subtotal={quote.subtotal}
            serviceFee={quote.service_fee}
            taxAmount={quote.tax_amount}
            discountAmount={quote.discount_amount}
            totalAmount={quote.total}
            specialRequests={specialRequests}
            currency={quote.currency}
            isSubmitting={isCreating}
            onConfirm={() => { void handleConfirm(); }}
            onPrev={() => setStep(2)}
          />
        )}

        {step === 4 && reservationToPay && (
          <KkiapayPaymentStep
            reservation={reservationToPay}
            checkout={paymentCheckout}
            isCreatingCheckout={isCreatingCheckout}
            checkoutError={checkoutError}
            providerTransactionId={providerTransactionId}
            isConfirmingPayment={isConfirmingPayment}
            confirmationError={paymentConfirmationError}
            confirmationStatus={confirmationStatus}
            widgetError={widgetError}
            email={email}
            paymentMethod={checkoutPaymentMethod.current}
            onRetryCheckout={handleRetryCheckout}
            onPaymentSuccess={(transactionId) => { void handlePaymentSuccess(transactionId); }}
            onVerifyPayment={() => {
              if (providerTransactionId) void handlePaymentSuccess(providerTransactionId);
            }}
            onWidgetError={setWidgetError}
          />
        )}
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthenticated={() => { setAuthOpen(false); }}
        title="Connectez-vous pour réserver"
      />
    </main>
  );
}
