import { generateNonce } from "siwe";
import { createNonceSession } from "~/services/session.server";

export async function loader({ request }: { request: Request }) {
  const nonce = generateNonce();

  // await createNonceSession({ request, nonce }).then((res) => {
  //   console.log(res);
  // });

  return nonce;
}
