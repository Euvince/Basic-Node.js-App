import { createTodo, getTodos, removeTodo, updateTodo } from "../todos_storage.js";
import { json } from 'node:stream/consumers'


export async function index (request, response) {
    const todos = await getTodos()
    return todos
}

export async function create (request, response) {
    const todo = await createTodo(await json(request))
    return todo
}

export async function remove (request, response, url) {
    const id = parseInt(url.searchParams.get('id'),10)
    await removeTodo(id)
    response.writeHead(204)
}

export async function update (request, response, url) {
    const id = parseInt(url.searchParams.get('id'),10)
    const todo = await updateTodo(id, await json(request))
    return todo
}