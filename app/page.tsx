/*
 * @Author: Jonny
 * @Date: 2025-12-18 09:45:56
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-22 19:21:53
 * @FilePath: \park-web\app\page.tsx
 */
// app/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function HomePage() {
  // const token = cookies().get('token')

  // if (token) {
  //   redirect('/dashboard')
  // }

  // redirect('/login')
  redirect("/market");
}
