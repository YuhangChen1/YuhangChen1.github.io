import type { ComponentType } from "react";

import VlaAspace from "./vla-aspace";

// Every slug in src/data/blog.ts needs a body here.
export const postBodies: Record<string, ComponentType> = {
  "vla-aspace": VlaAspace,
};
