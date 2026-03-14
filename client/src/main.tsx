import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl, isPublicPath } from "./const";
import "./index.css";
import "./i18n/config";

// Load Umami analytics hanya jika env valid (cegah error "Unexpected token '<'" saat URL salah)
function loadUmamiIfConfigured() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  if (!endpoint || !websiteId || endpoint.includes("%") || websiteId.includes("%")) return;
  const script = document.createElement("script");
  script.src = `${endpoint.replace(/\/$/, "")}/umami`;
  script.setAttribute("data-website-id", websiteId);
  script.defer = true;
  script.async = true;
  script.onerror = () => {}; // Jangan break halaman jika script gagal
  document.body.appendChild(script);
}

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;
  if (!isUnauthorized) return;

  const pathname = window.location.pathname || "/";
  // Jangan redirect di halaman publik (cegah refresh loop di /login)
  if (isPublicPath(pathname)) return;
  // Pengaman ekstra: jangan pernah redirect ke login kalau sudah di halaman login
  if (pathname === "/login" || pathname.startsWith("/login?")) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL || ""}/api/trpc`,
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);

loadUmamiIfConfigured();
