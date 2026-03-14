import { protectedProcedure, router } from "./_core/trpc";
import { checkReportLimits } from "./reportLimits";

export const checkLimitsRouter = router({
  reportLimits: protectedProcedure.query(async ({ ctx }) => {
    return await checkReportLimits(ctx.user.id);
  }),
});

