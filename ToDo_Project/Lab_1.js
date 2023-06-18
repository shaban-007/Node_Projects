const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
  .name('cli-Todo')
  .description('CLI to save Todo List')
  .version('1.0.0');

  program.command('add')
  .description('adds a new Task to the todo')
  .requiredOption('--title <string>', 'the title')
  .action((options) => {
    const { title: text} = options;
  
    const dbase = fs.readFileSync('db.json', 'utf-8');
    const parsed = JSON.parse(dbase);

    const lastId = parsed.length > 0 ? parsed[parsed.length - 1].id : 0;
    const newId = lastId + 1;

    const note = {
      title: text,
      id :newId,
      status: 'to-do',
  }
    parsed.push(note);
    const newFile = JSON.stringify(parsed, undefined, 2);
    fs.writeFileSync('db.json', newFile);
    console.log('Note is saved successfuly');
  });


  program
  .command('list')
  .option('--status <string>', 'the status', /^(to-do|in progress|done)$/i, 'none')
  .description('lists all Tasks')
  .action((options) => {
    const{status}=options;
    const dbase = fs.readFileSync('db.json', 'utf-8');
    const parsed = JSON.parse(dbase);

    console.log('All Tasks:');

    parsed.forEach((note) => {
      if(status==='none'|| status===note.status){
      console.log(`- Title: ${note.title}, ID: ${note.id}, Status: ${note.status}`);
    }
    });
  });

  program
  .command('edit')
  .description('edits an entry by ID')
  .option('--title <string>', 'the title','none')
  .requiredOption('--id <int>', 'the id')
  .option('--status <string>', 'the status', /^(to-do|in progress|done)$/i, 'none')
  .action((options) => {
    var { title,id,status} = options;
    const dbase = fs.readFileSync('db.json', 'utf-8');
    const parsed = JSON.parse(dbase);

    const entry = parsed.find((note) =>  note.id===parseInt(id) );

    if (!entry) {
      // console.log(entry)
      console.error('Entry not found.');
      return;
    }
    if(title==='none'){
      title = entry.title;
    }
    if(status==='none'){
      status = entry.status;
    }

    entry.title = title;
    entry.status = status;

    const newFile = JSON.stringify(parsed, undefined, 2);

    fs.writeFileSync('db.json', newFile);

    console.log(`edited `);
  });



  program
  .command('delete')
  .description('deletes an entry by ID')
  .requiredOption('--id <int>', 'the id')
  .action((options) => {

    const {id} = options;
    const dbase = fs.readFileSync('db.json', 'utf-8');
    const parsed = JSON.parse(dbase);

    const entryIndex = parsed.findIndex((note) => note.id === parseInt(id));

    if (entryIndex === -1) {
      console.error('Entry not found.');
      return;
    }
    let ids=entryIndex;
    parsed.splice(entryIndex, 1);
    for(let i=ids;i<parsed.length;i++){
      // console.log(parsed[i]);
      parsed[i].id = ++ids;
  }

    const newFile = JSON.stringify(parsed, undefined, 2);

    fs.writeFileSync('db.json', newFile);

    console.log(` deleted .`);
  });




  program.parse(process.argv);