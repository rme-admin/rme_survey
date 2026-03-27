
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, ShieldCheck, Mail, MapPin } from 'lucide-react';
import siteContent from '@/lib/data/site-content.json';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card p-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-2 rounded-md">
            <BarChart3 className="text-white h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">{siteContent.siteName}</h1>
        </div>
        <Link href="/admin/login">
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin Login
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight text-primary">
              {siteContent.heroTitle.split('&')[0]}<br />
              <span className="text-accent">& {siteContent.heroTitle.split('&')[1]}</span>
            </h2>
            <p className="text-xl text-muted-foreground font-body max-w-xl mx-auto">
              {siteContent.heroDescription}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/survey">
              <Button size="lg" className="bg-accent hover:bg-orange-700 text-white px-12 py-8 text-xl font-bold uppercase tracking-widest h-auto rounded-xl">
                Start Survey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-12 bg-muted/30 border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-primary">{siteContent.siteName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteContent.footerDescription}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold uppercase tracking-wider text-primary">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <a href={`mailto:${siteContent.contactEmail}`} className="hover:text-accent transition-colors">{siteContent.contactEmail}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{siteContent.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-xs text-muted-foreground">
            <p className="font-bold text-primary">Powered by {siteContent.siteName}</p>
            <p>{siteContent.copyright}</p>
            <p className="mt-4 p-2 bg-secondary/50 rounded inline-block">Enterprise Encryption Enabled</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
