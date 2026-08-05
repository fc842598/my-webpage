import { articles as writer1 } from "./daily-ziwei-2026-08-05-parts/writer-1.mjs";
import { articles as writer2 } from "./daily-ziwei-2026-08-05-parts/writer-2.mjs";
import { articles as writer3 } from "./daily-ziwei-2026-08-05-parts/writer-3.mjs";
import { articles as writer4 } from "./daily-ziwei-2026-08-05-parts/writer-4.mjs";
import { articles as writer5 } from "./daily-ziwei-2026-08-05-parts/writer-5.mjs";

export const articles = [...writer1, ...writer2, ...writer3, ...writer4, ...writer5]
  .sort((left, right) => left.order - right.order);
