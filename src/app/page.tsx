
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Mail, MapPin } from 'lucide-react';
import siteContent from '@/lib/data/site-content.json';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card p-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-2 rounded-md">
            <BarChart3 className="text-white h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase text-primary">{siteContent.siteName}</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight text-primary">
              {siteContent.heroTitle.split('&')[0]}<br />
              <span className="text-accent">& {siteContent.heroTitle.split('&')[1]}</span>
            </h2>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              {siteContent.heroDescription}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/survey">
              <Button size="lg" className="bg-accent hover:bg-orange-700 text-white px-12 py-8 text-xl font-bold uppercase tracking-widest h-auto rounded-none">
                Start Survey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-12 bg-muted/30 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-primary">About {siteContent.siteName}</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              <p>{siteContent.footerDescription}</p>
              <p className="font-medium text-primary italic">{siteContent.visionStatement}</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-primary">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <a href={`mailto:${siteContent.contactEmail}`} className="hover:text-accent transition-colors font-medium">
                  {siteContent.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="font-medium">{siteContent.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
          <p>{siteContent.copyright}</p>
          <p>Powered by {siteContent.siteName} Research Division</p>
        </div>
      </footer>
    </div>
  );
}
