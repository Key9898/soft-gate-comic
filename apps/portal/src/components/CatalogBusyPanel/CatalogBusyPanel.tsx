import { BookOpen } from 'lucide-react'

const CatalogBusyPanel = () => (
  <div
    data-testid="catalog-busy-panel"
    className="rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center sm:px-8 sm:py-12"
  >
    <div className="shape-circle mx-auto flex h-16 w-16 animate-pulse items-center justify-center bg-gray-100">
      <BookOpen className="h-8 w-8 text-gray-400" aria-hidden="true" />
    </div>
  </div>
)

export default CatalogBusyPanel
