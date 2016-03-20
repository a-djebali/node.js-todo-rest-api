/*var argv = require('yargs')
    .command('hello', 'Greets the user', function (yargs) {
      yargs.options({
        name: {
          demand: true,
          alias: 'n',
          description: 'Your fisr name goes here!'  
        }
      }).help('help');
    })
    .help('help')
    .argv;*/

var argv = require('yargs')
    .command('hello', 'Greets the user', function (yargs){
      yargs.options({
        name:{
          demand:true,
          alias: 'n',
          description: 'Your name goes here'
        },
        lastname:{
          demand:true,
          alias: 'l',
          description: 'Your lastname goes here'
        }
      }).help('help');
    })
    .help('help')
    .argv;    

var command = argv._[0]; 
if(command === 'hello' && typeof argv.name !== 'undefined' && typeof argv.lastname !== 'undefined')
  console.log('Hello '+argv.lastname+' '+argv.name+'!'); 
else if(command === 'hello' && typeof argv.name !== 'undefined')
  console.log('Hello '+argv.name+'!'); 
else if(command === 'hello')
  console.log('Hello World!'); 