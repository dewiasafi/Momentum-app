import React, { useState } from 'react'
import { publicRequest } from '../../../api/axiosInstances';
import { getErrorMessage } from '../../../utils/error';
import { Alert, Button, Input, Modal, Switch, Textarea } from '../../ui';
import { Activity } from '../../../types/activity';

const ActivityForm = (props: any) => {
       const [title, setTitle] = useState<string>("");
       const [notes, setNotes] = useState<string>("");
       const [isCompleted, setIsCompleted] = useState<boolean>(false);
       const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
       const [formError, setFormError] = useState<string>("");
     
       const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
             notes: notes.trim() || undefined,
             is_completed: isCompleted,
           };
     
           await publicRequest.post("/activities", payload);
           resetForm();
           props.fetchData(); // Refresh data terbaru
         } catch (err: unknown) {
           setFormError(getErrorMessage(err));
         } finally {
           setIsSubmitting(false);
         }
       };

       const resetForm = () => {
          setTitle("");
          setNotes("");
          setIsCompleted(false);
          setFormError("");
          props.setShowModal(false);
       };

  return (
     <Modal open={props.showModal} onClose={resetForm} size="md">
           <form onSubmit={handleSubmit}>
             <Modal.Header onClose={resetForm}>
               <Modal.Title>Tambah Aktivitas Baru</Modal.Title>
             </Modal.Header>
   
             <Modal.Body className="space-y-4">
               {formError && (
                 <Alert variant="error" onClose={() => setFormError("")}>
                   {formError}
                 </Alert>
               )}
   
               <Input
                 label="Judul Aktivitas"
                 placeholder="Misal: Menyelesaikan modul login..."
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 required
                 fullWidth
               />
   
               <Textarea
                 label="Catatan (Opsional)"
                 placeholder="Tambahkan detail catatan..."
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 fullWidth
               />
   
               <div className="pt-1">
                 <Switch
                   label="Tandai langsung sebagai selesai"
                   description="Aktifkan jika aktivitas ini sudah kamu selesaikan"
                   checked={isCompleted}
                   onChange={(e) => setIsCompleted(e.target.checked)}
                   size="sm"
                 />
               </div>
             </Modal.Body>
   
             <Modal.Footer className="flex justify-end gap-3">
               <Button
                 type="button"
                 variant="ghost"
                 size="md"
                 onClick={resetForm}
                 disabled={isSubmitting}
               >
                 Batal
               </Button>
               <Button
                 type="submit"
                 variant="primary"
                 size="md"
                 loading={isSubmitting}
               >
                 {isSubmitting ? "Menyimpan..." : "Simpan Aktivitas"}
               </Button>
             </Modal.Footer>
           </form>
         </Modal>
  )
}

export default ActivityForm