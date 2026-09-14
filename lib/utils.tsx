// import { Rooms } from '@/types/types';
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export function formatNumber(num: number) {
//   if (num >= 1e9) {
//     return (num / 1e9).toFixed(1) + 'B'; // Billions
//   } else if (num >= 1e6) {
//     return (num / 1e6).toFixed(1) + 'M'; // Millions
//   } else if (num >= 1e3) {
//     return (num / 1e3).toFixed(1) + 'K'; // Thousands
//   } else {
//     return num.toString(); // Less than 1000
//   }
// }

// export const isValidRoom = (room: Rooms): room is Rooms & { id_maison: number } => {
//   return room.id_maison !== undefined && room.id_maison !== null;
// };

// export const getImageStyle = (index: number) => {
//   switch (index) { 
//     case 0: 
//       return { borderTopLeftRadius: 12 };
//     case 1: 
//       return { borderTopRightRadius: 12 };
//     case 2: 
//       return { borderBottomLeftRadius: 12 };      
//     case 3: 
//       return { borderBottomRightRadius: 12 };
//     default:
//       return { borderRadius: 6 };
//   }
// };
