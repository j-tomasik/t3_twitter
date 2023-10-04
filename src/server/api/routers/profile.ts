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
            });
            if (profile == null) return 

            return {
                name: profile.name,
                image: profile.image,
                followersCount: profile._count.followers,
                followsCount: profile._count.follows,
                tweetCount: profile._count.tweets,
                isFollowing: profile.followers.length > 0
            }

        }),
    toggleFollow: protectedProcedure.input(z.object({ userId: z.string()})).
        mutation(async ({input: {userId}, ctx}) => {
            const currentUserId = ctx.session.user.id

            const existingFollow = await ctx.db.user.findFirst({ 
                where: { id: userId, followers: { some: {id: currentUserId}}},
            });

            if(existingFollow == null) {
                await ctx.db.user.update({
                    where : {id: userId},
                    data: {followers : {connect: {id: currentUserId}}}
                })
            }
        }),
});
