// Prevent Mantine styles from being removed when reaching a 404 page (https://github.com/remix-run/remix/issues/1136#issuecomment-1255452202)
export async function loader() {
  throw new Response("Not Found", {
    status: 404,
  });
}
