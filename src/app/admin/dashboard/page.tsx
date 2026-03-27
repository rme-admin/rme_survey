
import { getStats, addQuestion, toggleQuestionStatus, deleteQuestion } from '@/app/actions/admin';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, Trash2, Power, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="font-black text-xl tracking-tighter">ADMIN<span className="text-accent">DASH</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 bg-primary text-white font-bold uppercase text-xs tracking-widest">
            <BarChart3 className="h-4 w-4" /> Results Overview
          </Link>
          <div className="px-3 py-2 text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mt-8">System</div>
          <form action={logout}>
            <button className="flex items-center gap-3 p-3 text-muted-foreground hover:text-white transition-colors w-full text-left font-bold uppercase text-xs tracking-widest">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-border bg-card p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold uppercase tracking-tight">Research Insights <span className="text-accent">Management</span></h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-accent text-accent rounded-none px-4 py-1">ADMIN SESSION ACTIVE</Badge>
          </div>
        </header>

        <div className="p-8 space-y-12">
          {/* Add Question Form */}
          <section className="bg-card border border-border p-8">
            <div className="flex items-center gap-2 mb-8">
              <Plus className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-bold uppercase">Add New Research Question</h2>
            </div>
            
            <form action={addQuestion} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Statement A (Left)</label>
                <Textarea 
                  name="statementA" 
                  placeholder="e.g. Modern UI design should prioritize whitespace over information density." 
                  className="min-h-[120px] bg-background border-border resize-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Statement B (Right)</label>
                <Textarea 
                  name="statementB" 
                  placeholder="e.g. Modern UI design should prioritize information density over whitespace." 
                  className="min-h-[120px] bg-background border-border resize-none"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button className="bg-accent hover:bg-orange-700 text-white uppercase font-bold tracking-widest h-12 px-12">
                  Deploy Question
                </Button>
              </div>
            </form>
          </section>

          {/* Questions Table */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" /> Active Experiments & Results
            </h2>
            
            <div className="bg-card border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-primary/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Comparison Statements</TableHead>
                    <TableHead className="text-right">Choice A</TableHead>
                    <TableHead className="text-right">Choice B</TableHead>
                    <TableHead className="text-right">Ratio</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.map((q) => {
                    const total = q.countA + q.countB;
                    const percentA = total > 0 ? Math.round((q.countA / total) * 100) : 50;
                    
                    return (
                      <TableRow key={q.id}>
                        <TableCell>
                          <Badge 
                            variant={q.isActive ? "default" : "secondary"} 
                            className={cn(
                              "rounded-none uppercase text-[10px] font-bold px-2 py-0.5",
                              q.isActive ? "bg-green-600" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {q.isActive ? "Live" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="space-y-1">
                            <p className="text-sm font-medium line-clamp-1 italic text-muted-foreground">A: {q.statementA}</p>
                            <p className="text-sm font-medium line-clamp-1 italic text-muted-foreground">B: {q.statementB}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-accent">{q.countA}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-accent">{q.countB}</TableCell>
                        <TableCell className="text-right w-[120px]">
                          <div className="w-full bg-secondary h-2 mt-1">
                            <div className="bg-accent h-full" style={{ width: `${percentA}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] mt-1 font-bold">
                            <span>{percentA}%</span>
                            <span>{100 - percentA}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <form action={toggleQuestionStatus.bind(null, q.id, q.isActive)}>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white">
                                <Power className="h-4 w-4" />
                              </Button>
                            </form>
                            <form action={deleteQuestion.bind(null, q.id)}>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {stats.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground uppercase text-xs font-bold tracking-widest">
                        No experiments found in database.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
