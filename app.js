import {createServer} from 'node:http'
import { createTodo, getTodos } from './functions/todos_storage.js'
import { json } from 'node:stream/consumers'
import { create, index, remove, update } from './functions/api/todos.js'
import { NotFoundError } from './functions/errors.js'
import { createReadStream } from 'node:fs'


// console.log("Bonjour à tous !")

createServer(async (request, response) => {

    try {
        response.setHeader('Content-Type', 'application/json')

        const url = new URL(request.url, `http://${request.headers.host}`)

        const endpoint = `${request.method}:${url.pathname}`

        let results

        switch (endpoint) {
            /* case "GET:/" :
                response.setHeader('Content-Type','text/html')
                createReadStream('index.html').pipe(response)
                return */
            case "GET:/todos" :
                results = await index(request, response)
            break
            case "POST:/todos" :
                results = await create(request, response)
            break
            case "DELETE:/todos" :
                results = await remove(request, response, url)
            break
            case "PUT:/todos" :
                results = await update(request, response, url)
            break
            default :
                response.writeHead(404)
                response.write("Page introuvable !")
        }

        if (results) {
            response.write(JSON.stringify(results))
        }
    } catch (e) {
        if (e instanceof NotFoundError) {
            response.writeHead(404)
            response.write("Page introuvable !")
        }
        else {
            throw e
        }
    }

    /* if (url.pathname === '/todos') {
        if (request.method === 'GET') {
            const todos = await getTodos()
            response.write(JSON.stringify(todos))
        }
        else if (request.method === 'POST') {
            const newTodo = await createTodo(await json(request))
            response.write(JSON.stringify(newTodo))
        }
    }
    else {
        response.writeHead(404)
        response.write("Page introuvable !")
    } */

    response.end()

}).listen('8000')