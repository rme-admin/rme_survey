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
    const result = await authenticate(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-primary p-8 border-b border-border">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white">
            Admin <span className="text-accent">Portal</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Authorized personnel only. Secure access required.</p>
        </div>
        
        <form action={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-sm uppercase font-bold rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="username" 
                name="username" 
                placeholder="Enter admin username" 
                className="pl-10 h-12 bg-background border-border rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Enter admin password" 
                className="pl-10 h-12 bg-background border-border rounded-xl"
                required
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            type="submit" 
            className="w-full h-12 bg-accent hover:bg-orange-700 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-orange-200"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </Button>
        </form>
      </div>
      
      <p className="mt-8 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
        Property of Research Made Easy. All access is logged.
      </p>
    </div>
  );
}
