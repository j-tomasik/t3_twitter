import { z } from "zod";
import { Prisma } from "@prisma/client";

import {
  createTRPCContext,
  createTRPCRouter, 
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { inferAsyncReturnType } from "@trpc/server";

export const profileRouter = createTRPCRouter({
    getById: publicProcedure.input()
})
