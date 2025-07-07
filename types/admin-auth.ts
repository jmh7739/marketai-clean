export interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "moderator"
  permissions: AdminPermission[]
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

export interface AdminPermission {
  resource: "users" | "products" | "auctions" | "payments" | "reports" | "settings"
  actions: ("read" | "write" | "delete" | "approve")[]
}

export interface AdminAuthState {
  admin: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: AdminPermission[]
}
