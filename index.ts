import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'

import queueRoute from '@/routes/queue'

const app = new Hono()

app.use('/', cors())

app.use(logger())
app.use(poweredBy())

app.get('/', (c) => { return c.text('Hello Hono!') })
app.get('/health', (c) => { return c.text('OK') })
app.get('/metrics', (c) => { return c.text('metrics') })

app.route('/queue', queueRoute);

export default app