import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link className="mr-2" href="/dashboard">Dashboard</Link>
      <Link className="mr-2" href="/profile">Profile</Link>
      <Link className="mr-2" href="/logout">Logout</Link> 
      <br />
      {children} 
    </div>
  );
}
