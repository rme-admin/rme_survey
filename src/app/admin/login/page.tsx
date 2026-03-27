
'use client';

import { useState } from 'react';
import { authenticate } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await authenticate(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        router.push('/admin/dashboard');
        router.refresh(); // Ensure middleware picks up the new cookie
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-primary p-8 border-b border-border text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white">
            Admin <span className="text-accent">Portal</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">Secure Access Required</p>
        </div>
        
        <form action={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-[10px] uppercase font-bold rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Username / Email</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="username" 
                name="username" 
                placeholder="rme.platform@gmail.com" 
                className="pl-12 h-14 bg-background border-border rounded-xl focus:ring-accent"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className="pl-12 h-14 bg-background border-border rounded-xl focus:ring-accent"
                required
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            type="submit" 
            className="w-full h-14 bg-accent hover:bg-orange-700 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-orange-200"
          >
            {loading ? 'Verifying Identity...' : 'Secure Login'}
          </Button>
        </form>
      </div>
      
      <p className="mt-8 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
        Property of Research Made Easy. All access is logged.
      </p>
    </div>
  );
}
