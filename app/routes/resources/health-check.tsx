import { type LoaderFunctionArgs } from "@remix-run/node";

// eslint-disable-next-line unused-imports/no-unused-vars
export async function loader({ request }: LoaderFunctionArgs) {
  return new Response("OK", { status: 200 });
}
