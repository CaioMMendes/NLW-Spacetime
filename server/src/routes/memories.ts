import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
export async function memoriesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.get('/memories', async (request) => {
        await request.jwtVerify()

        const memories = await prisma.memory.findMany({
            where: { userId: request.user.sub },
            orderBy: {
                createdAt: 'asc',
            },
        })
        return memories.map((memory) => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat('...'),
                createdAt: memory.createdAt,
            }
        })
    })
    app.get('/memories/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })
        const { id } = paramsSchema.parse(request.params)
        const memory = await prisma.memory.findUniqueOrThrow({
            where: { id },
        })
        if (memory) {
            if (!memory.isPublic && memory.userId !== request.user.sub) {
                return reply.status(401).send()
            }
            return memory
        }
        return reply.status(404).send()
    })
    app.post('/memories', async (request) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
            date: z.string().datetime(),
            // coerce converte o valor para boolear por exemplo Boolean(valor)
        })
        const { content, coverUrl, isPublic, date } = bodySchema.parse(
            request.body
        )
        console.log(date)
        try {
            const memory = await prisma.memory.create({
                data: {
                    content,
                    coverUrl,
                    isPublic,
                    userId: request.user.sub,
                    createdAt: date,
                },
            })
            return memory
        } catch (error) {
            console.log(error)
        }
    })
    app.put('/memories/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })
        const { id } = paramsSchema.parse(request.params)
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
            date: z.string().datetime(),
            // coerce converte o valor para boolear por exemplo Boolean(valor)
        })
        const { content, coverUrl, isPublic, date } = bodySchema.parse(
            request.body
        )

        let memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            },
        })
        if (memory.userId !== request.user.sub) {
            return reply.status(401).send()
        }

        memory = await prisma.memory.update({
            where: {
                id,
            },
            data: {
                content,
                coverUrl,
                isPublic,
                createdAt: date,
            },
        })
        return memory
    })

    app.delete('/memories/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })
        const { id } = paramsSchema.parse(request.params)
        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            },
        })
        if (memory.userId !== request.user.sub) {
            return reply.status(401).send()
        }
        await prisma.memory.delete({
            where: { id },
        })
    })
}
