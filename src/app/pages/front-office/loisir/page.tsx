import { Suspense } from "react";
import CategoryListing from "../../../../components/front-office/CategoryListing";

 
 
export default function LoisirPage() {
     return (
    <Suspense fallback={<div>Chargement...</div>}>
    <CategoryListing slug="loisir" />
    </Suspense>
 
)}
 