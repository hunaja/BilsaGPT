import { getSession } from "@auth0/nextjs-auth0";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "BilsaGPT",
  description:
    "BilsaGPT on virtuaalinen oppimisympäristö, jossa robottiope valmentaa sinut voittoon.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col w-full">
          <header className="bg-red-600 w-full p-4 drop-shadow">
            <div className="mx-auto flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <h1 className="text-xl text-red-100">
                  <Link href="/">BilsaGPT</Link>
                </h1>
              </div>

              <div className="flex flex-row items-center">
                {session ? (
                  <>
                    <Link
                      href="/exams"
                      className="text-red-300 hover:text-red-100 mr-4"
                    >
                      Kokeet
                    </Link>

                    <Link
                      href="/api/auth/logout"
                      className="text-red-300 hover:text-red-100"
                    >
                      Kirjaudu ulos ({session.user?.name ?? "tuntematon"})
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/api/auth/login"
                    className="text-red-300 hover:text-red-100"
                  >
                    Kirjaudu sisään
                  </Link>
                )}
              </div>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
