import type { ActionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { typedjson } from "remix-typedjson";
import { IOUPostSchema } from "~/domain/treasury";
import { createToken } from "~/services/tokens.server";
import { postIouTokenMetadata } from "~/services/treasury.server";

const IouTokenValidator = withZod(IOUPostSchema);

export async function action({ request }: ActionArgs) {
  const formData = await IouTokenValidator.validate(await request.json());
  if (formData.data) {
    const {
      name,
      symbol,
      destinationChain,
      destinationAddress,
      destinationDecimals,
      fireblocksTokenName,
      iouTokenAddresses,
    } = formData.data;
    const res = await postIouTokenMetadata({
      tokenName: name,
      chain: destinationChain,
      decimals: destinationDecimals,
      fireblocksTokenName: fireblocksTokenName,
      iOUTokenContract_addresses: iouTokenAddresses,
    });

    //post token to db
    await createToken(name, destinationChain, destinationDecimals, destinationAddress, symbol, true);

    return typedjson({ ok: true, data: res });
  }
  return typedjson({ ok: false, data: null });
}
