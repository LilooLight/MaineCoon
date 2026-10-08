"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  Mail,
  Phone,
  Clock,
  Trash2,
  Inbox,
  MailOpen,
  Reply,
  XCircle,
  Loader2,
  MessageSquare,
  Send,
  Calendar as CalendarIcon,
  Send as TelegramIcon,
  MessageCircle,
} from "lucide-react";

interface AdminMessage {
  id: string;
  name: string;
  preferredDates: string;
  contactChannel: string;
  contactValue: string;
  comment: string;
  status: string;
  createdAt: string;
}

interface MsgStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  closed: number;
}

const STATUS_META: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  new: { label: "Новое", color: "bg-accent/10 text-accent border-accent/30", icon: Clock },
  read: { label: "Прочитано", color: "bg-secondary/20 text-secondary-foreground border-secondary/40", icon: MailOpen },
  replied: { label: "Отвечено", color: "bg-primary/10 text-primary border-primary/30", icon: Reply },
  closed: { label: "Закрыто", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const CHANNEL_META: Record<string, { label: string; icon: typeof Phone; hrefPrefix: string }> = {
  phone: { label: "Телефон", icon: Phone, hrefPrefix: "tel:" },
  email: { label: "Email", icon: Mail, hrefPrefix: "mailto:" },
  telegram: { label: "Telegram", icon: TelegramIcon, hrefPrefix: "https://t.me/" },
  vk: { label: "ВКонтакте", icon: MessageCircle, hrefPrefix: "" },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDates(datesJson: string): string {
  try {
    const dates: string[] = JSON.parse(datesJson);
    if (!Array.isArray(dates) || dates.length === 0) return "Даты не указаны";
    return dates
      .map((d) => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }))
      .join(", ");
  } catch {
    return "Даты не указаны";
  }
}

export function AdminMessages() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [stats, setStats] = useState<MsgStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<AdminMessage | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/messages?${params.toString()}`);
      const data = await res.json();
      setMessages(data.messages ?? []);
      setStats(data.stats ?? null);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Ошибка");
      toast.success("Статус обновлён");
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
    } catch {
      toast.error("Не удалось обновить статус");
    } finally {
      setUpdating(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Удалить сообщение безвозвратно?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Ошибка");
      toast.success("Сообщение удалено");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setSelected(null);
    } catch {
      toast.error("Не удалось удалить");
    } finally {
      setDeletingId(null);
    }
  };

  const getContactHref = (channel: string, value: string) => {
    const meta = CHANNEL_META[channel];
    if (!meta) return "#";
    if (channel === "telegram") {
      const nick = value.replace("@", "");
      return `https://t.me/${nick}`;
    }
    if (channel === "vk") return value;
    return `${meta.hrefPrefix}${value}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Заявки на визит
          </h2>
          <Badge variant="outline" className="text-xs">
            {messages.length}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <MiniStat icon={Inbox} label="Всего" value={stats.total} />
          <MiniStat icon={Clock} label="Новые" value={stats.new} color="text-accent" />
          <MiniStat icon={MailOpen} label="Прочитано" value={stats.read} color="text-secondary-foreground" />
          <MiniStat icon={Reply} label="Отвечено" value={stats.replied} color="text-primary" />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="bg-background border border-border h-auto p-1.5 flex-wrap">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="new" className="gap-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              <Clock className="h-3.5 w-3.5" />
              Новые
              {stats && stats.new > 0 && (
                <span className="ml-1 text-[10px] bg-accent text-accent-foreground rounded-full px-1.5 py-0.5">
                  {stats.new}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="gap-1.5">Прочитано</TabsTrigger>
            <TabsTrigger value="replied" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Отвечено</TabsTrigger>
            <TabsTrigger value="closed" className="gap-1.5">Закрыто</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="grid gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Заявок пока нет.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {messages.map((msg) => {
            const statusMeta = STATUS_META[msg.status] ?? STATUS_META.new;
            const StatusIcon = statusMeta.icon;
            const channelMeta = CHANNEL_META[msg.contactChannel] ?? CHANNEL_META.phone;
            const ChannelIcon = channelMeta.icon;
            return (
              <Card
                key={msg.id}
                className="border-border bg-card hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => {
                  setSelected(msg);
                  if (msg.status === "new") updateStatus(msg.id, "read");
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-serif text-base font-semibold text-foreground">
                            {msg.name}
                          </h3>
                          <Badge variant="outline" className={`text-[10px] ${statusMeta.color}`}>
                            <StatusIcon className="h-2.5 w-2.5 mr-1" />
                            {statusMeta.label}
                          </Badge>
                        </div>
                        <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {formatDates(msg.preferredDates)}
                        </p>
                        {msg.comment && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {msg.comment}
                          </p>
                        )}
                        <div className="flex items-center gap-3 flex-wrap mt-1.5 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <ChannelIcon className="h-3 w-3" />
                            {msg.contactValue}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(msg.id);
                      }}
                      disabled={deletingId === msg.id}
                      aria-label="Удалить"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>Заявка от {selected?.name}</DialogTitle>
            <DialogDescription>
              Детали заявки на визит и управление статусом.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-xl font-semibold text-foreground leading-tight">
                    {selected.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>

              {/* Preferred dates */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-[10px] text-primary uppercase tracking-wide mb-1 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Удобные даты
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDates(selected.preferredDates)}
                </p>
              </div>

              {/* Contact */}
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                  Канал связи
                </p>
                <a
                  href={getContactHref(selected.contactChannel, selected.contactValue)}
                  target="_blank"
                  rel="noopener"
                  className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  {(() => {
                    const meta = CHANNEL_META[selected.contactChannel];
                    const Icon = meta?.icon ?? Phone;
                    return <><Icon className="h-4 w-4" />{selected.contactValue}</>;
                  })()}
                </a>
              </div>

              {/* Comment */}
              {selected.comment && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                    Комментарий
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                    {selected.comment}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href={getContactHref(selected.contactChannel, selected.contactValue)}
                  target="_blank"
                  rel="noopener"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 text-sm font-medium transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Связаться
                </a>
                <Button
                  onClick={() => updateStatus(selected.id, "replied")}
                  disabled={updating === selected.id}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                >
                  {updating === selected.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Reply className="h-4 w-4" />
                  )}
                  Отвечено
                </Button>
                <Button
                  onClick={() => updateStatus(selected.id, "closed")}
                  disabled={updating === selected.id}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <button
                onClick={() => deleteMessage(selected.id)}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Удалить сообщение
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  color = "text-foreground",
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
  color?: string;
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
