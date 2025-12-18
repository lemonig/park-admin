import type { ReactNode } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  /**
   * 🚧 这里是“鉴权的天然入口”
   * 以后你可以在这里：
   * - 校验 cookie / token
   * - 没登录 redirect('/login')
   */

  return <AdminLayout>{children}</AdminLayout>;
}
