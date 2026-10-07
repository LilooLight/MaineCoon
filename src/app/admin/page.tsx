"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowLeft,
  Inbox,
  Phone,
  Mail,
  PawPrint,
  CalendarClock,
  Trash2,
  CheckCircle2,
  PhoneCall,
  XCircle,
  Loader2,
  ClipboardList,
  Clock,
  HeartHandshake,
} from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  kittenId: string | null;
  kittenName: string | null;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  confirmed: number;
  closed: number;
  waitingList: number;
  bookings: number;
}

const STATUS_META: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  new: { label: "Новая", color: "bg-accent/10 text-accent border-accent/30", icon: Clock },
  contacted: { label: "Связались", color: "bg-secondary/20 text-secondary-foreground border-secondary/40", icon: PhoneCall },
  confirmed: { label: "Подтверждена", color: "bg-primary/10 text-primary border-primary/30", icon: CheckCircle2 },
  closed: { label: "Закрыта", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const TYPE_META: Record<string, { label: string; icon: typeof PawPrint }> = {
  booking: { label: "Бронь", icon: PawPrint },
  "waiting-list": { label: "Лист ожидания", icon: CalendarClock },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/bookings/list?${params.toString()}`);
      const data = await res.json();
      setBookings(data.bookings ?? []);
      setStats(data.stats ?? null);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/bookings/list", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Ошибка");
      toast.success("Статус обновлён");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
    } catch {
      toast.error("Не удалось обновить статус");
    } finally {
      setUpdating(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Удалить заявку безвозвратно?")) return;
    try {
      const res = await fetch(`/api/bookings/list?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Ошибка");
      toast.success("Заявка удалена");
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setSelected(null);
    } catch {
      toast.error("Не удалось удалить");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground leading-tight">
                Кабинет заводчика
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Управление заявками · «Тихий Дом»
              </p>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              На сайт
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <StatCard icon={Inbox} label="Всего" value={stats.total} color="text-foreground" />
            <StatCard icon={Clock} label="Новые" value={stats.new} color="text-accent" />
            <StatCard icon={PhoneCall} label="Связались" value={stats.contacted} color="text-secondary-foreground" />
            <StatCard icon={CheckCircle2} label="Подтвержд." value={stats.confirmed} color="text-primary" />
            <StatCard icon={PawPrint} label="Бронь" value={stats.bookings} color="text-primary" />
            <StatCard icon={CalendarClock} label="Лист ожид." value={stats.waitingList} color="text-accent" />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="bg-background border border-border h-auto p-1.5 flex-wrap">
              <TabsTrigger value="all" className="gap-1.5">
                Все
              </TabsTrigger>
              <TabsTrigger value="new" className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Clock className="h-3.5 w-3.5" />
                Новые
                {stats && stats.new > 0 && (
                  <span className="ml-1 text-[10px] bg-accent text-accent-foreground rounded-full px-1.5 py-0.5">
                    {stats.new}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="contacted" className="gap-1.5 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <PhoneCall className="h-3.5 w-3.5" />
                Связались
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Подтверждены
              </TabsTrigger>
              <TabsTrigger value="closed" className="gap-1.5">
                <XCircle className="h-3.5 w-3.5" />
                Закрытые
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Bookings list */}
        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-serif text-lg font-semibold text-foreground">
                Заявок пока нет
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Новые заявки с сайта появятся здесь автоматически.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {bookings.map((booking) => {
              const statusMeta = STATUS_META[booking.status] ?? STATUS_META.new;
              const typeMeta = TYPE_META[booking.type] ?? TYPE_META.booking;
              const StatusIcon = statusMeta.icon;
              const TypeIcon = typeMeta.icon;
              return (
                <Card
                  key={booking.id}
                  className="border-border bg-card hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelected(booking)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-serif text-base font-semibold text-foreground">
                              {booking.name}
                            </h3>
                            <Badge variant="outline" className={`text-[10px] ${statusMeta.color}`}>
                              <StatusIcon className="h-2.5 w-2.5 mr-1" />
                              {statusMeta.label}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              {typeMeta.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                            <a
                              href={`tel:${booking.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 hover:text-foreground"
                            >
                              <Phone className="h-3 w-3" />
                              {booking.phone}
                            </a>
                            <a
                              href={`mailto:${booking.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 hover:text-foreground"
                            >
                              <Mail className="h-3 w-3" />
                              {booking.email}
                            </a>
                          </div>
                          {booking.kittenName && (
                            <p className="text-xs text-primary mt-1.5 inline-flex items-center gap-1">
                              <PawPrint className="h-3 w-3" />
                              Котёнок: <strong>{booking.kittenName}</strong>
                            </p>
                          )}
                          {booking.message && (
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                              «{booking.message}»
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" />
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Booking detail dialog */}
      <BookingDialog
        booking={selected}
        onClose={() => setSelected(null)}
        onUpdateStatus={updateStatus}
        onDelete={deleteBooking}
        updating={updating}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center gap-1">
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />
        <span className={`font-serif text-xl sm:text-2xl font-semibold ${color} tabular-nums leading-none`}>
          {value}
        </span>
        <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

function BookingDialog({
  booking,
  onClose,
  onUpdateStatus,
  onDelete,
  updating,
}: {
  booking: Booking | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  updating: string | null;
}) {
  if (!booking) return null;
  const statusMeta = STATUS_META[booking.status] ?? STATUS_META.new;
  const typeMeta = TYPE_META[booking.type] ?? TYPE_META.booking;
  const StatusIcon = statusMeta.icon;
  const TypeIcon = typeMeta.icon;

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Заявка от {booking.name}</DialogTitle>
          <DialogDescription>
            Детали заявки и управление статусом.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">
                {booking.name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <Badge variant="outline" className={`text-[10px] ${statusMeta.color}`}>
                  <StatusIcon className="h-2.5 w-2.5 mr-1" />
                  {statusMeta.label}
                </Badge>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  {typeMeta.label}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(booking.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="grid sm:grid-cols-2 gap-2">
            <a
              href={`tel:${booking.phone}`}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Телефон</p>
                <p className="text-sm font-medium text-foreground truncate">{booking.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${booking.email}`}
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Email</p>
                <p className="text-sm font-medium text-foreground truncate">{booking.email}</p>
              </div>
            </a>
          </div>

          {/* Kitten */}
          {booking.kittenName && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <PawPrint className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-primary uppercase tracking-wide">Котёнок</p>
                <p className="text-sm font-semibold text-foreground">{booking.kittenName}</p>
              </div>
            </div>
          )}

          {/* Message */}
          {booking.message && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                Комментарий
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                «{booking.message}»
              </p>
            </div>
          )}

          {/* Status actions */}
          <div className="border-t border-border pt-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5" />
              Сменить статус
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["new", "contacted", "confirmed", "closed"] as const).map((s) => {
                const meta = STATUS_META[s];
                const Icon = meta.icon;
                const isActive = booking.status === s;
                const isLoading = updating === booking.id;
                return (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(booking.id, s)}
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-lg border text-xs font-medium transition-all disabled:opacity-50 ${
                      isActive
                        ? meta.color
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={() => onDelete(booking.id)}
            className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Удалить заявку
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
