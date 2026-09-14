import { Property } from "@/types/types";
import icons from "./icons";

export const settings = [
  {
    title: "Ma propriété",
    icon: icons.calendar,
  },
  {
    title: "Paiements",
    icon: icons.wallet,
  },
  {
    title: "Mon profil",
    icon: icons.person,
  },
  {
    title: "Notifications",
    icon: icons.bell,
  },
  {
    title: "Securité",
    icon: icons.shield,
  },
  {
    title: "Langue",
    icon: icons.language,
  },
  {
    title: "Aidez-moi",
    icon: icons.info,
  },

];

export const propertyData: Property = {
  Pays: [
    {
      id_pays: 1,
      nom_pays: "Bénin",
      code_iso: "BEN",
      latitude: 9.30769,
      longitude: 2.315834
    },
    {
      id_pays: 2,
      nom_pays: "France",
      code_iso: "FRA",
      latitude: 46.2276,
      longitude: 2.2137
    },
    {
      id_pays: 3,
      nom_pays: "Nigeria",
      code_iso: "NGA",
      latitude: 9.082,
      longitude: 8.6753
    },
    {
      id_pays: 4,
      nom_pays: "Togo",
      code_iso: "TGO",
      latitude: 8.6195,
      longitude: 0.8248
    },
    {
      id_pays: 5,
      nom_pays: "Ghana",
      code_iso: "GHA",
      latitude: 7.9465,
      longitude: -1.0232
    },
    {
      id_pays: 6,
      nom_pays: "Burkina Faso",
      code_iso: "BFA",
      latitude: 12.2383,
      longitude: -1.5616
    },
    {
      id_pays: 7,
      nom_pays: "Niger",
      code_iso: "NER",
      latitude: 17.6078,
      longitude: 8.0817
    },
    {
      id_pays: 8,
      nom_pays: "Côte d'Ivoire",
      code_iso: "CIV",
      latitude: 7.54,
      longitude: -5.5471
    },
    {
      id_pays: 9,
      nom_pays: "Sénégal",
      code_iso: "SEN",
      latitude: 14.4974,
      longitude: -14.4524
    },
    {
      id_pays: 10,
      nom_pays: "Mali",
      code_iso: "MLI",
      latitude: 17.5707,
      longitude: -3.9962
    },
    {
      id_pays: 11,
      nom_pays: "Allemagne",
      code_iso: "DEU",
      latitude: 51.1657,
      longitude: 10.4515
    },
    {
      id_pays: 12,
      nom_pays: "Belgique",
      code_iso: "BEL",
      latitude: 50.5039,
      longitude: 4.4699
    }
  ],
  Departement: [
    {
      id_dep: 1,
      id_pays: 1,
      nom_dep: "Littoral",
      capitale_dep: "Cotonou",
      latitude: 6.366667,
      longitude: 2.416667
    },
    {
      id_dep: 2,
      id_pays: 1,
      nom_dep: "Atlantique",
      capitale_dep: "Allada",
      latitude: 6.666667,
      longitude: 2.25
    },
    {
      id_dep: 3,
      id_pays: 1,
      nom_dep: "Ouémé",
      capitale_dep: "Porto-Novo",
      latitude: 6.4969,
      longitude: 2.6289
    },
    {
      id_dep: 4,
      id_pays: 1,
      nom_dep: "Plateau",
      capitale_dep: "Sakété",
      latitude: 6.7167,
      longitude: 2.6667
    },
    {
      id_dep: 5,
      id_pays: 1,
      nom_dep: "Zou",
      capitale_dep: "Abomey",
      latitude: 7.1833,
      longitude: 1.9833
    },
    {
      id_dep: 6,
      id_pays: 1,
      nom_dep: "Collines",
      capitale_dep: "Dassa-Zoumé",
      latitude: 7.75,
      longitude: 2.1833
    },
    {
      id_dep: 7,
      id_pays: 1,
      nom_dep: "Borgou",
      capitale_dep: "Parakou",
      latitude: 9.35,
      longitude: 2.6167
    },
    {
      id_dep: 8,
      id_pays: 1,
      nom_dep: "Alibori",
      capitale_dep: "Kandi",
      latitude: 11.1347,
      longitude: 2.9386
    },
    {
      id_dep: 9,
      id_pays: 1,
      nom_dep: "Atacora",
      capitale_dep: "Natitingou",
      latitude: 10.3,
      longitude: 1.3667
    },
    {
      id_dep: 10,
      id_pays: 1,
      nom_dep: "Donga",
      capitale_dep: "Djougou",
      latitude: 9.7,
      longitude: 1.6667
    },
    {
      id_dep: 11,
      id_pays: 1,
      nom_dep: "Couffo",
      capitale_dep: "Aplahoué",
      latitude: 6.9333,
      longitude: 1.6833
    },
    {
      id_dep: 12,
      id_pays: 1,
      nom_dep: "Mono",
      capitale_dep: "Lokossa",
      latitude: 6.6333,
      longitude: 1.7167
    }
  ],
  Commune: [
    {
      id_commune: 1,
      id_dep: 1,
      nom_commune: "Cotonou",
      type_commune: "Urbaine",
      latitude: 6.365,
      longitude: 2.418
    },
    {
      id_commune: 2,
      id_dep: 1,
      nom_commune: "Abomey-Calavi",
      type_commune: "Urbaine",
      latitude: 6.448333,
      longitude: 2.355556
    },
    {
      id_commune: 3,
      id_dep: 1,
      nom_commune: "Porto-Novo",
      type_commune: "Urbaine",
      latitude: 6.4969,
      longitude: 2.6289
    },
    {
      id_commune: 4,
      id_dep: 1,
      nom_commune: "Sèmè-Podji",
      type_commune: "Urbaine",
      latitude: 6.3667,
      longitude: 2.4667
    },
    {
      id_commune: 5,
      id_dep: 2,
      nom_commune: "Ouidah",
      type_commune: "Urbaine",
      latitude: 6.3667,
      longitude: 2.0833
    },
    {
      id_commune: 6,
      id_dep: 2,
      nom_commune: "Allada",
      type_commune: "Urbaine",
      latitude: 6.6667,
      longitude: 2.25
    },
    {
      id_commune: 7,
      id_dep: 3,
      nom_commune: "Adjarra",
      type_commune: "Urbaine",
      latitude: 6.5333,
      longitude: 2.6667
    },
    {
      id_commune: 8,
      id_dep: 3,
      nom_commune: "Avrankou",
      type_commune: "Urbaine",
      latitude: 6.55,
      longitude: 2.6667
    },
    {
      id_commune: 9,
      id_dep: 4,
      nom_commune: "Sakété",
      type_commune: "Urbaine",
      latitude: 6.7167,
      longitude: 2.6667
    },
    {
      id_commune: 10,
      id_dep: 4,
      nom_commune: "Kétou",
      type_commune: "Urbaine",
      latitude: 7.3667,
      longitude: 2.6
    },
    {
      id_commune: 11,
      id_dep: 5,
      nom_commune: "Abomey",
      type_commune: "Urbaine",
      latitude: 7.1833,
      longitude: 1.9833
    },
    {
      id_commune: 12,
      id_dep: 5,
      nom_commune: "Bohicon",
      type_commune: "Urbaine",
      latitude: 7.1667,
      longitude: 2.0667
    }
  ],
  Arrondissement: [
    {
      id_arrond: 1,
      id_commune: 1,
      nom_arrond: "1er Arrondissement",
      latitude: 6.3655,
      longitude: 2.4185
    },
    {
      id_arrond: 2,
      id_commune: 1,
      nom_arrond: "2e Arrondissement",
      latitude: 6.37,
      longitude: 2.42
    },
    {
      id_arrond: 3,
      id_commune: 1,
      nom_arrond: "3e Arrondissement",
      latitude: 6.368,
      longitude: 2.417
    },
    {
      id_arrond: 4,
      id_commune: 1,
      nom_arrond: "4e Arrondissement",
      latitude: 6.369,
      longitude: 2.419
    },
    {
      id_arrond: 5,
      id_commune: 1,
      nom_arrond: "5e Arrondissement",
      latitude: 6.371,
      longitude: 2.421
    },
    {
      id_arrond: 6,
      id_commune: 2,
      nom_arrond: "1er Arrondissement",
      latitude: 6.4485,
      longitude: 2.3556
    },
    {
      id_arrond: 7,
      id_commune: 2,
      nom_arrond: "2e Arrondissement",
      latitude: 6.449,
      longitude: 2.356
    },
    {
      id_arrond: 8,
      id_commune: 3,
      nom_arrond: "1er Arrondissement",
      latitude: 6.497,
      longitude: 2.629
    },
    {
      id_arrond: 9,
      id_commune: 3,
      nom_arrond: "2e Arrondissement",
      latitude: 6.498,
      longitude: 2.63
    },
    {
      id_arrond: 10,
      id_commune: 4,
      nom_arrond: "1er Arrondissement",
      latitude: 6.367,
      longitude: 2.467
    },
    {
      id_arrond: 11,
      id_commune: 5,
      nom_arrond: "1er Arrondissement",
      latitude: 6.367,
      longitude: 2.084
    },
    {
      id_arrond: 12,
      id_commune: 6,
      nom_arrond: "1er Arrondissement",
      latitude: 6.667,
      longitude: 2.251
    }
  ],
  Ville_Village: [
    {
      id_ville: 1,
      id_commune: 1,
      id_arrond: 1,
      nom_ville: "Ganhi",
      type: "Quartier",
      latitude: 6.365,
      longitude: 2.418
    },
    {
      id_ville: 2,
      id_commune: 1,
      id_arrond: 1,
      nom_ville: "Godomey",
      type: "Quartier",
      latitude: 6.4,
      longitude: 2.35
    },
    {
      id_ville: 3,
      id_commune: 1,
      id_arrond: 1,
      nom_ville: "Fidjrossè",
      type: "Quartier",
      latitude: 6.35,
      longitude: 2.42
    },
    {
      id_ville: 4,
      id_commune: 1,
      id_arrond: 2,
      nom_ville: "Cadjehoun",
      type: "Quartier",
      latitude: 6.37,
      longitude: 2.41
    },
    {
      id_ville: 5,
      id_commune: 1,
      id_arrond: 3,
      nom_ville: "Saint Jean",
      type: "Quartier",
      latitude: 6.368,
      longitude: 2.417
    },
    {
      id_ville: 6,
      id_commune: 2,
      id_arrond: 6,
      nom_ville: "Calavi Centre",
      type: "Quartier",
      latitude: 6.448,
      longitude: 2.356
    },
    {
      id_ville: 7,
      id_commune: 2,
      id_arrond: 7,
      nom_ville: "Togba",
      type: "Quartier",
      latitude: 6.449,
      longitude: 2.357
    },
    {
      id_ville: 8,
      id_commune: 3,
      id_arrond: 8,
      nom_ville: "Ouando",
      type: "Quartier",
      latitude: 6.497,
      longitude: 2.63
    },
    {
      id_ville: 9,
      id_commune: 3,
      id_arrond: 9,
      nom_ville: "Avakpa",
      type: "Quartier",
      latitude: 6.498,
      longitude: 2.631
    },
    {
      id_ville: 10,
      id_commune: 4,
      id_arrond: 10,
      nom_ville: "Ekpè",
      type: "Quartier",
      latitude: 6.368,
      longitude: 2.468
    },
    {
      id_ville: 11,
      id_commune: 5,
      id_arrond: 11,
      nom_ville: "Ouidah Centre",
      type: "Quartier",
      latitude: 6.368,
      longitude: 2.085
    },
    {
      id_ville: 12,
      id_commune: 6,
      id_arrond: 12,
      nom_ville: "Allada Centre",
      type: "Quartier",
      latitude: 6.668,
      longitude: 2.252
    }
  ],
  Proprietaire: [
    {
      id_proprietaire: 1,
      nom: "Jean Dupont",
      telephone: "+229 12 34 56 78"
    },
    {
      id_proprietaire: 2,
      nom: "Marie Akofa",
      telephone: "+229 98 76 54 32"
    },
    {
      id_proprietaire: 3,
      nom: "Thomas Agossou",
      telephone: "+229 61 23 45 67"
    },
    {
      id_proprietaire: 4,
      nom: "Sophie Dossou",
      telephone: "+229 62 34 56 78"
    },
    {
      id_proprietaire: 5,
      nom: "Paul Lawson",
      telephone: "+229 63 45 67 89"
    },
    {
      id_proprietaire: 6,
      nom: "Esther Yayi",
      telephone: "+229 64 56 78 90"
    },
    {
      id_proprietaire: 7,
      nom: "Marc Tohou",
      telephone: "+229 65 67 89 01"
    },
    {
      id_proprietaire: 8,
      nom: "Alice Zinsou",
      telephone: "+229 66 78 90 12"
    },
    {
      id_proprietaire: 9,
      nom: "Jacques Adékambi",
      telephone: "+229 67 89 01 23"
    },
    {
      id_proprietaire: 10,
      nom: "Christine Hountondji",
      telephone: "+229 68 90 12 34"
    },
    {
      id_proprietaire: 11,
      nom: "Pierre Gbèdo",
      telephone: "+229 69 01 23 45"
    },
    {
      id_proprietaire: 12,
      nom: "Rachel Alao",
      telephone: "+229 60 12 34 56"
    }
  ],
  Locataire: [
    {
      id: 1,
      nom: "Koffi Mensah",
      telephone: "+229 11 22 33 44"
    },
    {
      id: 2,
      nom: "Amina Salami",
      telephone: "+229 55 66 77 88"
    },
    {
      id: 3,
      nom: "Yves Adékambi",
      telephone: "+229 21 32 43 54"
    },
    {
      id: 4,
      nom: "Stella Zannou",
      telephone: "+229 22 43 54 65"
    },
    {
      id: 5,
      nom: "Roger Hounkpè",
      telephone: "+229 23 54 65 76"
    },
    {
      id: 6,
      nom: "Patricia Dossou",
      telephone: "+229 24 65 76 87"
    },
    {
      id: 7,
      nom: "Eric Tovivo",
      telephone: "+229 25 76 87 98"
    },
    {
      id: 8,
      nom: "Vanessa Agbessi",
      telephone: "+229 26 87 98 09"
    },
    {
      id: 9,
      nom: "Gérard Hounsinou",
      telephone: "+229 27 98 09 10"
    },
    {
      id: 10,
      nom: "Dorcas Gbaguidi",
      telephone: "+229 28 09 10 21"
    },
    {
      id: 11,
      nom: "Fabrice Kpovièdè",
      telephone: "+229 29 10 21 32"
    },
    {
      id: 12,
      nom: "Jessica Ahouandjinou",
      telephone: "+229 20 21 32 43"
    }
  ],
  Categories: [
    {
      name: 'Chambres',
      icon: 'home',
    },
    {
      name: 'Appartements',
      icon: 'apartment',
    },
    {
      name: 'villa',
      icon: 'house-siding',
    },
    {
      name: 'Bureaux',
      icon: 'home-repair-service',
    }
  ],
  Rooms: [
    {
      id_maison: 1,
      name: "Villa Luxe à Ganhi",
      id_proprietaire: 1,
      id_locataire: 1,
      id_dep: 1,
      id_commune: 1,
      id_arrond: 1,
      id_ville: 1,
      id_cat: 1,
      last_scraped: "2025-09-08",
      type_property: "Sanitaire",
      listing_url: "https://www.airbnb.com/rooms/1563562",
      nmbre_menage: 4,
      localisation: "100 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "123 Rue du Marché",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845616.jpg?k=87bc315f35830189d9a1c935c3e167e648543c27f39ee4cafc5cf73ee24393b9&o=&hp=1",
      latitude: 6.3651,
      longitude: 2.4181,
      bathrooms: 2,
      bedrooms: 3,
      beds: 3,
      bed_type: "Queen",
      area: 150,
      prix_mois: 250000,
      statut: "disponible",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun  Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sunCentral and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sunCentral and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-10-25",
      review_scores_rating: 4.8,
      review_scores_accuracy: 4.9,
      review_scores_cleanliness: 4.7,
      review_scores_checkin: 4.8,
      review_scores_communication: 4.9,
      review_scores_location: 4.7,
      review_scores_value: 4.6,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.4181,
        lat: 6.3651
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },
        {
          id_amenities: 9,
          name: "Wifi",
          icon: icons.wifi,
        },
        {
          id_amenities: 10,
          name: "Pet Center",
          icon: icons.dog,
        },
      ],
      photos: [
        {
          id: "110",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223496641.jpg?k=070266558a879c2926e5511569c4828a007a3e1057b63ccfa30120c859341d1d&o=&hp=1",
        },
        {
          id: "111",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223495252.jpg?k=46de660c903dde8a4250610e13a17241645853c4088d76e7a7741b6bc52ad8ea&o=&hp=1",
        },
        {
          id: "112",
          widthRatio: 2,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223494915.jpg?k=b1c09ff0ff09bd86d06861cfebb76a937090f7339a09ca5d53662db340d90cba&o=&hp=1",
        },
        {
          id: "113",
          widthRatio: 1,
          heightRatio: 2,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223498294.jpg?k=445b45130c2315805662dd6df9ad44009097b06e89d01aa0afc473b54ba04af5&o=&hp=1",
        },
        {
          id: "114",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223497917.jpg?k=10ebeb3f85490fd2cc9fd3d6f8389ea7f1a35c9e4b29b219bccd6eb89c6a1cd5&o=&hp=1",
        },
        {
          id: "115",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223498097.jpg?k=51244caaa9e4e33ad7d1580b0a1fcf4795c0db3a0fb3d625720e2f0ec7646a1c&o=&hp=1",
        },
        {
          id: "116",
          widthRatio: 2,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223498063.jpg?k=7b456a08a5becb5bf3f9b181719cb9d8d61c8a9e193ab07fe1b5a2c8887da3b6&o=&hp=1",
        },
        {
          id: "117",
          widthRatio: 2,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223497742.jpg?k=7d87188e85821b7b9e1871f898ffe1b8817b1620f3dac4207be18d8946e40d56&o=&hp=1",
        },
        {
          id: "118",
          widthRatio: 1,
          heightRatio: 2,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223495166.jpg?k=fc2ba7c31b133d48a0b8c1fce679ef3957de259f4ca0d23534b8e32f983fe9c4&o=&hp=1",
        },
        {
          id: "119",
          widthRatio: 1,
          heightRatio: 2,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223494890.jpg?k=4cd3feffb3dd3343be0bd6644a69d070c27824860af763ef7e0490b454799e1b&o=&hp=1",
        },
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ]
    },
    {
      id_maison: 2,
      name: "Chambre cozy à Godomey",
       last_scraped: "2025-09-08",
      id_proprietaire: 1,
      id_locataire: 1,
      id_dep: 1,
      id_commune: 1,
      id_arrond: 1,
      id_ville: 1,
      id_cat: 1,
      type_property: "Semi sanitaire",
      listing_url: "https://www.airbnb.com/rooms/1563562",
      nmbre_menage: 4,
      localisation: "300 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/223496641.jpg?k=070266558a879c2926e5511569c4828a007a3e1057b63ccfa30120c859341d1d&o=&hp=1",
      adresse: "456 Rue des Cocotiers",
      latitude: 6.4,
      longitude: 2.35,
      bathrooms: 1,
      bedrooms: 1,
      beds: 1,
      bed_type: "Simple",
      area: 25,
      prix_mois: 50000,
      statut: "loué",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-10-20",
      review_scores_rating: 4.5,
      review_scores_accuracy: 4.6,
      review_scores_cleanliness: 4.5,
      review_scores_checkin: 4.7,
      review_scores_communication: 4.6,
      review_scores_location: 4.5,
      review_scores_value: 4.7,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.35,
        lat: 6.4
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },

      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "100",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845616.jpg?k=87bc315f35830189d9a1c935c3e167e648543c27f39ee4cafc5cf73ee24393b9&o=&hp=1",
        },
        {
          id: "101",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845633.jpg?k=19a43441c40e9c9ff3b57d6a1a7c379c4def04730e34f76fd4a298eaefcd23d1&o=&hp=1",
        },
        {
          id: "102",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845621.jpg?k=52411b8fb2fe37edf07da6d3dfb145cc85288ac210f28ff19608ba101f1bba0e&o=&hp=1",
        },
        {
          id: "103",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845650.jpg?k=36bbad9d47f2db957eddbf922e711fbfc9ab2bf901ceaa1bd5d1ca4dc857f21c&o=&hp=1",
        },
        {
          id: "104",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845660.jpg?k=0db1ba8f8f2c1de0ded8b1dc30d4f181a52b898b0a9107c5a24f86688cc24c5e&o=&hp=1",
        },
        {
          id: "105",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845662.jpg?k=94bdc326cbec92e658a262a7d81387e65ede9d250489b1a3cc6d22d6b9c935ff&o=&hp=1",
        },
        {
          id: "106",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845665.jpg?k=637ae74710f45147445e49211d54d63a6200b6857f1bd03e38e41cceb0b931eb&o=&hp=1",
        },
        {
          id: "107",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845623.jpg?k=dc33256ff9ff9eda46683c776c1cf9af04910364ec8d1d9523b8cf80d18cca65&o=&hp=1",
        },
        {
          id: "108",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845673.jpg?k=24dd44dc2ac1bfda8aabdbff24571d211f42a4b5cf175fc9043113b61f57f670&o=&hp=1",
        },
        {
          id: "109",
          widthRatio: 1,
          heightRatio: 1,
          image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/433845665.jpg?k=637ae74710f45147445e49211d54d63a6200b6857f1bd03e38e41cceb0b931eb&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 3,
      name: "Appartement moderne à Cadjehoun",
       last_scraped: "2017-05-08",
      id_proprietaire: 3,
      id_locataire: 3,
      id_dep: 1,
      id_cat: 2,
      id_commune: 1,
      id_arrond: 2,
      id_ville: 4,
      type_property: "Sanitaire",
      listing_url: "https://www.airbnb.com/rooms/1563562",
      nmbre_menage: 4,
      localisation: "100 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "456 Rue des Cocotiers",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695517.jpg?k=c2559cc321dd56a7beb32262c84d60bc1760430a4a49ac6f8713a2fa03cd0d36&o=&hp=1",
      latitude: 6.37,
      longitude: 2.41,
      bathrooms: 2,
      bedrooms: 2,
      beds: 2,
      bed_type: "King",
      area: 80,
      prix_mois: 180000,
      statut: "disponible",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-11-01",
      review_scores_rating: 4.7,
      review_scores_accuracy: 4.8,
      review_scores_cleanliness: 4.7,
      review_scores_checkin: 4.8,
      review_scores_communication: 4.9,
      review_scores_location: 4.7,
      review_scores_value: 4.6,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.41,
        lat: 6.37
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },

      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "120",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695517.jpg?k=c2559cc321dd56a7beb32262c84d60bc1760430a4a49ac6f8713a2fa03cd0d36&o=&hp=1",
        },
        {
          id: "121",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695562.jpg?k=ca777d889f58838b1158a9e264b18d8f4ceff509a9fb89d345ef84151fd461b0&o=&hp=1",
        },
        {
          id: "122",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695518.jpg?k=240da3b294b015aa9268ba4bb8f09c9120bfabd6668ba55678fa5afda1582930&o=&hp=1",
        },
        {
          id: "123",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695521.jpg?k=99fffb6766013b84bc4780be3de5d7a73837062b99501f2cb3b039ebfb957d04&o=&hp=1",
        },
        {
          id: "124",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695792.jpg?k=c434efe348180f5a1a292b31432f46277bf5e43c7b85bce486665e3f424d0549&o=&hp=1",
        },
        {
          id: "125",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695791.jpg?k=ad248a728c71fffa384e1961e72b5a77462ab58da88c6f3074d5ff20ded68e51&o=&hp=1",
        },
        {
          id: "126",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430695896.jpg?k=84734c40aaf7e6960b01e3eb931c24318119d61494ce05cf50831a88b10026cf&o=&hp=1",
        },
        {
          id: "128",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430696362.jpg?k=41296a49d0c2f96dc4a72eddb9e42fc4b648408dcf5b1ceed2e73add6c5daf5d&o=&hp=1",
        },
        {
          id: "129",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430696348.jpg?k=0a2f5bd39e71a59ae2554974021c8ef8540795758961baf3b48ee9a1b1548bd7&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 4,
      name: "Studio meublé à Fidjrossè",
       last_scraped: "2017-05-08",
      id_proprietaire: 4,
      id_locataire: 4,
      id_dep: 1,
      id_cat: 2,
      id_commune: 1,
      id_arrond: 1,
      id_ville: 3,
      type_property: "Ordinaire",
      nmbre_menage: 4,
      localisation: "400 m du goudron",
      listing_url: "https://www.airbnb.com/rooms/1563562",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "789 Avenue de la Plage",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814168.jpg?k=270c0b95619412803742ebdcea2c03203f1f26a06ea797ad715a0a0b24fe85fa&o=&hp=1",
      latitude: 6.35,
      longitude: 2.42,
      bathrooms: 1,
      bedrooms: 1,
      beds: 1,
      bed_type: "Double",
      area: 35,
      prix_mois: 75000,
      statut: "disponible",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-11-05",
      review_scores_rating: 4.3,
      review_scores_accuracy: 4.4,
      review_scores_cleanliness: 4.3,
      review_scores_checkin: 4.5,
      review_scores_communication: 4.4,
      review_scores_location: 4.6,
      review_scores_value: 4.5,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.42,
        lat: 6.35
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },
        {
          id_amenities: 9,
          name: "Wifi",
          icon: icons.wifi,
        },
        {
          id_amenities: 10,
          name: "Pet Center",
          icon: icons.dog,
        },
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "140",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814194.jpg?k=38b97dc9e93b02ce00d14d9625dea692677aec64feea9e9ea76b154f703362a0&o=&hp=1",
        },
        {
          id: "141",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814179.jpg?k=12c76ec416673fc09ae8085250cebd14928b35671e9d72f782da4256c394f610&o=&hp=1",
        },
        {
          id: "142",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814188.jpg?k=530786e8585f567d1dee1e0e7cfdc551063c3c154d3f161d11674ee16f78b4c7&o=&hp=1",
        },
        {
          id: "143",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814184.jpg?k=192eee45d30ae6425619495061c922330745cc1cf57bf65d6da6f9fa481b6f22&o=&hp=1",
        },
        {
          id: "144",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814185.jpg?k=2217db46e371a47298bc3feee62357acda5bf2802f2042ebfa5b35b9cabc85ed&o=&hp=1",
        },
        {
          id: "145",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814187.jpg?k=e752022ae6b6701448156f8b5101b1d7dbf5176f405ce60573ad633a57028efc&o=&hp=1",
        },
        {
          id: "146",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814182.jpg?k=f6129a926e1d863bc29d0dbf0eb6650ddfff6a5ca12b2b967cd7661babe8ca97&o=&hp=1",
        },
        {
          id: "147",
          widthRatio: 1,
          heightRatio: 1,

          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814170.jpg?k=7c51fee51c3b222aff367a41ab640e9cb794ae339e407dfb38bb45f7320dc91e&o=&hp=1",
        },
        {
          id: "148",
          widthRatio: 2,
          heightRatio: 1,
          image : "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814168.jpg?k=270c0b95619412803742ebdcea2c03203f1f26a06ea797ad715a0a0b24fe85fa&o=&hp=1",
        },
        {
          id: "149",
          widthRatio: 1,
          heightRatio: 2,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/424814197.jpg?k=ca3eec900001077869d3591221f306025775cca085d91a0bcae3b722484c8b6e&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 5,
      name: "Bureau à Saint Jean",
       last_scraped: "2017-05-08",
      id_proprietaire: 5,
      id_locataire: 5,
      id_dep: 1,
      id_cat: 3,
      id_commune: 1,
      id_arrond: 3,
      id_ville: 5,
      type_property: "Sanitaire",
      nmbre_menage: 4,
      listing_url: "https://www.airbnb.com/rooms/1563562",
      localisation: "100 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "101 Boulevard du Commerce",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/430696348.jpg?k=0a2f5bd39e71a59ae2554974021c8ef8540795758961baf3b48ee9a1b1548bd7&o=&hp=1",
      latitude: 6.368,
      longitude: 2.417,
      bathrooms: 1,
      bedrooms: 0,
      beds: 0,
      bed_type: "Double",
      area: 50,
      prix_mois: 120000,
      statut: "disponible",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-11-10",
      review_scores_rating: 4.5,
      review_scores_accuracy: 4.6,
      review_scores_cleanliness: 4.5,
      review_scores_checkin: 4.6,
      review_scores_communication: 4.7,
      review_scores_location: 4.6,
      review_scores_value: 4.5,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.417,
        lat: 6.368
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },
        {
          id_amenities: 9,
          name: "Wifi",
          icon: icons.wifi,
        },
        {
          id_amenities: 10,
          name: "Pet Center",
          icon: icons.dog,
        },
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 6,
      name: "Maison traditionnelle à Ouidah",
       last_scraped: "2017-05-08",
      id_proprietaire: 6,
      id_locataire: 6,
      id_dep: 2,
      id_cat: 3,
      id_commune: 5,
      id_arrond: 11,
      id_ville: 11,
      type_property: "Sanitaire",
      nmbre_menage: 4,
      localisation: "100 m du goudron",
      listing_url: "https://www.airbnb.com/rooms/1563562",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "202 Route des Esclaves",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
      latitude: 6.368,
      longitude: 2.085,
      bathrooms: 1,
      bedrooms: 2,
      beds: 2,
      bed_type: "Double",
      area: 90,
      prix_mois: 95000,
      statut: "loué",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-10-15",
      review_scores_rating: 4.6,
      review_scores_accuracy: 4.7,
      review_scores_cleanliness: 4.6,
      review_scores_checkin: 4.7,
      review_scores_communication: 4.8,
      review_scores_location: 4.8,
      review_scores_value: 4.7,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.085,
        lat: 6.368
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },

      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 7,
      name: "Chambre partagée à Calavi",
       last_scraped: "2017-05-08",
      id_proprietaire: 7,
      id_locataire: 7,
      id_dep: 1,
      id_cat: 4,
      id_commune: 2,
      id_arrond: 6,
      id_ville: 6,
      type_property: "Ordinaire",
      nmbre_menage: 8,
      listing_url: "https://www.airbnb.com/rooms/1563562",
      localisation: "100 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "303 Rue de l'Université",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
      latitude: 6.448,
      longitude: 2.356,
      bathrooms: 1,
      bedrooms: 1,
      beds: 2,
      bed_type: "Simple",
      area: 25,
      prix_mois: 40000,
      statut: "disponible",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-11-12",
      review_scores_rating: 4.0,
      review_scores_accuracy: 4.1,
      review_scores_cleanliness: 4.0,
      review_scores_checkin: 4.2,
      review_scores_communication: 4.1,
      review_scores_location: 4.3,
      review_scores_value: 4.4,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.356,
        lat: 6.448
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },
        {
          id_amenities: 9,
          name: "Wifi",
          icon: icons.wifi,
        },
        {
          id_amenities: 10,
          name: "Pet Center",
          icon: icons.dog,
        },
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 8,
      name: "Terrain constructible à Allada",
       last_scraped: "2017-05-08",
      id_proprietaire: 8,
      id_locataire: 1,
      id_dep: 2,
      id_cat: 1,
      id_commune: 6,
      id_arrond: 12,
      id_ville: 12,
      type_property: "Ordinaire",
      nmbre_menage: 3,
      listing_url: "https://www.airbnb.com/rooms/1563562",
      localisation: "100 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "404 Route Nationale",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
      latitude: 6.668,
      longitude: 2.252,
      bathrooms: 0,
      bedrooms: 0,
      beds: 0,
      bed_type: 'Double',
      area: 500,
      prix_mois: 50000,
      statut: "disponible",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-11-15",
      review_scores_rating: 10,
      review_scores_accuracy: 10,
      review_scores_cleanliness: 10,
      review_scores_checkin: 10,
      review_scores_communication: 10,
      review_scores_location: 10,
      review_scores_value: 10,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.252,
        lat: 6.668
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },

      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 9,
      name: "Boutique commerciale à Porto-Novo",
       last_scraped: "2017-05-08",
      id_proprietaire: 9,
      id_locataire: 8,
      id_dep: 3,
      id_cat: 2,
      id_commune: 3,
      id_arrond: 8,
      id_ville: 8,
      type_property: "Sanitaire",
      listing_url: "https://www.airbnb.com/rooms/1563562",
      nmbre_menage: 4,
      localisation: "100 m du marché, 400 de l'école",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "505 Rue du Marché",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
      latitude: 6.497,
      longitude: 2.63,
      bathrooms: 0,
      bedrooms: 0,
      beds: 0,
      bed_type: 'Double',
      area: 60,
      prix_mois: 85000,
      statut: "loué",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-10-30",
      review_scores_rating: 4.4,
      review_scores_accuracy: 4.5,
      review_scores_cleanliness: 4.4,
      review_scores_checkin: 4.5,
      review_scores_communication: 4.6,
      review_scores_location: 4.7,
      review_scores_value: 4.5,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.63,
        lat: 6.497
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },
        {
          id_amenities: 9,
          name: "Wifi",
          icon: icons.wifi,
        },
        {
          id_amenities: 10,
          name: "Pet Center",
          icon: icons.dog,
        },
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 10,
      name: "Entrepôt à Sèmè-Podji",
       last_scraped: "2017-05-08",
      id_proprietaire: 10,
      id_locataire: 9,
      id_dep: 1,
      id_commune: 4,
      id_arrond: 10,
      id_ville: 10,
      id_cat: 3,
      listing_url: "https://www.airbnb.com/rooms/1563562",
      type_property: "Sanitaire",
      nmbre_menage: 3,
      localisation: "100 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "606 Zone Industrielle",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
      latitude: 6.368,
      longitude: 2.468,
      bathrooms: 1,
      bedrooms: 0,
      beds: 0,
      bed_type: 'Double',
      area: 300,
      prix_mois: 150000,
      statut: "loué",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-10-10",
      review_scores_rating: 4.2,
      review_scores_accuracy: 4.3,
      review_scores_cleanliness: 4.2,
      review_scores_checkin: 4.3,
      review_scores_communication: 4.4,
      review_scores_location: 4.3,
      review_scores_value: 4.4,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.468,
        lat: 6.368
      },
      Amenities: [
        { id_amenities: 19, name: "Quai de chargement" },
        { id_amenities: 20, name: "Système d'alarme" }
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 11,
      name: "Auberge à Abomey",
       last_scraped: "2017-05-08",
      id_proprietaire: 11,
      id_locataire: 1,
      id_dep: 5,
      id_cat: 4,
      id_commune: 11,
      id_arrond: 1,
      id_ville: 2,
      type_property: "Semi sanitaire",
      nmbre_menage: 3,
      localisation: "200 m du goudron",
      listing_url: "https://www.airbnb.com/rooms/1563562",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "707 Route Royale",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
      latitude: 7.1833,
      longitude: 1.9833,
      bathrooms: 6,
      bedrooms: 10,
      beds: 15,
      bed_type: "Mixte",
      area: 400,
      prix_mois: 300000,
      statut: "disponible",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-11-18",
      review_scores_rating: 4.1,
      review_scores_accuracy: 4.2,
      review_scores_cleanliness: 4.1,
      review_scores_checkin: 4.3,
      review_scores_communication: 4.2,
      review_scores_location: 4.4,
      review_scores_value: 4.3,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 1.9833,
        lat: 7.1833
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },
        {
          id_amenities: 9,
          name: "Wifi",
          icon: icons.wifi,
        },
        {
          id_amenities: 10,
          name: "Pet Center",
          icon: icons.dog,
        },
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    },
    {
      id_maison: 12,
      name: "Villa haut standing à Togba",
       last_scraped: "2017-05-08",
      id_proprietaire: 12,
      id_locataire: 10,
      id_dep: 1,
      id_cat: 1,
      id_commune: 2,
      id_arrond: 7,
      id_ville: 7,
      type_property: "Sanitaire",
      nmbre_menage: 4,
      listing_url: "https://www.airbnb.com/rooms/1563562",
      localisation: "400 m du goudron",
      condition_pay: [{ id_cp: 1, name: "3 mois d'avonce" }, { id_cp: 2, name: "3 mois de prépayés" }, { id_cp: 3, name: "commission agence 1 mois" }],
      adresse: "808 Résidence des Palmiers",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
      latitude: 6.449,
      longitude: 2.357,
      bathrooms: 3,
      bedrooms: 4,
      beds: 4,
      bed_type: "King",
      area: 250,
      prix_mois: 450000,
      statut: "loué",
      description: "Central and quiet 15m2 room (Not Apartment!) with en suite bathroom and sunroof terrace with sun all day. 160x200 cm queen size bed, tables, chairs,  32\" HD TV & BluRay player.  Self service breakfeast included. The 15 m2 room is light and quiet and the sun shines all day long on the private sunroof terrace. The room is facing the backyard so no street noise. Tables, chairs, en suite bathroom with shower. Selfservice breakfast (coffee, tea, bread, toast, juice, mysli, yoghurt ,cheese, cold cuts).  32\"HD-TV, DVD/BluRay player, a selection of international movies on DVD and BluRay, Radio and WLAN internet included.    5th floor WITHOUT elevator!  The owner of the apartment is a famous Danish musician and You\u00b4ll find a lot of posters, awards and golden/platinum records all around. Access to kitchen and dining room, washing machine and dryer, hairdryer, iron and ironing board and extra towels. Bedlinen and towels are provided. We will be happy to help You with information about tourist att",
      date_publication: "2023-09-20",
      review_scores_rating: 4.9,
      review_scores_accuracy: 5.0,
      review_scores_cleanliness: 4.9,
      review_scores_checkin: 5.0,
      review_scores_communication: 5.0,
      review_scores_location: 4.8,
      review_scores_value: 4.7,
      license: null,
      jurisdiction_names: null,
      geolocation: {
        lon: 2.357,
        lat: 6.449
      },
      Amenities: [
        { id_amenities: 1, icon: icons.swim, name: "Piscine" },
        { id_amenities: 2, name: "Climatisation", icon: icons.laundry },
        {
          id_amenities: 3,
          name: "Laundry",
          icon: icons.laundry,
        },
        {
          id_amenities: 4,
          name: "Car Parking",
          icon: icons.carPark,
        },
        {
          id_amenities: 5,
          name: "Sports Center",
          icon: icons.run,
        },
        {
          id_amenities: 6,
          name: "Cutlery",
          icon: icons.cutlery,
        },
        {
          id_amenities: 7,
          name: "Gym",
          icon: icons.dumbell,
        },
        {
          id_amenities: 8,
          name: "Swimming pool",
          icon: icons.swim,
        },
        {
          id_amenities: 9,
          name: "Wifi",
          icon: icons.wifi,
        },
        {
          id_amenities: 10,
          name: "Pet Center",
          icon: icons.dog,
        },
      ],
      Comments: [
        {
          id: 1,
          fullName: "Marie Dupont",
          years: 2,
          rating: 5,
          dateDerate: "Il y a 2 semaines",
          comment: "Nous avons passé un excellent séjour dans cet appartement. La décoration est soignée, l'emplacement est parfait pour visiter la ville à pied, et l'hôte a été très réactif à toutes nos questions. La cuisine est bien équipée pour préparer ses repas. Nous recommandons sans hésitation !",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
          id: 2,
          fullName: "Thomas Martin",
          years: 1,
          rating: 4,
          dateDerate: "Il y a 3 semaines",
          comment: "Appartement très agréable et bien situé. Propre et fonctionnel. Le lit est confortable et la salle de bain est moderne. Petit bémol : un peu de bruit venant de la rue le weekend, mais cela ne nous a pas empêchés de bien dormir. Globalement une très bonne expérience !",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        {
          id: 3,
          fullName: "Sophie Leroy",
          years: 3,
          rating: 5,
          dateDerate: "Il y a 1 mois",
          comment: "Cet appartement est une véritable pépite ! Très bien décoré, extrêmement propre et avec tout le nécessaire pour un séjour agréable. L'hôte est aux petits soins et a même préparé un guide des meilleurs restaurants du quartier. La station de métro est à 2 minutes à pied. Nous reviendrons certainement !",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        {
          id: 4,
          fullName: "Jean Petit",
          years: 1,
          rating: 3,
          dateDerate: "Il y a 3 semaines",
          comment: "Séjour correct dans l'ensemble. L'appartement est bien situé et propre. Cependant, nous avons rencontré quelques problèmes : la connexion wifi était instable et le canapé du salon n'est pas très confortable. L'hôte était réactif mais n'a pas pu résoudre le problème de wifi pendant notre séjour.",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg"
        },
        {
          id: 5,
          fullName: "Camille Rousseau",
          years: 4,
          rating: 5,
          dateDerate: "Il y a 2 mois",
          comment: "We had a wonderful time in this apartment! It's even better than in the photos. The location is perfect - close to everything but still quiet at night. The host was extremely helpful and provided great recommendations. The apartment was spotlessly clean and had everything we needed. We would definitely stay here again!",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ],
      photos: [
        {
          id: "160",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244256022.jpg?k=039b6ea2059809603206e35aa336d9ef97ca8b793327277580ce19001ba3a492&o=&hp=1",
        },
        {
          id: "161",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258918.jpg?k=0e9b069b0719ba5cdbfba03fa7420a8c6096dad9c699c2a1baca3d1f7c80d2f1&o=&hp=1",
        },
        {
          id: "162",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257685.jpg?k=70dc1dfb4f8f5abde720afc61fcc757d76567f4a293c486206de5fc81119686c&o=&hp=1",
        },
        {
          id: "163",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258924.jpg?k=1f98c00674333999f29ce3b095eece29069f8304bf7697467a405b417132ee5f&o=&hp=1",
        },
        {
          id: "164",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258928.jpg?k=8e03b53ddf32342bdac53e3aa1cb92aae88496e8afa8fbb1f62fa6e8f023ec2c&o=&hp=1",
        },
        {
          id: "165",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258926.jpg?k=8935acba4ff9588ea20674cffd5f309f8862aa6950a1dddc99d79e9afe16cde5&o=&hp=1",
        },
        {
          id: "166",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258921.jpg?k=95be913693f4ec3cbae9e30f525a2b03a6e61d0aa2e2fdb1bf0a6f00362dcbad&o=&hp=1",
        },
        {
          id: "167",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257008.jpg?k=7e3939fc4b54b7752f476f6f819e12a0054659b0ce4a9d6414c0b2db310e175e&o=&hp=1",
        },
        {
          id: "168",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244257005.jpg?k=7eff1e1de6cec34762fa374c083ff27189acdd8410a1d36f110d099921b6df84&o=&hp=1",
        },
        {
          id: "169",
          widthRatio: 1,
          heightRatio: 1,
          image:
            "https://cf.bstatic.com/xdata/images/hotel/max1280x900/244258932.jpg?k=abdca02df16c21de889f9a0790ec6bece09a9fce92550079baa0e1eebf9b8f80&o=&hp=1",
        },
      ],
    }

  ]
};

export const guestsGropus = [
  {
    name: 'Adultes',
    text: 'Agé entre 13 ans et +',
    count: 0,
  },
  {
    name: 'Enfants',
    text: 'Ages 2 ans-12 ans',
    count: 0,
  },
  {
    name: 'Nouveaux nés',
    text: 'En dessous de 2 ans',
    count: 0,
  },
  {
    name: 'Animaux de compagnies',
    text: 'Ils sont aussi autorisés',
    count: 0,
  },
];