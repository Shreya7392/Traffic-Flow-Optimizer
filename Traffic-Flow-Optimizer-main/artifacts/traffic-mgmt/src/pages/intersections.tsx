import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListIntersections,
  getListIntersectionsQueryKey,
  useCreateIntersection,
  useDeleteIntersection,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Plus, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Intersections() {
  const queryClient = useQueryClient();
  const { data: intersectionsData, isLoading } = useListIntersections();
  const intersections = intersectionsData ?? [];
  const createIntersection = useCreateIntersection();
  const deleteIntersection = useDeleteIntersection();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newLat, setNewLat] = useState("26.8467");
  const [newLng, setNewLng] = useState("80.9462");

  const handleCreate = () => {
    if (!newName || !newLocation) return;
    createIntersection.mutate(
      { data: { name: newName, location: newLocation, lat: Number(newLat), lng: Number(newLng) } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListIntersectionsQueryKey() });
          setIsCreateOpen(false);
          setNewName("");
          setNewLocation("");
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this intersection and all of its roads?")) return;
    deleteIntersection.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListIntersectionsQueryKey() }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground uppercase tracking-tight">Intersections</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage traffic nodes and road connections</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 uppercase tracking-wide text-xs font-bold">
              <Plus className="h-4 w-4 mr-2" />
              New Intersection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-tight">Create Intersection</DialogTitle>
              <DialogDescription>
                Add a new traffic node to the grid.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="uppercase text-xs font-bold text-muted-foreground">Name</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Main St & 1st Ave"
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lat" className="uppercase text-xs font-bold text-muted-foreground">Latitude</Label>
                  <Input id="lat" type="number" step="any" value={newLat} onChange={(e) => setNewLat(e.target.value)} className="font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng" className="uppercase text-xs font-bold text-muted-foreground">Longitude</Label>
                  <Input id="lng" type="number" step="any" value={newLng} onChange={(e) => setNewLng(e.target.value)} className="font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="uppercase text-xs font-bold text-muted-foreground">Location / Coordinates</Label>
                <Input
                  id="location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Downtown Sector 4"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="uppercase text-xs font-bold">Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName || !newLocation || !Number.isFinite(Number(newLat)) || !Number.isFinite(Number(newLng)) || createIntersection.isPending}>
                {createIntersection.isPending ? "Creating..." : "Create Node"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {intersections?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-border rounded-lg bg-card/50"
              >
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">No Intersections</h3>
                <p className="text-sm text-muted-foreground max-w-sm text-center mt-1">
                  The traffic grid is empty. Create your first intersection to begin monitoring.
                </p>
              </motion.div>
            ) : (
              Array.isArray(intersections) && intersections.map((intersection) => (
                <motion.div
                  key={intersection.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-card border-card-border overflow-hidden group">
                    <CardHeader className="pb-3 bg-secondary/30">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-bold">
                            <Link href={`/intersections/${intersection.id}`} className="hover:text-primary transition-colors flex items-center gap-2">
                              {intersection.name}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 font-mono text-xs">
                            <MapPin className="h-3 w-3" /> {intersection.location}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => handleDelete(intersection.id)}
                          disabled={deleteIntersection.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Button asChild variant="secondary" className="w-full uppercase tracking-widest text-[10px] font-bold h-8">
                        <Link href={`/intersections/${intersection.id}`}>
                          Access Control
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
