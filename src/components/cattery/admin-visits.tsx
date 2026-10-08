"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Inbox,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  Phone,
  Plus,
  Download,
  Settings,
} from "lucide-react";

interface Visit {
  id: string;
  name: string;
  contact: string;
  visitDate: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

interface VisitStats {
  total: number;
  new: number;
  confirmed: number;
  closed: number;
}

interface UnavailableDay {
  id: string;
  date: string;
  note: string | null;
  source: string;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "bg-accent/10 text-accent border-accent/30" },
  confirmed: { label: "Подтверждена", color: "bg-primary/10 text-primary border-primary/30" },
  closed: { label: "Закрыта", color: "bg-muted text-muted-foreground border-border" },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatVisitDate(dateStr: string | null): string {
  if (!dateStr) return "Дата не указана";
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function AdminVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Visit | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Dates management
  const [dates, setDates] = useState<UnavailableDay[]>([]);
  const [newDate, setNewDate] = useState("");
  const [datesLoading, setDatesLoading] = useState(true);

  // Settings (iCal URL)
  const [gcalUrl, setGcalUrl] = useState("");
  const [gcalSaving, setGcalSaving] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/visits?${params.toString()}`);
      const data = await res.json();
      setVisits(data.visits ?? []);
      setStats(data.stats ?? null);
    } catch {
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchDates = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dates");
      const data = await res.json();
      setDates(data.dates ?? []);
    } catch {
      setDates([]);
    } finally {
      setDatesLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setGcalUrl(data.settings?.gcal_url || "");
    } catch {
      // ignore
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  useEffect(() => {
    fetchDates();
    fetchSettings();
  }, [fetchDates, fetchSettings]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/visits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Ошибка");
      toast.success("Статус обновлён");
      setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
      setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
    } catch {
      toast.error("Ошибка");
    } finally {
      setUpdating(null);
    }
  };

  const deleteVisit = async (id: string) => {
    if (!confirm("Удалить заявку?")) return;
    try {
      await fetch(`/api/admin/visits?id=${id}`, { method: "DELETE" });
      toast.success("Удалено");
      setVisits((prev) => prev.filter((v) => v.id !== id));
      setSelected(null);
    } catch {
      toast.error("Ошибка");
    }
  };

  const addDate = async () => {
    if (!newDate || !/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      toast.error("Введите дату в формате ГГГГ-ММ-ДД");
      return;
    }
    try {
      const res = await fetch("/api/admin/dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate }),
      });
      if (!res.ok) throw new Error("Ошибка");
      toast.success("Дата заблокирована");
      setNewDate("");
      fetchDates();
    } catch {
      toast.error("Ошибка");
    }
  };

  const removeDate = async (id: string) => {
    try {
      await fetch(`/api/admin/dates?id=${id}`, { method: "DELETE" });
      setDates((prev) => prev.filter((d) => d.id !== id));
      toast.success("Дата разблокирована");
    } catch {
      toast.error("Ошибка");
    }
  };

  const saveGcalUrl = async () => {
    setGcalSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "gcal_url", value: gcalUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Ошибка");
      if (data.importedDates !== undefined) {
        toast.success(`iCal импортирован: ${data.importedDates} дат заблокировано`);
      } else if (data.warning) {
        toast.warning(data.warning);
      } else {
        toast.success("Настройка сохранена");
      }
      fetchDates();
    } catch {
      toast.error("Ошибка сохранения");
    } finally {
      setGcalSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Заявки на визит
          </h2>
          <Badge variant="outline" className="text-xs">{visits.length}</Badge>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <MiniStat icon={Inbox} label="Всего" value={stats.total} />
          <MiniStat icon={Clock} label="Новые" value={stats.new} color="text-accent" />
          <MiniStat icon={CheckCircle2} label="Подтвержд." value={stats.confirmed} color="text-primary" />
          <MiniStat icon={XCircle} label="Закрыто" value={stats.closed} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-background border border-border h-auto p-1.5 flex-wrap">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="new" className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Clock className="h-3.5 w-3.5" /> Новые
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="gap-1.5">Подтвержд.</TabsTrigger>
            <TabsTrigger value="closed" className="gap-1.5">Закрытые</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Visits list */}
      {loading ? (
        <div className="grid gap-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : visits.length === 0 ? (
        <Card className="border-dashed mb-6"><CardContent className="p-8 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Заявок на визит пока нет.</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-2 mb-6">
          {visits.map((v) => {
            const meta = STATUS_META[v.status] ?? STATUS_META.new;
            return (
              <Card key={v.id} className="border-border bg-card hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => { setSelected(v); if (v.status === "new") updateStatus(v.id, "confirmed"); }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-serif text-base font-semibold text-foreground">{v.name}</h3>
                          <Badge variant="outline" className={`text-[10px] ${meta.color}`}>{meta.label}</Badge>
                        </div>
                        <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />{formatVisitDate(v.visitDate)}
                        </p>
                        {v.message && <p className="text-xs text-muted-foreground line-clamp-2">{v.message}</p>}
                        <div className="flex items-center gap-3 flex-wrap mt-1.5 text-[11px] text-muted-foreground">
                          <span>{v.contact}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(v.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={(e) => { e.stopPropagation(); deleteVisit(v.id); }} aria-label="Удалить">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Date management */}
      <Card className="border-border bg-card mb-4">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-base font-semibold text-foreground">Управление датами</h3>
          </div>

          {/* Add manual date */}
          <div className="flex items-center gap-2 mb-4">
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-auto" />
            <Button onClick={addDate} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Заблокировать
            </Button>
          </div>

          {/* iCal URL */}
          <div className="grid gap-1.5 mb-3">
            <Label className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Google Calendar iCal ссылка
            </Label>
            <div className="flex gap-2">
              <Input
                value={gcalUrl}
                onChange={(e) => setGcalUrl(e.target.value)}
                placeholder="https://calendar.google.com/calendar/ical/..."
                disabled={settingsLoading || gcalSaving}
              />
              <Button onClick={saveGcalUrl} disabled={gcalSaving || settingsLoading} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {gcalSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Настройки календаря → Интеграция → Секретный адрес в формате iCal. При сохранении даты импортируются автоматически.
            </p>
          </div>

          {/* Blocked dates list */}
          {datesLoading ? (
            <Skeleton className="h-16 rounded-lg" />
          ) : dates.length === 0 ? (
            <p className="text-xs text-muted-foreground">Заблокированных дат нет.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {dates.map((d) => (
                <span key={d.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-muted text-foreground">
                  {d.date}
                  {d.source === "gcal" && <Badge variant="outline" className="text-[9px] ml-1">gcal</Badge>}
                  <button onClick={() => removeDate(d.id)} className="ml-1 text-muted-foreground hover:text-destructive">
                    <XCircle className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>Заявка от {selected?.name}</DialogTitle>
            <DialogDescription>Детали заявки на визит.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-xl font-semibold text-foreground">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(selected.createdAt)}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-[10px] text-primary uppercase tracking-wide mb-1">Дата визита</p>
                <p className="text-sm font-semibold text-foreground">{formatVisitDate(selected.visitDate)}</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Контакт</p>
                <p className="text-sm font-medium text-foreground">{selected.contact}</p>
              </div>

              {selected.message && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Комментарий</p>
                  <p className="text-sm text-foreground/90 leading-relaxed">{selected.message}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button onClick={() => updateStatus(selected.id, "confirmed")} disabled={updating === selected.id}
                  variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
                  {updating === selected.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Подтвердить
                </Button>
                <Button onClick={() => updateStatus(selected.id, "closed")} disabled={updating === selected.id}
                  variant="ghost" size="sm" className="text-muted-foreground">
                  <XCircle className="h-4 w-4" /> Закрыть
                </Button>
                <button onClick={() => deleteVisit(selected.id)}
                  className="ml-auto flex items-center gap-1.5 p-2 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Удалить
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, color = "text-foreground" }: {
  icon: typeof Inbox; label: string; value: number; color?: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <div>
          <p className={`font-serif text-lg font-semibold ${color} leading-none`}>{value}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
