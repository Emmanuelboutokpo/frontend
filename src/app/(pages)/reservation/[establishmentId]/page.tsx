"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { ArrowLeft, MapPin, Star } from "lucide-react";

import { usePropertyStore, useAuthStore, useBookingStore } from "@/store";

import { ReservationStepper } from "@/components/front-office/reservation/ReservationStepper";
import { Step1StayDetails } from "@/components/front-office/reservation/steps/Step2StayDetails";
import { Step2ClientInfo } from "@/components/front-office/reservation/steps/Step3ClientInfo";
import { Step3Payment } from "@/components/front-office/reservation/steps/Step4Payment";
import { Step4Confirmation } from "@/components/front-office/reservation/steps/Step5Confirmation";
 
interface Props {
  params: Promise<{ establishmentId: string }>;
}

export default function ReservationPage({ params }: Props) {
  // ✅ Déballe params avec use()
  const { establishmentId: establishmentIdStr } = use(params);

  const router = useRouter();
  const searchParams = useSearchParams();

  const data = usePropertyStore((s) => s.data);
  const addBooking = useBookingStore((s) => s.addBooking);

  const user = useAuthStore(
    useShallow((s) => ({
      firstName: s.firstName ?? "",
      email: s.email ?? "",
    }))
  );

  const establishmentId = Number(establishmentIdStr);
  const property = data.Establishments.find((e) => e.id === establishmentId);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") ?? "");
  const [adults, setAdults] = useState(Number(searchParams.get("guests")) || 2);
  const [children, setChildren] = useState(0);
  const [room, setRoom] = useState("deluxe");

  const [clientInfo, setClientInfo] = useState({
    firstName: user.firstName,
    lastName: "",
    email: user.email,
    phone: "",
    country: "Bénin",
    specialRequest: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  useEffect(() => {
    if (!property) router.push("/explorer");
  }, [property, router]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(
      0,
      Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
      )
    );
  }, [checkIn, checkOut]);

  const subtotal = (property?.price_per_night ?? 0) * nights;
  const serviceFee = 0;
  const totalAmount = subtotal + serviceFee;

  const photos = useMemo(() => {
    if (!property) return [];
    return data.Photos.filter((p) => property.photo_ids.includes(p.id));
  }, [property, data.Photos]);

  const category = property
    ? data.Categories.find((c) => c.id === property.category_id)
    : null;
  const subcategory = property
    ? data.SubCategories.find((sc) => sc.id === property.subcategory_id)
    : null;
  const country = property
    ? data.Countries.find((c) => c.id === property.country_id)
    : null;

  const handleConfirm = async () => {
    if (!property) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    addBooking({
      propertyName: property.name,
      propertyAddress: property.address,
      checkIn,
      checkOut,
      guests: adults + children,
      nights,
      amount: totalAmount,
      currency: property.currency,
      status: paymentMethod === "transfer" ? "pending" : "paid",
      paymentProvider:
        paymentMethod === "card"
          ? "stripe"
          : paymentMethod === "mobile"
          ? "fedapay"
          : "kkpays",
    });

    setIsSubmitting(false);
    router.push("/users/reservations");
  };

  if (!property) return null;

  const backUrl = `/${category?.slug ?? "explorer"}${
    subcategory?.slug ? `/${subcategory.slug}` : ""
  }/${property.slug}`;

  return (
    <main className="min-h-screen bg-slate-50">
      <ReservationStepper currentStep={step} />

      <div className="mx-auto max-w-2xl px-6 py-8">
        <Link
          href={backUrl}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour à l'établissement
        </Link>

        {/* Carte récap établissement */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <img
            src={photos[0]?.url ?? ""}
            alt={property.name}
            className="h-16 w-20 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {property.name}
            </p>
            <p className="truncate text-xs text-slate-500">
              <MapPin className="mr-1 inline h-3 w-3 text-emerald-600" />
              {property.address}
              {country && `, ${country.name}`}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="font-semibold text-slate-700">
                {property.rating.toFixed(1)}
              </span>
              <span className="text-slate-400">
                ({property.review_ids.length} avis)
              </span>
            </div>
          </div>
        </div>

        {/* Étapes */}
        {step === 1 && (
          <Step1StayDetails
            establishment={property}
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            children={children}
            room={room}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onAdultsChange={setAdults}
            onChildrenChange={setChildren}
            onRoomChange={setRoom}
            subtotal={subtotal}
            nights={nights}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2ClientInfo
            firstName={clientInfo.firstName}
            lastName={clientInfo.lastName}
            email={clientInfo.email}
            phone={clientInfo.phone}
            country={clientInfo.country}
            specialRequest={clientInfo.specialRequest}
            onFieldChange={(field, value) =>
              setClientInfo((prev) => ({ ...prev, [field]: value }))
            }
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3Payment
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            subtotal={subtotal}
            serviceFee={serviceFee}
            totalAmount={totalAmount}
            currency={property.currency}
            onNext={() => setStep(4)}
            onPrev={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Step4Confirmation
            establishment={{
              name: property.name,
              address: property.address,
              image: photos[0]?.url ?? "",
              categoryName: category?.name ?? "",
            }}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            adults={adults}
            children={children}
            room={room}
            client={clientInfo}
            pricePerNight={property.price_per_night ?? 0}
            subtotal={subtotal}
            serviceFee={serviceFee}
            totalAmount={totalAmount}
            currency={property.currency}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirm}
            onPrev={() => setStep(3)}
          />
        )}
      </div>
    </main>
  );
}