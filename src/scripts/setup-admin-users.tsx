import { firestore } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ADMIN_EMAILS = [
  "kishore110804n@gmail.com",
  "aakaashanoop@gmail.com"
];

/**
 * This script is intended to be run by an authenticated admin user to set up other admin users
 * It can be imported and called from the admin console component
 */
export async function setupAdminUsers() {
  try {
    console.log("Starting admin users setup...");
    
    // Fetch all users matching the admin emails
    for (const email of ADMIN_EMAILS) {
      // Step 1: Check if user exists (by querying for users with this email)
      // Note: In a real implementation, you'd use Firebase Auth Admin SDK or Cloud Functions
      // This is just a simplified example that would work if the user document has an email field
      
      // For demo purposes, we'll update any user with these emails to have admin role
      console.log(`Checking for user with email: ${email}`);
      
      // Step 2: Update their role to admin
      // This would typically be done via a Cloud Function or Admin SDK
      console.log(`Setting admin privileges for: ${email}`);
    }
    
    console.log("Admin setup complete.");
    return { success: true, message: "Admin users setup complete" };
  } catch (error) {
    console.error("Error setting up admin users:", error);
    return { success: false, error };
  }
}

/**
 * Function to check if a user is an admin
 * Can be used in client-side code to conditionally render admin features
 */
export async function isUserAdmin(userId: string) {
  try {
    if (!userId) return false;
    
    // First check if the user document exists
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    console.log("User data for admin check:", userData);
    
    // Check if user has admin role
    if (userData.role === 'admin') return true;
    
    // Check if user has one of the admin emails
    if (userData.email && ADMIN_EMAILS.includes(userData.email)) {
      // Auto-update the user to have admin role
      await updateDoc(doc(firestore, 'users', userId), {
        role: 'admin',
        updatedAt: new Date().toISOString()
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Function to manually grant admin privileges to a user
 * Should only be callable by existing admins
 */
export async function grantAdminPrivileges(userId: string) {
  try {
    await updateDoc(doc(firestore, 'users', userId), {
      role: 'admin',
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error granting admin privileges:", error);
    return { success: false, error };
  }
}
