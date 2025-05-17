import ProtectedRoute from "@/components/protected-route"
import HomePage from "@/components/home-page"

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  )
}
