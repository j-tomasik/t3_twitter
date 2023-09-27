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
    getById: publicProcedure.input(z.object({ id: z.string()})).query(async ({
        input: {id}, ctx}) => {
            const currentUserId = ctx.session?.user.id
            const profile = await ctx.db.user.findUnique({ 
                where: {id}, 
                select: 
                    {name: true, 
                    image: true, 
                    _count : {select: { followers: true, follows: true, tweets: true}},
                    followers: 
                    currentUserId == null 
                    ? undefined 
                    : {where: {id: currentUserId}},
                }, 
            })
        })
})
