'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitProfile } from '@/app/actions/survey';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface SurveyProfileFormProps {
  onProfileSubmit: (profile: any, createdProfileId: number) => void;
}

export default function SurveyProfileForm({ onProfileSubmit }: SurveyProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      institute: formData.get('institute') as string,
      profession: formData.get('profession') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      name: formData.get('name') as string,
    };

    try {
      const result = await submitProfile(data);
      if (result && result.success && result.profileId) {
        onProfileSubmit(data, result.profileId);
      } else {
        // handle error
      }
    } catch (error: any) {
      console.error('Failed to submit profile', error);
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl border-border shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-primary text-white p-8">
        <CardTitle className="text-2xl font-bold uppercase tracking-tight">Professional Profile</CardTitle>
        <CardDescription className="text-primary-foreground/80 font-medium">
          Help us categorize your responses to better understand the research landscape.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Full Name (Optional)</Label>
              <Input id="name" name="name" placeholder="Enter your name" className="bg-background border-border h-12" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Profession</Label>
              <Select name="profession" required>
                <SelectTrigger className="h-12 bg-background border-border">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Research Scholar">Research Scholar</SelectItem>
                  <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Scientist">Scientist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institute" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Institution / University</Label>
            <Input id="institute" name="institute" placeholder="e.g. Indian Institute of Science" required className="bg-background border-border h-12" />
            {errors.institute && <p className="text-destructive text-[10px] font-bold uppercase">{errors.institute}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Email Address (Optional)</Label>
              <Input id="email" name="email" type="email" placeholder="email@example.com" className="bg-background border-border h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Phone Number (Optional)</Label>
              <Input id="phone" name="phone" placeholder="+91 00000-00000" className="bg-background border-border h-12" />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-14 bg-accent hover:bg-orange-700 text-white text-lg font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              {isSubmitting ? 'Loading Survey...' : 'Continue to Survey'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
