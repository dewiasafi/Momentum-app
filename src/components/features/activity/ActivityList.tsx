import React, { useEffect, useRef, useState } from 'react'
import { Activity } from '../../../types/activity'
import { publicRequest } from '../../../api/axiosInstances';
import { getErrorMessage } from '../../../utils/error';
import Spinner from '../../ui/Spinner';
import { PlusIcon } from 'lucide-react';
import { Button, Input, Textarea } from '../../ui';

const ActivityList: React.FC = () => {
     const [activities, setActivities] = useState<Activity[]>([]);
     const [isLoading, setIsLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     const [title, setTitle] = useState<string>("");
     const [notes, setNotes] = useState<string>("");
     const [addActivity, setAddActivity] = useState<boolean>(false)
     const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 
     const [formError, setFormError] = useState<string>("");
     const fetchedRef = useRef(false);
     
     const fetchActities = async() => {
          try {
               setIsLoading(true)
               setError(null)

               const res = await publicRequest.get("/activities")
               const data = res.data;
               setActivities(data || []);
          } catch (err: unknown) {
                const message = getErrorMessage(err)
               setError(message);
          } finally {
               setIsLoading(false)
          }
     }

     useEffect(()=> {
          if (fetchedRef.current) return;
          fetchedRef.current = true;
          fetchActities()
     },[])


       const handleSubmit = async(e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
         setFormError("");
     
         if (!title.trim()) {
           setFormError("Judul aktivitas wajib diisi");
           return;
         }
     
         try {
           setIsSubmitting(true);
     
           const payload: Omit<Activity, "id"> = {
             title: title.trim(),
             notes: notes.trim(),
             is_completed: false,
           };
     
           await publicRequest.post("/activities", payload)     
           setTitle("");
           setNotes("");
           setAddActivity(false)
           fetchActities()
         } catch (error) {
           setFormError(getErrorMessage(error));
         } finally {
           setIsSubmitting(false);
         }
       }

     return (
     <div className="space-y-4">
     <Button variant="secondary" leftIcon={<PlusIcon size={16} />} onClick={() => setAddActivity(true)}>
        Tambah Item
      </Button>
      {addActivity && 
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow space-y-4"
        >
          <Input
            label="Judul Aktivitas"
            placeholder="Masukkan judul..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            errorText={formError}
            required
            fullWidth
          />
          <Textarea
            label="Catatan (Notes)"
            placeholder="Masukkan catatan (opsional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
          <Button
               type="submit"
               variant="primary"
               size="md"
               loading={isSubmitting}
               fullWidth
          >
               {isSubmitting ? "Menyimpan..." : "Tambah Aktivitas"}
          </Button>
        </form>  
      }
        <h2 className="text-xl font-bold text-neutral-800">Daftar Aktivitas</h2>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner size="lg" label="Memuat aktivitas..." />
          </div>
        )}

        {error && !isLoading && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            Error: {error}
          </div>
        )}

        {!isLoading && !error && activities.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow text-center text-neutral-500">
            Belum ada aktivitas.
          </div>
        )}

        {!isLoading && !error && activities.length > 0 && (
          <div className="space-y-3">
            {activities.map((item, index) => (
              <div
                key={item.id ?? index}
                className="bg-white p-4 rounded-lg shadow flex items-start justify-between border-l-4 border-l-blue-500"
              >
                <div>
                  <h3 className="font-semibold text-neutral-800 text-lg">
                    {item.title}
                  </h3>
                  {item.notes && (
                    <p className="text-neutral-600 text-sm mt-1">{item.notes}</p>
                  )}
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    item.is_completed
                      ? "bg-green-100 text-primary-900"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.is_completed ? "Selesai" : "In Progress"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
     )
}

export default ActivityList