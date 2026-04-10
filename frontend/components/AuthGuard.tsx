"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/login", "/register", "/"];

export default function AuthGuard({ children }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login");
    } else {
      setChecked(true);
    }
  }, [pathname]);

  if (!checked) return null;

  return children;
}
