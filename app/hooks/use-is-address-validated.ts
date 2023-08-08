export async function useIsAddressValidated(address: string): Promise<boolean> {
  const response = await fetch(`${window.ENV.TREASURY_URL}/validate/${address}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.valid;
}
