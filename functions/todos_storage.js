import {readFile, writeFile} from 'node:fs/promises'
import { NotFoundError } from './errors.js'


const path = "storage/todos.json"

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed
 */

/**
 * @return {Promise<Todo[]>}
 */
export async function getTodos () {
    const data = await readFile(path)
    return JSON.parse(data)
}


/**
 * @param {string} title
 * @param {boolean} completed
 * @return {Promise<Todo>}
 */
export async function createTodo({title, completed = false}) {
    const todo = {title, completed, id : Date.now()}
    const todos = [todo, ...await getTodos()]
    await writeFile(path, JSON.stringify(todos, null, 2))
    return todo
}


/**
 * @param {number} id
 * @return {Promise<Todo>}
 */
export async function removeTodo(id) {
    const todos = await getTodos()
    const todo = todos.findIndex((todo) => todo.id === id)
    if (todo === -1) {
        throw new NotFoundError()
    }
    await writeFile(path, JSON.stringify(todos.filter((todo) => todo.id !== id), null, 2))
}


/**
 * @param {number} id
 * @param {{completed ?: boolean, title ?: boolean}} partialTodo
 * @return {Promise<Todo>}
 */
export async function updateTodo(id, partialTodo) {
    const todos = await getTodos()
    const todo = todos.find((todo) => todo.id === id)
    if (todo === undefined) {
        throw new NotFoundError()
    }
    Object.assign(todo, partialTodo)
    await writeFile(path, JSON.stringify(todos, null, 2))
    return todo
}