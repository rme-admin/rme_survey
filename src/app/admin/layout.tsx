import Link from "next/link";
import { LogOut, BarChart3 } from "lucide-react";
import siteContent from '@/lib/data/site-content.json';
import Image from 'next/image';
import { logout } from '@/app/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Only highlight dashboard by default (no client-side path detection for SSR safety)
  // If you want client-side highlighting, move this to a client component and use usePathname
  const isDashboard = true;
  const isResponses = false;
  const isProfiles = false;

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <Image 
            src={siteContent.logoUrl} 
            alt={siteContent.siteName} 
            width={24} 
            height={24} 
            className="rounded-sm"
          />
          <h2 className="font-black text-xl tracking-tighter text-primary">{siteContent.shortName}<span className="text-accent">DASH</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className={`flex items-center gap-3 p-3 rounded-lg font-bold uppercase text-xs tracking-widest ${isDashboard ? 'bg-primary text-white' : 'bg-card text-primary'}`}> <BarChart3 className="h-4 w-4" /> Results Overview </Link>
          <Link href="/admin/responses" className={`flex items-center gap-3 p-3 rounded-lg font-bold uppercase text-xs tracking-widest ${isResponses ? 'bg-primary text-white' : 'bg-card text-primary'}`}> <BarChart3 className="h-4 w-4 text-accent" /> Responses </Link>
          <div className="px-3 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mt-8">System</div>
          <form action={logout}>
            <button className="flex items-center gap-3 p-3 text-muted-foreground hover:text-primary transition-colors w-full text-left font-bold uppercase text-xs tracking-widest">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </form>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
