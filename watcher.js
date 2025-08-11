import {exec, spawn} from 'node:child_process'
import { watch } from 'node:fs/promises'

const [node, _, file] = process.argv

// Using *exec*

/* exec('dir', (error, out, err) => {
    console.log({
        error,
        out,
        err
    })
}) */

// console.log(process.argv)


// Using *spawn*

/* const pr = spawn('dir', [], {
    shell : true
})

pr.stdout.on('data', (data) => {
    console.log(data.toString('utf-8'))
})

pr.stderr.on('data', (data) => {
    console.error(data.toString('utf-8'))
})

pr.on('close', (code) => {
    console.log('Process exited : ' + code)
}) */


function spawnNode () {

    const pr = spawn(node, [file])

    pr.stdout.on('data', (data) => {
        console.log(data.toString('utf-8'))
    })

    pr.stderr.on('data', (data) => {
        console.error(data.toString('utf-8'))
    })

    /* pr.stdout.pipe(process.stdout)
    pr.stderr.pipe(process.stderr) */

    pr.on('close', (code) => {

        if (code > 0) {
            throw new Error('Process exited : ' + code)
        }

        // console.log('Process exited : ' + code)

        /* if (code !== null) {
            process.exit(code)
        } */

    })

    return pr

}


const watcher = watch('./', {
    recursive : true
})

let childNodeProcess = spawnNode()

for await (const event of watcher) {
    if (event.filename.endsWith('.js')) {
        childNodeProcess.kill()
        // childNodeProcess.kill('SIGKILL')
        childNodeProcess = spawnNode()
    }
}