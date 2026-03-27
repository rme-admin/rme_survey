
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-2">
            <BarChart3 className="text-white h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter">INSIGHT<span className="text-accent">NAV</span></h1>
        </div>
        <Link href="/admin/login">
          <Button variant="ghost" className="text-muted-foreground hover:text-white">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin Login
          </Button>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
              Research Made <br />
              <span className="text-accent">Easy & Effective</span>
            </h2>
            <p className="text-xl text-muted-foreground font-body max-w-xl mx-auto">
              A high-performance comparison platform for objective research data collection. 
              Help us refine insights by choosing between competing statements.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/survey">
              <Button size="lg" className="bg-accent hover:bg-orange-700 text-white px-12 py-8 text-xl font-bold uppercase tracking-widest h-auto">
                Start Survey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-12 bg-card border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">INSIGHTNAV SURVEY</h3>
            <p className="text-sm text-muted-foreground">
              Built for researchers who demand precision. Our side-by-side comparison methodology 
              reduces bias and increases clarity in statement evaluation.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground">
            <p>© 2024 InsightNav Research Ecosystem</p>
            <p>Protected by Enterprise Encryption</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
