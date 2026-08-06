import { SearchIcon } from "lucide-react"
import { Button, Input, Select, Textarea } from "./components/ui"


function App() {
  return (
    <div className="h-screen items-center justify-center bg-primary-50 p-10">
      <h1 className="text-3xl font-sans font-bold text-primary-700">
        Setup berhasil! 🎉
      </h1>
      <div>
        <Button variant="primary">Simpan</Button>

        <Input label="Email" type="email" required />
        <Input label="Cari" leftIcon={<SearchIcon size={16} />} size="sm" />
        <Input label="Kode Promo" errorText="Kode tidak valid" />

        <Textarea label="Deskripsi" required />
        <Textarea disabled label="Bio" maxLength={200} showCount value="test"/>
        <Textarea label="Catatan" resize="none" errorText="Wajib diisi" />

    <Select
  label="Provinsi"
  placeholder="Pilih provinsi"
  leftIcon={<SearchIcon size={16} />}
  options={[
    { label: "DKI Jakarta", value: "jakarta" },
    { label: "Jawa Barat", value: "jabar" },
    { label: "Jawa Timur", value: "jatim" },
  ]}
  required
/>

<Select
  label="Status"
  errorText="Wajib pilih status"
  options={[
    { label: "Aktif", value: "active" },
    { label: "Nonaktif", value: "inactive", disabled: true },
  ]}
/>

      </div>
    </div>
  )
}
export default App
