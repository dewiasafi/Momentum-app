import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import { Activity } from "../../../types/activity";
import { publicRequest } from "../../../api/axiosInstances";
import { getErrorMessage } from "../../../utils/error";
import Spinner from "../../ui/Spinner";
import { Alert, Badge, Button, Card, Input, Modal, Switch, Textarea } from "../../ui";
import ActivityForm from "./ActivityForm";

const ActivityList: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  // State untuk melacak activity mana yang sedang di-update statusnya
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  

  const fetchActivities = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await publicRequest.get("/activities", { signal });
      const responseData = res.data;

      // Menangani baik respon array murni maupun { data: [...] }
      const items = Array.isArray(responseData)
        ? responseData
        : responseData?.data || [];

      setActivities(items);
    } catch (err: unknown) {
      if (axios.isCancel(err)) return;
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchActivities(controller.signal);

    return () => controller.abort();
  }, []);

  // Toggle status is_completed langsung dari list
  const handleToggleComplete = async (activity: Activity) => {
    if (activity.id === undefined) return;

    const previousStatus = activity.is_completed;
    const newStatus = !previousStatus;

    // Optimistic update: UI langsung berganti seketika
    setActivities((prev) =>
      prev.map((item) =>
        item.id === activity.id ? { ...item, is_completed: newStatus } : item
      )
    );
    setUpdatingId(activity.id);

    try {
      // Mengirim update ke API (sesuaikan PATCH / PUT sesuai backend kamu)
      await publicRequest.patch(`/activities/${activity.id}`, {
        is_completed: newStatus,
      });
    } catch (err: unknown) {
      // Jika request gagal, kembalikan ke status sebelumnya
      setActivities((prev) =>
        prev.map((item) =>
          item.id === activity.id ? { ...item, is_completed: previousStatus } : item
        )
      );
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };



  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header & Aksi Tambah */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-800">Daftar Aktivitas</h2>
        <Button
          variant="secondary"
          leftIcon={<PlusIcon size={16} />}
          onClick={() => setShowAddModal(true)}
        >
          Tambah Aktivitas
        </Button>
      </div>      
      <ActivityForm 
        showModal = {showAddModal}
        setShowModal = {setShowAddModal}
        fetchData = {fetchActivities}
      />
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner size="lg" label="Memuat aktivitas..." />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="error" onClose={() => setError(null)}>
          Error: {error}
        </Alert>
      )}

      {/* Empty State */}
      {!isLoading && !error && activities.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-dashed border-neutral-300 text-center text-neutral-500">
          Belum ada aktivitas yang tercatat. Silakan tambah aktivitas baru!
        </div>
      )}

      {/* List Activities */}
      {!isLoading && !error && activities.length > 0 && (
        <div className="space-y-3">
          {activities.map((item, index) => (
            <Card
              key={item.id ?? index}
              className={`bg-white p-4 rounded-lg shadow-xs border transition flex items-center justify-between gap-4 ${
                item.is_completed
                  ? "border-green-200 bg-green-50/30"
                  : "border-neutral-200 hover:border-primary-300"
              }`}
            >
              <div className="space-y-1 flex-1">
                <h3
                  className={`font-semibold text-base transition ${
                    item.is_completed
                      ? "line-through text-neutral-400"
                      : "text-neutral-800"
                  }`}
                >
                  {item.title}
                </h3>
                {item.notes && (
                  <p
                    className={`text-sm whitespace-pre-wrap ${
                      item.is_completed ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Status Badge & Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={item.is_completed ? "success" : "warning"} size="sm">
                  {item.is_completed ? "Selesai" : "In Progress"}
                </Badge>

                <Switch
                  checked={Boolean(item.is_completed)}
                  onChange={() => handleToggleComplete(item)}
                  disabled={updatingId === item.id}
                  size="sm"
                  aria-label="Ubah status selesai"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityList;