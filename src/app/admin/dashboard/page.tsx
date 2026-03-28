"use server";
import { getStats, addQuestion, toggleQuestionStatus, deleteQuestion } from '@/app/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Plus, Settings2, BarChart3, Power, Trash2 } from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <>
      <header className="h-20 border-b border-border bg-card p-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold uppercase tracking-tight text-primary">Survey <span className="text-accent">Management</span></h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-accent text-accent rounded-md px-4 py-1 font-bold">ADMIN SESSION ACTIVE</Badge>
        </div>
      </header>
      <div className="p-8 space-y-12 overflow-y-auto max-h-[calc(100vh-80px)]">
        {/* Add Question Form */}
        <section className="bg-card border border-border p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <Plus className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold uppercase text-primary">Add New Research Question</h2>
          </div>
          <form action="/api/admin/add-question" method="POST" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Statement A (Left)</label>
              <Textarea 
                name="statementA" 
                placeholder="e.g. Research resources are easily accessible in our institution." 
                className="min-h-[100px] bg-background border-border resize-none rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Statement B (Right)</label>
              <Textarea 
                name="statementB" 
                placeholder="e.g. We face significant challenges in procuring research equipment." 
                className="min-h-[100px] bg-background border-border resize-none rounded-xl"
                required
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                  <Settings2 className="h-3 w-3" /> Primary Option Label
                </label>
                <Input 
                  name="optionA" 
                  placeholder="e.g. Completely Agree" 
                  defaultValue="Completely Agree"
                  className="h-12 bg-background border-border rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                  <Settings2 className="h-3 w-3" /> Secondary Option Label
                </label>
                <Input 
                  name="optionB" 
                  placeholder="e.g. Sometimes" 
                  defaultValue="Sometimes"
                  className="h-12 bg-background border-border rounded-xl"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="bg-accent hover:bg-orange-700 text-white uppercase font-bold tracking-widest h-12 px-12 rounded-xl">
                Deploy Question
              </Button>
            </div>
          </form>
        </section>
        {/* Questions Table */}
        <section className="space-y-4 pb-12">
          <h2 className="text-xl font-bold uppercase flex items-center gap-2 text-primary">
            <BarChart3 className="h-5 w-5 text-accent" /> Active Experiments & Results
          </h2>
          <div className="bg-card border border-border overflow-hidden rounded-2xl shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent font-bold">
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Comparison Statements & Labels</TableHead>
                  <TableHead className="text-right">Choice A</TableHead>
                  <TableHead className="text-right">Choice B</TableHead>
                  <TableHead className="text-right">Ratio</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((q: any) => {
                  const total = q.countA + q.countB;
                  const percentA = total > 0 ? Math.round((q.countA / total) * 100) : 50;
                  return (
                    <TableRow key={q.id}>
                      <TableCell>
                        <Badge 
                          variant={q.isActive ? "default" : "secondary"} 
                          className={cn(
                            "rounded-md uppercase text-[10px] font-bold px-2 py-0.5",
                            q.isActive ? "bg-green-600" : "bg-muted text-muted-foreground"
                          )}
                        >
                          {q.isActive ? "Live" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium line-clamp-1 italic text-muted-foreground">A: {q.statementA}</p>
                            <p className="text-sm font-medium line-clamp-1 italic text-muted-foreground">B: {q.statementB}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-muted/50 border-border">Option 1: {q.optionA}</Badge>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold bg-muted/50 border-border">Option 2: {q.optionB}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-accent">{q.countA}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-accent">{q.countB}</TableCell>
                      <TableCell className="text-right w-[120px]">
                        <div className="w-full bg-secondary h-2 mt-1 rounded-full overflow-hidden">
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
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
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
    </>
  );
}
