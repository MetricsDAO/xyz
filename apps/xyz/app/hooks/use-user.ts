import type { User } from "database";
import { useRouteData } from "remix-utils";

function isUser(user: any): user is User {
  return user && typeof user.address === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useRouteData<{ user: User | undefined }>("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}
