"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api/api-client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/common";
import type { CurriculumRequest } from "@/types/curriculum";
import type {
  CreateTopicRequest,
  TopicRequest,
  UpdateTopicRequest,
} from "@/types/topics";
import { CardGridSkeleton } from "@/components/ui/skeleton-card";

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<TopicRequest[]>([]);
  const [curricula, setCurricula] = useState<CurriculumRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [curriculumId, setCurriculumId] = useState("");

  const fetchData = async () => {
    try {
      const [topicsRes, currRes] = await Promise.all([
        apiClient<ApiResponse<TopicRequest[]>>(apiEndpoints.topics.getAll),
        apiClient<ApiResponse<CurriculumRequest[]>>(
          apiEndpoints.curriculumns.getAll
        ),
      ]);

      if (topicsRes.success && topicsRes.data) {
        setTopics(topicsRes.data);
      }
      if (currRes.success && currRes.data) {
        setCurricula(currRes.data);
        if (currRes.data.length > 0 && !curriculumId) {
          setCurriculumId(currRes.data[0].id);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load topics.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateDialog = () => {
    setEditingTopic(null);
    setName("");
    setDescription("");
    setCurriculumId(curricula[0]?.id ?? "");
    setDialogOpen(true);
  };

  const openEditDialog = (topic: TopicRequest) => {
    setEditingTopic(topic);
    setName(topic.name);
    setDescription(topic.description);
    setCurriculumId(topic.curriculumId);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Topic name is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingTopic) {
        const payload: UpdateTopicRequest = {
          name: name.trim(),
          description: description.trim(),
        };
        const res = await apiClient<ApiResponse<TopicRequest>>(
          apiEndpoints.topics.update(editingTopic.id),
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        if (res.success && res.data) {
          setTopics((prev) =>
            prev.map((t) => (t.id === editingTopic.id ? res.data! : t))
          );
          toast.success("Topic updated successfully.");
          setDialogOpen(false);
        } else {
          toast.error(res.message || "Failed to update topic.");
        }
      } else {
        if (!curriculumId) {
          toast.error("Please select a curriculum.");
          setSubmitting(false);
          return;
        }
        const payload: CreateTopicRequest = {
          name: name.trim(),
          description: description.trim(),
          curriculumId,
        };
        const res = await apiClient<ApiResponse<TopicRequest>>(
          apiEndpoints.topics.create,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        if (res.success && res.data) {
          setTopics((prev) => [...prev, res.data!]);
          toast.success("Topic created successfully.");
          setDialogOpen(false);
        } else {
          toast.error(res.message || "Failed to create topic.");
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save topic.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (topic: TopicRequest) => {
    if (!confirm(`Delete topic "${topic.name}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(topic.id);
    try {
      const res = await apiClient<ApiResponse<boolean>>(
        apiEndpoints.topics.delete(topic.id),
        { method: "DELETE" }
      );
      if (res.success) {
        setTopics((prev) => prev.filter((t) => t.id !== topic.id));
        toast.success(`"${topic.name}" deleted.`);
      } else {
        toast.error(res.message || "Failed to delete topic.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete topic.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTopics = topics.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.curriculum.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <CardGridSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Grammar Topics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage curriculum topics for practice sessions and contests.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          New Topic
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search topics or curriculum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredTopics.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No grammar topics found.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {topic.curriculum}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditDialog(topic)}
                      aria-label={`Edit ${topic.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={deletingId === topic.id}
                      onClick={() => handleDelete(topic)}
                      className="text-destructive hover:text-destructive"
                      aria-label={`Delete ${topic.name}`}
                    >
                      {deletingId === topic.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-base">{topic.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {topic.description || "No description provided."}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <span>{topic.problemCount} problems</span>
                <span>{topic.grammarRuleCount} rules</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTopic ? "Edit Grammar Topic" : "Create Grammar Topic"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {!editingTopic && (
              <div className="space-y-1.5">
                <Label>Curriculum</Label>
                <Select
                  value={curriculumId}
                  onValueChange={(val) => {
                    if (val) setCurriculumId(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {curricula.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="topic-name">Topic Name</Label>
              <Input
                id="topic-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Narration"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topic-desc">Description</Label>
              <Textarea
                id="topic-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief overview of this grammar topic..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
                {editingTopic ? "Save Changes" : "Create Topic"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
