// src/components/admin/Sidebar.tsx
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <ul>
        <li>
          <Link href="/admin/products" className="block py-2 hover:bg-gray-300">
            Products
          </Link>
        </li>
        <li>
          <Link href="/admin/categories" className="block py-2 hover:bg-gray-300">
            Categories
          </Link>
        </li>
        {/* Add more links for other admin sections */}
      </ul>
    </div>
  );
}
