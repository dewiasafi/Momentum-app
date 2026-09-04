import { LockIcon, UserIcon } from "lucide-react";
import {

  Button,
  Divider,
  Modal,
  Tabs,
} from "./components/ui";
import { useState } from "react";
import Accordion from "./components/ui/Accordion";


function App() {
  const tabs = [
    { value: "profile", label: "Profil", icon: <UserIcon size={16} />, children: <div>PROFIL</div> },
    { value: "security", label: "Keamanan", icon: <LockIcon size={16} />, children: <div>SECURITY</div> },
    { value: "billing", label: "Billing", disabled: true, children: <div>BILLLING</div> },
  ]

  const [open, setOpen] = useState(false);


  return (
    <div className="h-screen items-center justify-center bg-primary-50 p-10">
      <h1 className="text-3xl font-sans font-bold text-primary-700">
        Setup berhasil! 🎉
      </h1>
      <div>
        <Button onClick={() => setOpen(true)}>Hapus Akun</Button>
        <div className="flex items-center h-6">
          <span>Beranda</span>
          <Divider orientation="vertical" className="mx-3" />
          <span>Produk</span>
        </div>
        <Accordion type="multiple" defaultOpen={["specs", "shipping"]}>
          <Accordion.Item value="specs" title="Spesifikasi">...</Accordion.Item>
          <Accordion.Item value="shipping" title="Info Pengiriman">...</Accordion.Item>
          <Accordion.Item value="reviews" title="Ulasan">...</Accordion.Item>
        </Accordion>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Modal.Header onClose={() => setOpen(false)}>
            <Modal.Title>Hapus akun?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="text-sm text-neutral-600">
              Tindakan ini nggak bisa dibatalin. Semua data kamu bakal terhapus permanen.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
            <Button variant="danger" onClick={() => console.log("DELETE")}>Hapus</Button>
          </Modal.Footer>
        </Modal>
        <Tabs defaultValue="profile">
          <Tabs.Item value="profile" label="Profil" icon={<UserIcon size={16} />}>
            <p>Konten tab profil...</p>
          </Tabs.Item>

          <Tabs.Item value="security" label="Keamanan" icon={<LockIcon size={16} />}>
            <p>Konten tab keamanan...</p>
          </Tabs.Item>

          <Tabs.Item value="billing" label="Billing" disabled>
            <p>Konten billing...</p>
          </Tabs.Item>
        </Tabs>
        <Tabs defaultValue="profile" items={tabs} />
        <Tabs defaultValue="profile" items={tabs} variant="pill" />
      </div>
    </div>
  );
}
export default App;
