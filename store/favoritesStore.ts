// import { Departement, Rooms } from '@/types/types';
// import   { Toast } from 'toastify-react-native'
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { usePropertyStore } from './propertyStore';

// export interface FavoriteNote {
//   id: number;
//   text: string;
//   createdAt: Date;
// }

// export interface FavoriteItem {
//   propertyId: number;
//   addedAt: Date;
//   note?: FavoriteNote;
//   rating?: number;
// }

// interface FavoritesState {
//   favorites: FavoriteItem[];
//   favoritesByDepartment: Record<number, FavoriteItem[]>;
  
//   toggleFavorite: (propertyId: number, departmentId?: number) => void;
//   addNoteToFavorite: (propertyId: number, noteText: string) => void;
//   updateFavoriteRating: (propertyId: number, rating: number) => void;
//   removeFavorite: (propertyId: number) => void;
//   clearAllFavorites: () => void;
//   getFavoritesByDepartment: (departmentId: number) => FavoriteItem[];
//   isFavorite: (propertyId: number) => boolean;
//   shareFavorite: (propertyId: number) => void;
//   renameFavorite: (propertyId: number, newName: string) => void;
// }
//   const { propertyData } = usePropertyStore();

// const getPropertyDetails = (propertyId: number) => {
//   return propertyData[0].Rooms.find((room : Rooms)  => room.id_maison === propertyId);
// };

// // Fonction utilitaire pour obtenir le nom du département
// const getDepartmentName = (departmentId: number) => {
//   const department = propertyData[0].Departement.find((dept : Departement) => dept.id_dep === departmentId);
//   return department ? department.nom_dep : `Département ${departmentId}`;
// };

// export const useFavoritesStore = create<FavoritesState>()(
//   persist(
//     (set, get) => ({
//       favorites: [],
//       favoritesByDepartment: {},
      
//       toggleFavorite: (propertyId, departmentId) => {
//         set((state) => {
//           const isAlreadyFavorite = state.favorites.some(fav => fav.propertyId === propertyId);
//           const property = getPropertyDetails(propertyId);
//           const departmentName = departmentId ? getDepartmentName(departmentId) : null;
          
//           if (isAlreadyFavorite) {
//             // Supprimer des favoris
//             const newFavorites = state.favorites.filter(fav => fav.propertyId !== propertyId);
//             const newFavoritesByDepartment = { ...state.favoritesByDepartment };
            
//             // Supprimer de tous les départements
//             Object.keys(newFavoritesByDepartment).forEach(deptId => {
//               newFavoritesByDepartment[Number(deptId)] = 
//                 newFavoritesByDepartment[Number(deptId)]?.filter(fav => fav.propertyId !== propertyId) || [];
//             });
            
//             // Afficher le toast de suppression
//             Toast.show({
//               type: 'error',
//               text1: 'Retiré des favoris',
//               text2: departmentName 
//                 ? `${property?.name || 'Propriété'} a été retiré de ${departmentName}`
//                 : `${property?.name || 'Propriété'} a été retiré des favoris`,
//               visibilityTime: 3000,
//               autoHide: true,
//               props: {
//                 image: property?.image, // Image de la propriété
//                 department: departmentName // Nom du département
//               }
//             });
            
//             return { 
//               favorites: newFavorites,
//               favoritesByDepartment: newFavoritesByDepartment
//             };
//           } else {
//             // Ajouter aux favoris
//             const newFavorite: FavoriteItem = {
//               propertyId,
//               addedAt: new Date(),
//             };
            
//             const newFavorites = [newFavorite, ...state.favorites];
//             const newFavoritesByDepartment = { ...state.favoritesByDepartment };
            
//             // Ajouter au département spécifié
//             if (departmentId) {
//               if (!newFavoritesByDepartment[departmentId]) {
//                 newFavoritesByDepartment[departmentId] = [];
//               }
//               newFavoritesByDepartment[departmentId] = [newFavorite, ...newFavoritesByDepartment[departmentId]];
//             }
            
//             // Afficher le toast d'ajout
//             Toast.show({
//               type: 'success',
//               text1: 'Ajouté aux favoris',
//               text2: departmentId 
//                 ? `${property?.name || 'Propriété'} a été ajouté à ${departmentName}`
//                 : `${property?.name || 'Propriété'} a été ajouté aux favoris`,
//                 visibilityTime: 3000,
//                 autoHide: true,
//               props: {
//                 image: property?.image,  
//                 department: departmentName  
//               }
//             });
            
