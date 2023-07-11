import type { ActionArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { typedjson } from "remix-typedjson";
import { forbidden } from "remix-utils";
import { z } from "zod";
import { EvmAddressSchema } from "~/domain/address";
import { requireUser } from "~/services/session.server";
import { createToken } from "~/services/tokens.server";

const AddTokenSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  destinationChain: z.string(),
  destinationAddress: EvmAddressSchema,
  destinationDecimals: z.number(),
  isIouToken: z.boolean(),
});

export type AddToken = z.infer<typeof AddTokenSchema>;

const IouTokenValidator = withZod(AddTokenSchema);

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);

  if (!user || !user.isAdmin) {
    throw forbidden({ error: "Not allowed" });
  }
  const formData = await IouTokenValidator.validate(await request.json());
  if (formData.data) {
    const { name, symbol, destinationChain, destinationAddress, destinationDecimals, isIouToken } = formData.data;

    //post token to db
    await createToken(name, destinationChain, destinationDecimals, destinationAddress, symbol, isIouToken);

    return typedjson({ ok: true });
  }
  return typedjson({ ok: false });
}
