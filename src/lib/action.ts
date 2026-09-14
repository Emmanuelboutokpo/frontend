// "use server";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { auth } from "@clerk/nextjs/server"; 

// export async function checkIfSessionExists() {
//   // Retrieve session information
//   const { sessionId } = await auth();
//   console.log(sessionId);
  
//   // Check if session exists
//   if (!sessionId) {
    
//     redirect("/");
//   }
// }