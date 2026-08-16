import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  const details = {
    event: "request_error",
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    digest: typeof error === "object" && error !== null && "digest" in error ? String(error.digest) : undefined,
    method: request.method,
    path: request.path,
    route: context.routePath,
    routeType: context.routeType,
    router: context.routerKind,
  };

  console.error("[request_error]", JSON.stringify(details));
};
