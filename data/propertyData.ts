// =====================================================================
// MOCK DATA — LandReservation.com
// 10 établissements fictifs (Hébergement / Restaurant / Loisir)
// Structure normalisée : Category → SubCategory → Establishment
// =====================================================================

export const propertyData = {

  // -----------------------------------------------------------------
  // GÉOGRAPHIE
  // -----------------------------------------------------------------
  Countries: [
    { id: 1, name: "Bénin",   iso_code: "BEN", lat: 9.30769,  lng: 2.315834 },
    { id: 2, name: "Togo",    iso_code: "TGO", lat: 8.6195,   lng: 0.8248   },
    { id: 3, name: "Côte d'Ivoire", iso_code: "CIV", lat: 7.54, lng: -5.5471 },
  ],

  Departments: [
    { id: 1, country_id: 1, name: "Littoral",   capital: "Cotonou",    lat: 6.366667, lng: 2.416667 },
    { id: 2, country_id: 1, name: "Atlantique", capital: "Allada",     lat: 6.666667, lng: 2.25     },
    { id: 3, country_id: 2, name: "Maritime",   capital: "Lomé",       lat: 6.1319,   lng: 1.2228   },
  ],

  Communes: [
    { id: 1, department_id: 1, name: "Cotonou",        type: "Urbaine", lat: 6.365,    lng: 2.418    },
    { id: 2, department_id: 1, name: "Abomey-Calavi",  type: "Urbaine", lat: 6.448333, lng: 2.355556 },
    { id: 3, department_id: 2, name: "Ouidah",         type: "Urbaine", lat: 6.3667,   lng: 2.0833   },
    { id: 4, department_id: 3, name: "Lomé",           type: "Urbaine", lat: 6.1319,   lng: 1.2228   },
  ],

  Districts: [
    { id: 1, commune_id: 1, name: "1er Arrondissement", lat: 6.3655, lng: 2.4185 },
    { id: 2, commune_id: 1, name: "2e Arrondissement",  lat: 6.37,   lng: 2.42   },
    { id: 3, commune_id: 2, name: "1er Arrondissement", lat: 6.4485, lng: 2.3556 },
    { id: 4, commune_id: 3, name: "1er Arrondissement", lat: 6.367,  lng: 2.084  },
    { id: 5, commune_id: 4, name: "1er Arrondissement", lat: 6.132,  lng: 1.223  },
  ],

  Localities: [
    { id: 1, district_id: 1, name: "Ganhi",         type: "Quartier", lat: 6.365, lng: 2.418 },
    { id: 2, district_id: 1, name: "Fidjrossè",     type: "Quartier", lat: 6.35,  lng: 2.42  },
    { id: 3, district_id: 2, name: "Cadjehoun",     type: "Quartier", lat: 6.37,  lng: 2.41  },
    { id: 4, district_id: 3, name: "Calavi Centre", type: "Quartier", lat: 6.448, lng: 2.356 },
    { id: 5, district_id: 4, name: "Ouidah Centre", type: "Quartier", lat: 6.368, lng: 2.085 },
    { id: 6, district_id: 5, name: "Bè-Kpota",      type: "Quartier", lat: 6.132, lng: 1.223 },
  ],

  // -----------------------------------------------------------------
  // ACTEURS
  // -----------------------------------------------------------------
  Owners: [
    { id: 1, name: "Jean Dupont",     phone: "+229 12 34 56 78", email: "jean.dupont@mail.bj" },
    { id: 2, name: "Marie Akofa",     phone: "+229 98 76 54 32", email: "marie.akofa@mail.bj" },
    { id: 3, name: "Thomas Agossou",  phone: "+229 61 23 45 67", email: "thomas.agossou@mail.bj" },
    { id: 4, name: "Sophie Dossou",   phone: "+229 62 34 56 78", email: "sophie.dossou@mail.bj" },
    { id: 5, name: "Paul Lawson",     phone: "+228 90 11 22 33", email: "paul.lawson@mail.tg" },
  ],

  Tenants: [
    { id: 1, name: "Koffi Mensah",   phone: "+229 11 22 33 44" },
    { id: 2, name: "Amina Salami",   phone: "+229 55 66 77 88" },
    { id: 3, name: "Yves Adékambi",  phone: "+229 21 32 43 54" },
    { id: 4, name: "Stella Zannou",  phone: "+229 22 43 54 65" },
    { id: 5, name: "Roger Hounkpè",  phone: "+229 23 54 65 76" },
  ],

  // -----------------------------------------------------------------
  // CATÉGORIES & SOUS-CATÉGORIES
  // -----------------------------------------------------------------
  Categories: [
    { id: 1, name: "Hébergement", slug: "hebergement", icon: "bed",      has_subcategories: true,  description: "Trouvez un endroit où dormir." },
    { id: 2, name: "Restaurant",  slug: "restaurant",  icon: "utensils", has_subcategories: false, description: "Découvrez des restaurants." },
    { id: 3, name: "Loisir",      slug: "loisir",      icon: "compass",  has_subcategories: true,  description: "Plages, bars, parcs et plus." },
  ],

  SubCategories: [
    // Hébergement
    { id: 1,  category_id: 1, name: "Hôtel",          slug: "hotel",         icon: "hotel" },
    { id: 2,  category_id: 1, name: "Auberge",        slug: "auberge",       icon: "hostel" },
    { id: 3,  category_id: 1, name: "Résidence",      slug: "residence",     icon: "building-2" },
    { id: 4,  category_id: 1, name: "Chambre",        slug: "chambre",       icon: "door-open" },
    { id: 5,  category_id: 1, name: "Appartement",    slug: "appartement",   icon: "building" },
    { id: 6,  category_id: 1, name: "Villa / Maison", slug: "villa-maison",  icon: "house" },
    { id: 7,  category_id: 1, name: "Bureau",         slug: "bureau",        icon: "briefcase" },
    // Restaurant : aucune sous-catégorie
    // Loisir
    { id: 8,  category_id: 3, name: "Plage",              slug: "plage",              icon: "umbrella" },
    { id: 9,  category_id: 3, name: "Bar",                slug: "bar",                icon: "beer" },
    { id: 10, category_id: 3, name: "Boîte de nuit",      slug: "boite-de-nuit",      icon: "music" },
    { id: 11, category_id: 3, name: "Parc",               slug: "parc",               icon: "trees" },
    { id: 12, category_id: 3, name: "Espace touristique", slug: "espace-touristique", icon: "landmark" },
    { id: 13, category_id: 3, name: "Centre de loisirs",  slug: "centre-de-loisirs",  icon: "ferris-wheel" },
    { id: 14, category_id: 3, name: "Parc d'attraction",  slug: "parc-attraction",    icon: "ferris-wheel" },
  ],

  // -----------------------------------------------------------------
  // RÉFÉRENTIELS
  // -----------------------------------------------------------------
  Amenities: [
    { id: 1,  name: "Wifi",             slug: "wifi",             icon: "wifi" },
    { id: 2,  name: "Climatisation",    slug: "climatisation",    icon: "snowflake" },
    { id: 3,  name: "Piscine",          slug: "piscine",          icon: "waves" },
    { id: 4,  name: "Parking",          slug: "parking",          icon: "car" },
    { id: 5,  name: "Restaurant",       slug: "restaurant",       icon: "utensils" },
    { id: 6,  name: "Petit-déjeuner",   slug: "petit-dejeuner",   icon: "coffee" },
    { id: 7,  name: "Télévision",       slug: "tv",               icon: "tv" },
    { id: 8,  name: "Sécurité 24/7",    slug: "securite",         icon: "shield" },
    { id: 9,  name: "Service de chambre", slug: "room-service",   icon: "concierge-bell" },
    { id: 10, name: "Salle de sport",   slug: "gym",              icon: "dumbbell" },
    { id: 11, name: "Blanchisserie",    slug: "laundry",          icon: "shirt" },
    { id: 12, name: "Terrasse",         slug: "terrasse",         icon: "sun" },
  ],

  PaymentConditions: [
    { id: 1, name: "3 mois d'avance" },
    { id: 2, name: "3 mois de prépayés" },
    { id: 3, name: "Commission agence 1 mois" },
    { id: 4, name: "Paiement à l'arrivée" },
    { id: 5, name: "Acompte 30%" },
  ],

  // -----------------------------------------------------------------
  // ÉTABLISSEMENTS (10)
  // -----------------------------------------------------------------
  Establishments: [

    // ==================== HÉBERGEMENT (6) ====================

    // 1. HÔTEL
    {
      id: 1,
      category_id: 1,
      subcategory_id: 1,              // Hôtel
      owner_id: 1,
      tenant_id: null,
      name: "Hôtel Azalaï Cotonou",
      slug: "hotel-azalai-cotonou",
      description: "Hôtel 4 étoiles au cœur de Cotonou, idéal pour les voyages d'affaires et les séjours touristiques. Chambres climatisées, piscine et restaurant panoramique.",
      address: "Boulevard de la Marina, Cotonou",
      country_id: 1, department_id: 1, commune_id: 1, district_id: 1, locality_id: 1,
      lat: 6.3651, lng: 2.4181,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: 65000,
      price_per_month: null,
      currency: "XOF",
      bedrooms: 1, bathrooms: 1, beds: 1, bed_type: "Queen",
      area: 28,
      max_guests: 2,
      rating: 4.6,
      ratings_detail: { accuracy: 4.7, cleanliness: 4.6, checkin: 4.8, communication: 4.7, location: 4.9, value: 4.4 },
      published_at: "2024-01-15",
      updated_at: "2025-09-01",
      amenity_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      payment_condition_ids: [4, 5],
      photo_ids: [1, 2, 3],
      video_ids: [1],
      review_ids: [1, 2],
    },

    // 2. AUBERGE
    {
      id: 2,
      category_id: 1,
      subcategory_id: 2,              // Auberge
      owner_id: 2,
      tenant_id: null,
      name: "Auberge Le Baobab",
      slug: "auberge-le-baobab",
      description: "Auberge conviviale à Ouidah, parfaite pour les voyageurs sac au dos. Dortoirs et chambres privées, ambiance décontractée.",
      address: "Route des Esclaves, Ouidah",
      country_id: 1, department_id: 2, commune_id: 3, district_id: 4, locality_id: 5,
      lat: 6.368, lng: 2.085,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: 12000,
      price_per_month: null,
      currency: "XOF",
      bedrooms: 1, bathrooms: 1, beds: 4, bed_type: "Mixte",
      area: 25,
      max_guests: 4,
      rating: 4.2,
      ratings_detail: { accuracy: 4.1, cleanliness: 4.0, checkin: 4.3, communication: 4.4, location: 4.5, value: 4.6 },
      published_at: "2024-02-10",
      updated_at: "2025-08-20",
      amenity_ids: [1, 4, 6, 7, 12],
      payment_condition_ids: [4],
      photo_ids: [4, 5],
      video_ids: [],
      review_ids: [3],
    },

    // 3. RÉSIDENCE
    {
      id: 3,
      category_id: 1,
      subcategory_id: 3,              // Résidence
      owner_id: 3,
      tenant_id: null,
      name: "Résidence Les Palmiers",
      slug: "residence-les-palmiers",
      description: "Résidence meublée haut standing à Cadjehoun. Appartements 2 et 3 pièces avec services hôteliers.",
      address: "Rue 12.045, Cadjehoun, Cotonou",
      country_id: 1, department_id: 1, commune_id: 1, district_id: 2, locality_id: 3,
      lat: 6.37, lng: 2.41,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: 45000,
      price_per_month: 450000,
      currency: "XOF",
      bedrooms: 2, bathrooms: 2, beds: 2, bed_type: "King",
      area: 85,
      max_guests: 4,
      rating: 4.7,
      ratings_detail: { accuracy: 4.8, cleanliness: 4.7, checkin: 4.8, communication: 4.9, location: 4.6, value: 4.5 },
      published_at: "2024-03-05",
      updated_at: "2025-09-02",
      amenity_ids: [1, 2, 3, 4, 7, 8, 10, 11, 12],
      payment_condition_ids: [1, 2, 3],
      photo_ids: [6, 7, 8],
      video_ids: [2],
      review_ids: [4, 5],
    },

    // 4. CHAMBRE
    {
      id: 4,
      category_id: 1,
      subcategory_id: 4,              // Chambre
      owner_id: 2,
      tenant_id: null,
      name: "Chambre cozy à Fidjrossè",
      slug: "chambre-cozy-fidjrosse",
      description: "Chambre privée meublée à deux pas de la plage de Fidjrossè. Idéale pour un séjour calme et abordable.",
      address: "Rue 10.234, Fidjrossè, Cotonou",
      country_id: 1, department_id: 1, commune_id: 1, district_id: 1, locality_id: 2,
      lat: 6.35, lng: 2.42,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: 15000,
      price_per_month: 80000,
      currency: "XOF",
      bedrooms: 1, bathrooms: 1, beds: 1, bed_type: "Double",
      area: 20,
      max_guests: 2,
      rating: 4.3,
      ratings_detail: { accuracy: 4.4, cleanliness: 4.3, checkin: 4.5, communication: 4.4, location: 4.6, value: 4.5 },
      published_at: "2024-04-12",
      updated_at: "2025-08-28",
      amenity_ids: [1, 2, 7, 12],
      payment_condition_ids: [4],
      photo_ids: [9, 10],
      video_ids: [],
      review_ids: [6],
    },

    // 5. APPARTEMENT
    {
      id: 5,
      category_id: 1,
      subcategory_id: 5,              // Appartement
      owner_id: 4,
      tenant_id: null,
      name: "Appartement moderne Calavi",
      slug: "appartement-moderne-calavi",
      description: "Appartement 3 pièces entièrement rénové à Calavi Centre, proche de l'université. Parfait pour les étudiants ou jeunes couples.",
      address: "Rue de l'Université, Calavi Centre",
      country_id: 1, department_id: 1, commune_id: 2, district_id: 3, locality_id: 4,
      lat: 6.448, lng: 2.356,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: 25000,
      price_per_month: 180000,
      currency: "XOF",
      bedrooms: 2, bathrooms: 1, beds: 2, bed_type: "Queen",
      area: 70,
      max_guests: 3,
      rating: 4.5,
      ratings_detail: { accuracy: 4.6, cleanliness: 4.5, checkin: 4.7, communication: 4.6, location: 4.4, value: 4.7 },
      published_at: "2024-05-20",
      updated_at: "2025-09-03",
      amenity_ids: [1, 2, 4, 7, 11],
      payment_condition_ids: [1, 2],
      photo_ids: [11, 12, 13],
      video_ids: [3],
      review_ids: [7, 8],
    },

    // 6. VILLA / MAISON
    {
      id: 6,
      category_id: 1,
      subcategory_id: 6,              // Villa / Maison
      owner_id: 1,
      tenant_id: null,
      name: "Villa prestige Ganhi",
      slug: "villa-prestige-ganhi",
      description: "Villa de luxe avec piscine privée et jardin paysager au cœur de Ganhi. 4 chambres, idéale pour les familles ou séjours VIP.",
      address: "Rue du Marché, Ganhi, Cotonou",
      country_id: 1, department_id: 1, commune_id: 1, district_id: 1, locality_id: 1,
      lat: 6.365, lng: 2.418,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: 150000,
      price_per_month: 1200000,
      currency: "XOF",
      bedrooms: 4, bathrooms: 3, beds: 4, bed_type: "King",
      area: 250,
      max_guests: 8,
      rating: 4.9,
      ratings_detail: { accuracy: 5.0, cleanliness: 4.9, checkin: 5.0, communication: 5.0, location: 4.8, value: 4.7 },
      published_at: "2024-01-25",
      updated_at: "2025-09-05",
      amenity_ids: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12],
      payment_condition_ids: [1, 2, 3],
      photo_ids: [14, 15, 16],
      video_ids: [4, 5],
      review_ids: [9, 10],
    },

    // ==================== RESTAURANT (2) ====================

    // 7. RESTAURANT
    {
      id: 7,
      category_id: 2,
      subcategory_id: null,           // Pas de sous-catégorie
      owner_id: 3,
      tenant_id: null,
      name: "Le Fou du Roi",
      slug: "le-fou-du-roi",
      description: "Restaurant gastronomique franco-béninois en bord de mer. Spécialités de poissons grillés et plats du terroir revisités.",
      address: "Boulevard de la Marina, Cotonou",
      country_id: 1, department_id: 1, commune_id: 1, district_id: 1, locality_id: 2,
      lat: 6.3512, lng: 2.4231,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: null,
      price_per_month: null,
      currency: "XOF",
      bedrooms: 0, bathrooms: 1, beds: 0, bed_type: null,
      area: 200,
      max_guests: 60,
      rating: 4.7,
      ratings_detail: { accuracy: 4.8, cleanliness: 4.7, checkin: 4.6, communication: 4.8, location: 4.9, value: 4.5 },
      published_at: "2024-06-01",
      updated_at: "2025-09-04",
      amenity_ids: [1, 2, 4, 5, 7, 12],
      payment_condition_ids: [],
      photo_ids: [17, 18],
      video_ids: [],
      review_ids: [11, 12],
      // Champs spécifiques restaurant
      cuisine_type: "Franco-béninoise",
      opening_hours: "12:00 - 23:00",
      phone: "+229 21 30 00 00",
    },

    // 8. RESTAURANT
    {
      id: 8,
      category_id: 2,
      subcategory_id: null,
      owner_id: 5,
      tenant_id: null,
      name: "Chez Maman Bénin",
      slug: "chez-maman-benin",
      description: "Cuisine béninoise authentique : amiwo, akassa, poulet bicyclette. Ambiance familiale et conviviale à Lomé.",
      address: "Rue des Marchés, Bè-Kpota, Lomé",
      country_id: 2, department_id: 3, commune_id: 4, district_id: 5, locality_id: 6,
      lat: 6.132, lng: 1.223,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: null,
      price_per_month: null,
      currency: "XOF",
      bedrooms: 0, bathrooms: 1, beds: 0, bed_type: null,
      area: 120,
      max_guests: 40,
      rating: 4.4,
      ratings_detail: { accuracy: 4.5, cleanliness: 4.3, checkin: 4.2, communication: 4.6, location: 4.5, value: 4.8 },
      published_at: "2024-07-15",
      updated_at: "2025-08-30",
      amenity_ids: [1, 2, 4, 7],
      payment_condition_ids: [],
      photo_ids: [19, 20],
      video_ids: [],
      review_ids: [13],
      cuisine_type: "Béninoise",
      opening_hours: "11:00 - 22:00",
      phone: "+228 22 21 00 00",
    },

    // ==================== LOISIR (2) ====================

    // 9. PLAGE
    {
      id: 9,
      category_id: 3,
      subcategory_id: 8,              // Plage
      owner_id: 4,
      tenant_id: null,
      name: "Plage de Fidjrossè",
      slug: "plage-de-fidjrosse",
      description: "Plage de sable fin très fréquentée le week-end. Bars de plage, sports nautiques et couchers de soleil exceptionnels.",
      address: "Route de la Plage, Fidjrossè, Cotonou",
      country_id: 1, department_id: 1, commune_id: 1, district_id: 1, locality_id: 2,
      lat: 6.348, lng: 2.425,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: null,
      price_per_month: null,
      currency: "XOF",
      bedrooms: 0, bathrooms: 0, beds: 0, bed_type: null,
      area: 5000,
      max_guests: 500,
      rating: 4.6,
      ratings_detail: { accuracy: 4.7, cleanliness: 4.4, checkin: 4.8, communication: 4.5, location: 4.9, value: 4.7 },
      published_at: "2024-08-01",
      updated_at: "2025-09-01",
      amenity_ids: [4, 5, 12],
      payment_condition_ids: [],
      photo_ids: [21, 22],
      video_ids: [6],
      review_ids: [14, 15],
      opening_hours: "Toute la journée",
      phone: null,
    },

    // 10. BAR
    {
      id: 10,
      category_id: 3,
      subcategory_id: 9,              // Bar
      owner_id: 5,
      tenant_id: null,
      name: "Le Sky Bar Lomé",
      slug: "le-sky-bar-lome",
      description: "Rooftop bar avec vue panoramique sur Lomé. Cocktails signature, DJ le week-end et ambiance chic.",
      address: "Immeuble Sky, Boulevard du 30 Août, Lomé",
      country_id: 2, department_id: 3, commune_id: 4, district_id: 5, locality_id: 6,
      lat: 6.1335, lng: 1.2215,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: null,
      price_per_month: null,
      currency: "XOF",
      bedrooms: 0, bathrooms: 2, beds: 0, bed_type: null,
      area: 300,
      max_guests: 150,
      rating: 4.5,
      ratings_detail: { accuracy: 4.6, cleanliness: 4.5, checkin: 4.4, communication: 4.7, location: 4.8, value: 4.3 },
      published_at: "2024-09-10",
      updated_at: "2025-09-06",
      amenity_ids: [1, 2, 4, 7, 8, 12],
      payment_condition_ids: [],
      photo_ids: [23, 24],
      video_ids: [7],
      review_ids: [16],
      opening_hours: "18:00 - 02:00",
      phone: "+228 90 00 11 22",
    },

    // 11. BOÎTE DE NUIT
    {
      id: 11,
      category_id: 3,
      subcategory_id: 10,
      owner_id: 5,
      tenant_id: null,
      name: "Le Pulse Night Club",
      slug: "le-pulse-night-club",
      description: "Club de nuit moderne à Lomé avec programmation DJ, espace VIP et ambiance musicale jusqu'au petit matin.",
      address: "Boulevard du 30 Août, Lomé",
      country_id: 2, department_id: 3, commune_id: 4, district_id: 5, locality_id: 6,
      lat: 6.1342, lng: 1.2222,
      status: "APPROVED",
      availability_status: "AVAILABLE",
      price_per_night: null,
      price_per_month: null,
      currency: "XOF",
      bedrooms: 0, bathrooms: 3, beds: 0, bed_type: null,
      area: 450,
      max_guests: 350,
      rating: 4.4,
      ratings_detail: { accuracy: 4.3, cleanliness: 4.2, checkin: 4.5, communication: 4.6, location: 4.7, value: 4.2 },
      published_at: "2024-10-02",
      updated_at: "2025-09-07",
      amenity_ids: [1, 4, 8, 12],
      payment_condition_ids: [],
      photo_ids: [25, 26],
      video_ids: [],
      review_ids: [],
      opening_hours: "22:00 - 05:00",
      phone: "+228 91 22 33 44",
    },
  ],

  // -----------------------------------------------------------------
  // PHOTOS (séparées, référencées par photo_ids)
  // -----------------------------------------------------------------
  Photos: [
    { id: 1,  establishment_id: 1, url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 2,  establishment_id: 1, url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },
    { id: 3,  establishment_id: 1, url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 4,  establishment_id: 2, url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 5,  establishment_id: 2, url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 6,  establishment_id: 3, url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 7,  establishment_id: 3, url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },
    { id: 8,  establishment_id: 3, url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 9,  establishment_id: 4, url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: true  },
    { id: 10, establishment_id: 4, url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 11, establishment_id: 5, url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 12, establishment_id: 5, url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },
    { id: 13, establishment_id: 5, url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 14, establishment_id: 6, url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 15, establishment_id: 6, url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },
    { id: 16, establishment_id: 6, url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 17, establishment_id: 7, url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 18, establishment_id: 7, url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 19, establishment_id: 8, url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 20, establishment_id: 8, url: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 21, establishment_id: 9, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 22, establishment_id: 9, url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },

    { id: 23, establishment_id: 10, url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 24, establishment_id: 10, url: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },
    { id: 25, establishment_id: 11, url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85", width_ratio: 2, height_ratio: 1, is_cover: true  },
    { id: 26, establishment_id: 11, url: "https://images.unsplash.com/photo-1571266028243-d220c9c3b5c1?auto=format&fit=crop&w=1200&q=85", width_ratio: 1, height_ratio: 1, is_cover: false },
  ],

  // -----------------------------------------------------------------
  // VIDÉOS
  // -----------------------------------------------------------------
  Videos: [
    { id: 1, establishment_id: 1, title: "Visite de l'hôtel",       url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", thumbnail: "https://picsum.photos/seed/vid1/400/300", duration: "1:45" },
    { id: 2, establishment_id: 3, title: "Tour de la résidence",    url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", thumbnail: "https://picsum.photos/seed/vid2/400/300", duration: "2:10" },
    { id: 3, establishment_id: 5, title: "Appartement Calavi",      url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", thumbnail: "https://picsum.photos/seed/vid3/400/300", duration: "1:30" },
    { id: 4, establishment_id: 6, title: "Villa prestige - extérieur", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", thumbnail: "https://picsum.photos/seed/vid4/400/300", duration: "3:00" },
    { id: 5, establishment_id: 6, title: "Villa prestige - intérieur", url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", thumbnail: "https://picsum.photos/seed/vid5/400/300", duration: "2:20" },
    { id: 6, establishment_id: 9, title: "Plage de Fidjrossè",      url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", thumbnail: "https://picsum.photos/seed/vid6/400/300", duration: "1:15" },
    { id: 7, establishment_id: 10, title: "Ambiance Sky Bar",       url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", thumbnail: "https://picsum.photos/seed/vid7/400/300", duration: "0:50" },
  ],

  // -----------------------------------------------------------------
  // AVIS
  // -----------------------------------------------------------------
  Reviews: [
    { id: 1,  establishment_id: 1, author_name: "Marie Dupont",    avatar: "https://i.pravatar.cc/100?img=1",  rating: 5, comment: "Séjour parfait, personnel aux petits soins.", created_at: "2025-08-10", years_as_member: 2 },
    { id: 2,  establishment_id: 1, author_name: "Thomas Martin",   avatar: "https://i.pravatar.cc/100?img=2",  rating: 4, comment: "Très bon hôtel, petit bémol sur le bruit.", created_at: "2025-08-22", years_as_member: 1 },
    { id: 3,  establishment_id: 2, author_name: "Sophie Leroy",    avatar: "https://i.pravatar.cc/100?img=3",  rating: 4, comment: "Auberge sympa, ambiance conviviale.", created_at: "2025-07-15", years_as_member: 3 },
    { id: 4,  establishment_id: 3, author_name: "Jean Petit",      avatar: "https://i.pravatar.cc/100?img=4",  rating: 5, comment: "Résidence impeccable, je recommande.", created_at: "2025-08-01", years_as_member: 1 },
    { id: 5,  establishment_id: 3, author_name: "Camille Rousseau", avatar: "https://i.pravatar.cc/100?img=5", rating: 5, comment: "Encore mieux que sur les photos !", created_at: "2025-08-18", years_as_member: 4 },
    { id: 6,  establishment_id: 4, author_name: "Awa Diallo",      avatar: "https://i.pravatar.cc/100?img=6",  rating: 4, comment: "Chambre propre et bien située.", created_at: "2025-07-28", years_as_member: 2 },
    { id: 7,  establishment_id: 5, author_name: "Ibrahim Sow",     avatar: "https://i.pravatar.cc/100?img=7",  rating: 5, comment: "Appartement nickel, hôte très réactif.", created_at: "2025-08-12", years_as_member: 3 },
    { id: 8,  establishment_id: 5, author_name: "Fatou Ndiaye",    avatar: "https://i.pravatar.cc/100?img=8",  rating: 4, comment: "Bon rapport qualité/prix.", created_at: "2025-08-25", years_as_member: 1 },
    { id: 9,  establishment_id: 6, author_name: "Kofi Annan",      avatar: "https://i.pravatar.cc/100?img=9",  rating: 5, comment: "Villa exceptionnelle, piscine magnifique.", created_at: "2025-08-05", years_as_member: 5 },
    { id: 10, establishment_id: 6, author_name: "Aïcha Bello",     avatar: "https://i.pravatar.cc/100?img=10", rating: 5, comment: "Un séjour de rêve, merci !", created_at: "2025-08-20", years_as_member: 2 },
    { id: 11, establishment_id: 7, author_name: "Marc Tohou",      avatar: "https://i.pravatar.cc/100?img=11", rating: 5, comment: "Cuisine raffinée, cadre idyllique.", created_at: "2025-08-08", years_as_member: 3 },
    { id: 12, establishment_id: 7, author_name: "Claire Dubois",   avatar: "https://i.pravatar.cc/100?img=12", rating: 4, comment: "Très bon restaurant, service un peu lent.", created_at: "2025-08-19", years_as_member: 1 },
    { id: 13, establishment_id: 8, author_name: "Yao Kossi",       avatar: "https://i.pravatar.cc/100?img=13", rating: 5, comment: "Meilleur amiwo de Lomé !", created_at: "2025-07-30", years_as_member: 4 },
    { id: 14, establishment_id: 9, author_name: "Nadia Traoré",    avatar: "https://i.pravatar.cc/100?img=14", rating: 5, comment: "Plage magnifique, coucher de soleil magique.", created_at: "2025-08-14", years_as_member: 2 },
    { id: 15, establishment_id: 9, author_name: "David Kpodo",     avatar: "https://i.pravatar.cc/100?img=15", rating: 4, comment: "Belle plage, un peu bondée le week-end.", created_at: "2025-08-27", years_as_member: 1 },
    { id: 16, establishment_id: 10, author_name: "Linda Adjovi",   avatar: "https://i.pravatar.cc/100?img=16", rating: 5, comment: "Vue imprenable et cocktails délicieux.", created_at: "2025-08-09", years_as_member: 3 },
  ],

  // -----------------------------------------------------------------
  // DISPONIBILITÉS (calendrier simplifié)
  // -----------------------------------------------------------------
  Availability: [
    // Hôtel Azalaï (id 1) — quelques dates bloquées
    { id: 1, establishment_id: 1, date: "2025-10-01", is_blocked: true,  price_override: null },
    { id: 2, establishment_id: 1, date: "2025-10-02", is_blocked: true,  price_override: null },
    { id: 3, establishment_id: 1, date: "2025-12-24", is_blocked: false, price_override: 85000 },
    { id: 4, establishment_id: 1, date: "2025-12-25", is_blocked: false, price_override: 85000 },

    // Villa prestige (id 6) — haute saison
    { id: 5, establishment_id: 6, date: "2025-12-31", is_blocked: false, price_override: 250000 },
    { id: 6, establishment_id: 6, date: "2026-01-01", is_blocked: false, price_override: 250000 },
  ],
};

export type PropertyData = typeof propertyData;