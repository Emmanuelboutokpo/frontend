// // lib/toastConfig.ts
// import clsx from 'clsx';
// import React from 'react';
// import { Image, Text, View } from 'react-native';
 

// export const toastConfig = {
//   success: (props: any) => (
//     <View className={clsx('flex-row items-center bg-white rounded-lg p-3 shadow-lg mx-4 border-l-4 border-l-green-500')}>
//       {props.props?.image && (
//         <Image 
//           source={{ uri: props.props.image }} 
//           style={{width:50, height:50, borderRadius : 5, marginRight : 10}}
//         />
//       )}
//       <View className={clsx('flex-1')}>
//         <Text className={clsx('text-lg font-rubik-bold text-green-800')}>
//           {props.text1}
//         </Text>
//         <Text className={clsx('text-sm font-rubik text-gray-600')}>
//           {props.text2}
//         </Text>
//         {props.props?.department && (
//           <Text className={clsx('text-xs font-rubik text-gray-500 mt-1')}>
//             Groupe: {props.props.department}
//           </Text>
//         )}
//       </View>
//     </View>
//   ),
  
//   error: (props: any) => (
//     <View className={clsx('flex-row items-center bg-white rounded-lg p-3 shadow-lg mx-4 border-l-4 border-l-red-500')}>
//       {props.props?.image && (
//         <Image 
//           source={{ uri: props.props.image }} 
//           style={{width:50, height:50, borderRadius : 5, marginRight : 10}}
//         />
//       )}
//       <View className={clsx('flex-1')}>
//         <Text className={clsx('text-lg font-rubik-bold text-red-800')}>
//           {props.text1}
//         </Text>
//         <Text className={clsx('text-sm font-rubik text-gray-600')}>
//           {props.text2}
//         </Text>
//         {props.props?.department && (
//           <Text className={clsx('text-xs font-rubik text-gray-500 mt-1')}>
//             Groupe: {props.props.department}
//           </Text>
//         )}
//       </View>
//     </View>
//   ),
  
//   info: (props: any) => (
//     <View className={clsx('flex-row items-center bg-white rounded-lg p-3 shadow-lg mx-4 border-l-4 border-l-blue-500')}>
//       {props.props?.image && (
//         <Image 
//           source={{ uri: props.props.image }} 
//           style={{width:50, height:50, borderRadius : 5, marginRight : 10}}
//         />
//       )}
//       <View className={clsx('flex-1')}>
//         <Text className={clsx('text-lg font-rubik-bold text-blue-800')}>
//           {props.text1}
//         </Text>
//         <Text className={clsx('text-sm font-rubik text-gray-600')}>
//           {props.text2}
//         </Text>
//       </View>
//     </View>
//   )
// };