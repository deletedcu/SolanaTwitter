export * from "./toCapitalize";
export * from "./useWorkspace";
export * from "./useSlug";
export * from "./useCountCharacterLimit";
export * from "./notify";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
