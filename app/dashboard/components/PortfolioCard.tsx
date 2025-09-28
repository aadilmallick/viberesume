"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import {
  ExternalLink,
  Copy,
  Trash2,
  Calendar,
  Edit,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { Website } from "@/lib/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PortfolioCard({
  website,
  onUpdate,
}: {
  website: Website;
  onUpdate?: () => void;
}) {
  const [newSlug, setNewSlug] = useState(website.slug);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [aiEditDialogOpen, setAiEditDialogOpen] = useState(false);
  const [modificationRequest, setModificationRequest] = useState("");
  const [isModifying, setIsModifying] = useState(false);

  const portfolioUrl = `/sites/${website.slug}`;
  const fullUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }${portfolioUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert("Portfolio URL copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleUpdateSlug = async () => {
    if (newSlug === website.slug || !newSlug.trim()) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/websites/${website.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: newSlug.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update slug");
      }

      alert("Portfolio URL updated successfully!");
      setEditDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Update error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update portfolio URL"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/websites/${website.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio");
      }

      alert("Portfolio deleted successfully!");
      onUpdate?.();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete portfolio");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAiModification = async () => {
    if (!modificationRequest.trim()) return;

    setIsModifying(true);
    try {
      const response = await fetch(`/api/websites/${website.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modificationRequest: modificationRequest.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to modify portfolio");
      }

      alert("Portfolio modified successfully!");
      setAiEditDialogOpen(false);
      setModificationRequest("");
      onUpdate?.();
    } catch (error) {
      console.error("Modification error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to modify portfolio"
      );
    } finally {
      setIsModifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Extract title from HTML
  const titleMatch = website.code.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : `Portfolio ${website.slug}`;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-slate-800 truncate" title={title}>
            {title}
          </h3>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Created {formatDate(website.created_at)}</span>
          </div>
        </div>

        {/* URL */}
        <div className="bg-slate-50 rounded px-3 py-2">
          <p className="text-sm text-slate-600 truncate" title={fullUrl}>
            {portfolioUrl}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href={portfolioUrl} target="_blank" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex-shrink-0"
          >
            <Copy className="w-4 h-4" />
          </Button>

          {/* AI Edit Dialog */}
          <Dialog open={aiEditDialogOpen} onOpenChange={setAiEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Wand2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>AI Portfolio Editor</DialogTitle>
                <DialogDescription>
                  Describe what you'd like to change about your portfolio. For
                  example: "Add a profile photo", "Change the color scheme to
                  green", or "Update my contact email".
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Modification Request
                  </label>
                  <Textarea
                    value={modificationRequest}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setModificationRequest(e.target.value)
                    }
                    placeholder="e.g., Add a professional headshot image to the hero section..."
                    className="mt-1 min-h-[100px]"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Be specific about what you want to change or add
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAiEditDialogOpen(false);
                      setModificationRequest("");
                    }}
                    disabled={isModifying}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAiModification}
                    disabled={isModifying || !modificationRequest.trim()}
                  >
                    {isModifying ? "Modifying..." : "Apply Changes"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Slug Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Portfolio URL</DialogTitle>
                <DialogDescription>
                  Update the URL slug for your portfolio. This will change the
                  public link.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Portfolio URL
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-l border border-r-0">
                      /sites/
                    </span>
                    <Input
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="my-portfolio"
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Only letters, numbers, hyphens, and underscores allowed
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateSlug} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Alert Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Portfolio</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this portfolio? This action
                  cannot be undone. The public link will no longer work.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 justify-end">
                <Button
                  disabled={isDeleting}
                  onClick={() => setEditDialogOpen(false)}
                  className={cn(isDeleting && "opacity-50 cursor-not-allowed")}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}
