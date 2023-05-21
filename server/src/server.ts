import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import 'dotenv/config'
import multipart from '@fastify/multipart'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'
const app = fastify()
app.register(multipart)
app.register(require('@fastify/static'), {
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads',
})
app.register(cors, {
    origin: true,
})
app.register(jwt, {
    secret: 'zegotinha',
})
app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)

app.listen({
    port: 3009,
    host: '0.0.0.0',
}).then((res) => {
    console.log('🎈 Servidor rodando na porta 3009')
})
