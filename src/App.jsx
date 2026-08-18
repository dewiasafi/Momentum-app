import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
} from "./components/ui";


function App() {
  const users = [
    {
      id: 1,
      name: "Deasy Safitri",
      src: "https://i.pinimg.com/736x/76/cf/2c/76cf2c70697b3ba37f7d9e96c14ba4dc.jpg",
      status: "online",
    },
    {
      id: 2,
      name: "John Doe",
      src: "https://i.pinimg.com/736x/76/cf/2c/76cf2c70697b3ba37f7d9e96c14ba4dc.jpg",
      status: "busy",
    },
    {
      id: 3,
      name: "Jane Smith",
      status: "away",
    },
    {
      id: 4,
      name: "Michael",
    },
    {
      id: 5,
      name: "Alex",
    },
  ];
  return (
    <div className="h-screen items-center justify-center bg-primary-50 p-10">
      <h1 className="text-3xl font-sans font-bold text-primary-700">
        Setup berhasil! 🎉
      </h1>
      <div>

        <Card>
          <Card.Header>
            <div>
              <Card.Title>Detail Pesanan</Card.Title>
              <Card.Subtitle>Order #12345</Card.Subtitle>
            </div>
            <Badge variant="success">Selesai</Badge>
          </Card.Header>

          <p className="text-sm text-neutral-600">Isi konten card di sini...</p>

          <Card.Footer>
            <Button variant="ghost" size="sm">Batal</Button>
            <Button variant="primary" size="sm">Lihat Detail</Button>
          </Card.Footer>
        </Card>
        {/* <Card padding="lg" shadow="sm">Lebih lega + ada shadow</Card>
        <Card hoverable onClick={() => console.log("HI")}>Card yang bisa diklik</Card> */}
        <Avatar src="https://i.pinimg.com/736x/76/cf/2c/76cf2c70697b3ba37f7d9e96c14ba4dc.jpg" name="Budi Santoso" />
        <Avatar name="Budi Santoso" status="online" />  {/* langsung inisial "BS", nggak ada src */}
        <AvatarGroup
          avatars={[
            { name: "Dewi Ayu" },
            { name: "Budi Santoso" },
            { name: "Citra Lestari" },
            { name: "Dodi Pratama" },
            { name: "Eka Putri" },
          ]}
          max={3}
        />
        <Avatar name="AB" size="xs" />
        <Avatar name="AB" size="xl" status="online" />
        <Avatar
          src="https://i.pinimg.com/736x/76/cf/2c/76cf2c70697b3ba37f7d9e96c14ba4dc.jpg"
          name="Deasy Safitri"
        />

        {/* Interactive */}
        <Avatar
          src="https://i.pinimg.com/736x/76/cf/2c/76cf2c70697b3ba37f7d9e96c14ba4dc.jpg"
          name="Deasy Safitri"
          status="online"
          onClick={() => console.log("Avatar clicked")}
        />
        <AvatarGroup
          avatars={users}
          max={4}
          size="md"
          onAvatarClick={(user) => {
            console.log(user);
          }}
          onOverflowClick={(remainingUsers) => {
            console.log(remainingUsers);
          }}
        />
      </div>
    </div>
  );
}
export default App;
