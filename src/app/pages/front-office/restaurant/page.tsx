import CategoryListing from "@/components/front-office/CategoryListing";
import { Suspense } from "react";

export default function RestaurantPage() { return (
        <Suspense fallback={<div>Chargement...</div>}>
             <CategoryListing slug="restaurant" />
        </Suspense>
    )}
