/*
<ai_context>
This server layout provides a shared header and basic structure for (marketing) routes.
Updated to work with the fixed glassmorphism navigation.
</ai_context>
*/

import { Header } from "@/components/header"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden">{children}</main>
    </>
  )
}
