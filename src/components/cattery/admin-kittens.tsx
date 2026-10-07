"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  PawPrint,
  X,
  Loader2,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { BLUR_DATA_URLS } from "@/lib/blur";

interface AdminKitten {
  id: string;
  name: string;
  color: string;
  colorLabel: string;
  gender: string;
  personality: string;
  personalityLabel: string;
  litterId: string;
  birthDate: string;
  imageUrl: string;
  videoUrl: string | null;
  status: string;
  statusLabel: string;
  price: number;
  description: string;
  vaccinated: boolean;
  documented: boolean;
  litter?: {
    name: string;
    father?: { name: string } | null;
    mother?: { name: string } | null;
  } | null;
}

interface Litter {
  id: string;
  name: string;
  father?: { name: string; colorLabel: string } | null;
  mother?: { name: string; colorLabel: string } | null;
}

const COLOR_OPTIONS = [
  { value: "black", label: "Чёрный" },
  { value: "tabby", label: "Дикий (табби)" },
  { value: "silver", label: "Серебряный" },
  { value: "silver-red", label: "Серебряно-рыжий" },
];

const PERSONALITY_OPTIONS = [
  { value: "calm", label: "Спокойный" },
  { value: "playful", label: "Игривый" },
  { value: "independent", label: "Независимый" },
  { value: "affectionate", label: "Ласковый" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Доступен" },
  { value: "reserved", label: "Забронирован" },
  { value: "adopted", label: "В семье" },
  { value: "expected", label: "Ожидается" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Кот" },
  { value: "female", label: "Кошка" },
];

interface KittenFormData {
  name: string;
  color: string;
  gender: string;
  personality: string;
  litterId: string;
  birthDate: string;
  imageUrl: string;
  videoUrl: string;
  status: string;
  price: string;
  description: string;
  vaccinated: boolean;
}

const EMPTY_FORM: KittenFormData = {
  name: "",
  color: "black",
  gender: "male",
  personality: "calm",
  litterId: "",
  birthDate: new Date().toISOString().split("T")[0],
  imageUrl: "",
  videoUrl: "",
  status: "available",
  price: "60000",
  description: "",
  vaccinated: false,
};

export function AdminKittens() {
  const [kittens, setKittens] = useState<AdminKitten[]>([]);
  const [litters, setLitters] = useState<Litter[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<KittenFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/kittens");
      const data = await res.json();
      setKittens(data.kittens ?? []);
      setLitters(data.litters ?? []);
    } catch {
      setKittens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (kitten: AdminKitten) => {
    setForm({
      name: kitten.name,
      color: kitten.color,
      gender: kitten.gender,
      personality: kitten.personality,
      litterId: kitten.litterId,
      birthDate: kitten.birthDate.split("T")[0],
      imageUrl: kitten.imageUrl,
      videoUrl: kitten.videoUrl ?? "",
      status: kitten.status,
      price: String(kitten.price),
      description: kitten.description,
      vaccinated: kitten.vaccinated,
    });
    setEditingId(kitten.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.litterId) {
      toast.error("Выберите помёт");
      return;
    }
    setSaving(true);
    try {
      const colorLabel = COLOR_OPTIONS.find((c) => c.value === form.color)?.label ?? form.color;
      const personalityLabel = PERSONALITY_OPTIONS.find((p) => p.value === form.personality)?.label ?? form.personality;
      const statusLabel = STATUS_OPTIONS.find((s) => s.value === form.status)?.label ?? form.status;

      const payload = {
        ...form,
        colorLabel,
        personalityLabel,
        statusLabel,
        price: Number(form.price),
      };

      if (editingId) {
        const res = await fetch(`/api/admin/kittens/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Ошибка обновления");
        toast.success("Котёнок обновлён");
      } else {
        const res = await fetch("/api/admin/kittens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Ошибка создания");
        toast.success("Котёнок создан");
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить котёнка «${name}» безвозвратно?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/kittens/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ошибка удаления");
      toast.success("Котёнок удалён");
      setKittens((prev) => prev.filter((k) => k.id !== id));
    } catch {
      toast.error("Не удалось удалить");
    } finally {
      setDeletingId(null);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-primary/10 text-primary border-primary/30";
      case "reserved": return "bg-secondary/20 text-secondary-foreground border-secondary/40";
      case "adopted": return "bg-muted text-muted-foreground border-border";
      case "expected": return "bg-accent/10 text-accent border-accent/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PawPrint className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Управление котятами
          </h2>
          <Badge variant="outline" className="text-xs">
            {kittens.length}
          </Badge>
        </div>
        <Button onClick={openCreate} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-1" />
          Добавить
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : kittens.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <PawPrint className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Котят пока нет. Добавьте первого.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {kittens.map((kitten) => (
            <Card key={kitten.id} className="border-border bg-card hover:shadow-sm transition-shadow">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden ring-1 ring-border">
                  <Image
                    src={kitten.imageUrl}
                    alt={kitten.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URLS.muted}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      {kitten.name}
                    </h3>
                    <Badge variant="outline" className={`text-[10px] ${statusColor(kitten.status)}`}>
                      {kitten.statusLabel}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {kitten.colorLabel}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {kitten.gender === "male" ? "Кот" : "Кошка"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {kitten.personalityLabel} · {kitten.price.toLocaleString("ru-RU")} ₽
                    {kitten.litter && ` · ${kitten.litter.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(kitten)}
                    aria-label={`Редактировать ${kitten.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(kitten.id, kitten.name)}
                    disabled={deletingId === kitten.id}
                    aria-label={`Удалить ${kitten.name}`}
                  >
                    {deletingId === kitten.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto custom-scroll bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {editingId ? "Редактировать котёнка" : "Новый котёнок"}
            </DialogTitle>
            <DialogDescription>
              Заполните данные о котёнке.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {editingId ? "Редактировать" : "Новый котёнок"}
            </h2>
            <button
              onClick={() => setDialogOpen(false)}
              aria-label="Закрыть"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="k-name">Имя</Label>
                <Input
                  id="k-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="k-price">Цена (₽)</Label>
                <Input
                  id="k-price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Окрас</Label>
                <Select value={form.color} onValueChange={(v) => setForm({ ...form, color: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Пол</Label>
                <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Характер</Label>
                <Select value={form.personality} onValueChange={(v) => setForm({ ...form, personality: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PERSONALITY_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Статус</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Помёт</Label>
                <Select value={form.litterId} onValueChange={(v) => setForm({ ...form, litterId: v })}>
                  <SelectTrigger><SelectValue placeholder="Выберите помёт" /></SelectTrigger>
                  <SelectContent>
                    {litters.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="k-birth">Дата рождения</Label>
                <Input
                  id="k-birth"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="k-image" className="flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5" />
                URL изображения
              </Label>
              <Input
                id="k-image"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="/images/kittens/kitten-silver.jpg"
                required
                disabled={saving}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="k-video">URL видео (опционально)</Label>
              <Input
                id="k-video"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="/videos/kitten-behavior.mp4"
                disabled={saving}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="k-desc">Описание</Label>
              <Textarea
                id="k-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Спокойный серебряный котёнок, любит детей..."
                required
                disabled={saving}
                className="resize-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.vaccinated}
                onChange={(e) => setForm({ ...form, vaccinated: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Привит
            </label>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Сохранение...</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" />{editingId ? "Сохранить" : "Создать"}</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
