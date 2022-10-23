import {promises} from 'fs';
import { FileHandle } from 'fs/promises';
import inquirer from 'inquirer';
const writeFile = promises.writeFile;
const appendFile = promises.appendFile;
const openFile = promises.open;
const readFile = promises.readFile;

async function appendNotes(note: string) {
    try {
        await appendFile("notes.txt", `${note}\n`)
    } catch (err) {
        throw err
    }
}

async function readNotes(file: FileHandle) {
    try {
        const notes = await readFile(file, {encoding: 'utf-8'});
        return notes;
    } catch (err) {
       throw err
       
    }
}

async function run() {
    if (process.argv[2] === "show") {
        try {
            const file = await openFile("notes.txt", "a+");
            const contents = await readNotes(file);
            const notes = contents!.split("\n");
            if (notes.length === 1 && notes[0].length === 0){
                console.log("there are no items in your todos list yet!");
            } else {
                notes.forEach(
                    (v, i, arr) => {
                        if (i === arr.length - 1) {
                            console.log("------")
                        }else {
                            console.log(`[${i}]: ${v}`);
                        }
                    }
                )
            }
        } catch (err) {
            console.error(err)
        }
            
    } else if (process.argv[2] === "write"){
        inquirer.prompt(
            {
                type: "input",
                name: "item",
                message: "Enter your todo item",
            }
        ).then(
            (a) => {
              appendNotes(a.item);  
            }
        )
    } else if (process.argv[2] === "remove") {
        try {
            const file = await openFile("notes.txt", "a+");
            const contents = await readNotes(file);
            const notes = contents!.split("\n");
            if (notes.length === 1 && notes[0].length === 0){
                console.log("there are no items in your todos list yet!");
            } else {
                inquirer.prompt(
                    [
                        {
                            type: "list",
                            name: "item_rem",
                            message: "Which item to remove",
                            choices: notes,
                        }
                    ]
                ).then((a) =>{
                    let new_list: string[];
                   notes.forEach((v, i, arr) => {
                    if (v === a.item_rem) {
                        new_list = arr.slice(0,i).concat(arr.slice(i+1))
                    }
                   }) 
                   const new_notes = new_list!.join("\n");
                   writeFile("notes.txt", new_notes, {
                    encoding: "utf-8"
                   });
                } )
            }
        } catch (err) {
            console.error(err)
        }
            
    } else {
        console.log(
            ' Available options are:\n show -- outputs todos list\n write -- add todo item to the list\n remove -- remove item from list by given index'
        )
    }

}


run().catch(e => console.error(e))