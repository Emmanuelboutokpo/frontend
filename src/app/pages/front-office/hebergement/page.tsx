 import { Suspense } from "react";
import CategoryListing from "@/components/front-office/CategoryListing";

export default function HebergementPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <CategoryListing slug="hebergement" />
        </Suspense>
    );
}