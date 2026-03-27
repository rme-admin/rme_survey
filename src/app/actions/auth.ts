
'use server';

import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function authenticate(formData: FormData) {
  const usernameInput = (formData.get('username') as string)?.trim();
  const passwordInput = (formData.get('password') as string)?.trim();

  // Retrieve credentials from environment variables and trim them
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME?.trim();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();

  if (usernameInput && passwordInput && usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
    const token = await signJWT({ user: usernameInput });
    const cookieStore = await cookies();
    
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
    });
    
    return { success: true };
  }

  return { error: 'Invalid credentials. Please check your username and password.' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', '', { maxAge: 0, path: '/' });
}