//             return { 
//               favorites: newFavorites,
//               favoritesByDepartment: newFavoritesByDepartment
//             };
//           }
//         });
//       },
      
//       addNoteToFavorite: (propertyId, noteText) => {
//         set((state) => ({
//           favorites: state.favorites.map(fav =>
//             fav.propertyId === propertyId
//               ? {
//                   ...fav,
//                   note: {
//                     id: Date.now(),
//                     text: noteText,
//                     createdAt: new Date()
//                   }
//                 }
//               : fav
//           )
//         }));
        
//         // Toast pour l'ajout de note
//         const property = getPropertyDetails(propertyId);
//         Toast.show({
//           type: 'info',
//           text1: 'Note ajoutée',
//           text2: `Une note a été ajoutée à ${property?.name || 'la propriété'}`,
//           visibilityTime: 2000,
//           autoHide: true,
//         });
//       },
      
//       updateFavoriteRating: (propertyId, rating) => {
//         set((state) => ({
//           favorites: state.favorites.map(fav =>
//             fav.propertyId === propertyId
//               ? { ...fav, rating }
//               : fav
//           )
//         }));
        
//         // Toast pour la mise à jour du rating
//         const property = getPropertyDetails(propertyId);
//         Toast.show({
//           type: 'info',
//           text1: 'Évaluation mise à jour',
//           text2: `${property?.name || 'La propriété'} a été notée ${rating}/5`,
//           visibilityTime: 2000,
//           autoHide: true,
//         });
//       },
      
//       removeFavorite: (propertyId) => {
//         set((state) => {
//           const property = getPropertyDetails(propertyId);
//           const newFavorites = state.favorites.filter(fav => fav.propertyId !== propertyId);
//           const newFavoritesByDepartment = { ...state.favoritesByDepartment };
          
//           Object.keys(newFavoritesByDepartment).forEach(deptId => {
//             newFavoritesByDepartment[Number(deptId)] = 
//               newFavoritesByDepartment[Number(deptId)]?.filter(fav => fav.propertyId !== propertyId) || [];
//           });
          
//           // Toast pour la suppression
//           Toast.show({
//             type: 'error',
//             text1: 'Retiré des favoris',
//             text2: `${property?.name || 'Propriété'} a été retiré des favoris`,
//             visibilityTime: 3000,
//             autoHide: true,
//             props: {
//               image: property?.image,
//             }
//           });
          
//           return { 
//             favorites: newFavorites,
//             favoritesByDepartment: newFavoritesByDepartment
//           };
//         });
//       },
      
//       clearAllFavorites: () => {
//         set({ favorites: [], favoritesByDepartment: {} });
        
//         // Toast pour la suppression de tous les favoris
//         Toast.show({
//           type: 'error',
//           text1: 'Favoris vidés',
//           text2: 'Tous vos favoris ont été supprimés',
//           visibilityTime: 3000,
//           autoHide: true,
//         });
//       },
      
//       getFavoritesByDepartment: (departmentId) => {
//         return get().favoritesByDepartment[departmentId] || [];
//       },
      
//       isFavorite: (propertyId) => {
//         return get().favorites.some(fav => fav.propertyId === propertyId);
//       },
      
//       shareFavorite: (propertyId) => {
//         // Implémentation du partage
//         const favorite = get().favorites.find(fav => fav.propertyId === propertyId);
//         const property = getPropertyDetails(propertyId);
        
//         if (favorite) {
//           console.log('Sharing favorite:', propertyId);
          
//           // Toast pour le partage
//           Toast.show({
//             type: 'info',
//             text1: 'Partage',
//             text2: `${property?.name || 'La propriété'} a été partagée`,
//             visibilityTime: 2000,
//             autoHide: true,
//           });
//         }
//       },
      
//       renameFavorite: (propertyId, newName) => {
//         // Pour renommer, vous pourriez stocker un nom personnalisé
//         console.log('Renaming favorite:', propertyId, 'to:', newName);
        
//         // Toast pour le renommage
//         const property = getPropertyDetails(propertyId);
//         Toast.show({
//           type: 'info',
//           text1: 'Favori renommé',
//           text2: `${property?.name || 'La propriété'} a été renommée en "${newName}"`,
//           visibilityTime: 2000,
//           autoHide: true,
//         });
//       }
//     }),
//     {
//       name: 'favorites-storage'
//     }
//   )
// );