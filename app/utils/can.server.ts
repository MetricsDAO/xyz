import type { User } from "@prisma/client";
import { forbidden } from "remix-utils";

type CanObject = User; // | LaborMarket
type CanAction = "read" | "write" | "delete" | "execute";

/**
 * Determines if a user can take action on a resource
 * @param user
 * @param action - "read", "write", "delete", "execute"
 * @param obj - a query, dashboard, visualization, or collection
 * @returns null if the user can take the action, otherwise throws a 403 error
 */
export function can(user: User, action: CanAction, obj: CanObject) {
  const result = evaluate(user, action, obj);
  if (!result) throw forbidden("You don't have access for this.");
}

/**
 * Determines if a user can take action on a resource
 * @param user
 * @param action - "read", "write", "delete", "execute"
 * @param obj - a query, dashboard, visualization, or collection
 * @returns returns true if the user can take the action, otherwise false
 */
export function canSafe(user: User, action: CanAction, obj: CanObject) {
  return evaluate(user, action, obj);
}

function evaluate(user: User, action: CanAction, obj: CanObject) {
  if (action === "read") return true;
  // if (obj.createdById === user.id) return true;
  // if ("organizationId" in obj && obj.organizationId === user.organizationId) return true;

  // future -- check for teams or roles, get granular on certain types of objects, etc

  return false;
}
