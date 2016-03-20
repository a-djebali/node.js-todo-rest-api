//Database (file)
var storage = require('node-persist');
storage.initSync();

//Commands
var argv = require('yargs')
    .command('create', 'creats an account', function (yargs) {
      yargs.options({
        name:{
          demand: true,
          alias:'n',
          description: 'account name goes here',
          type:'string'
        },
        username:{
          demand: true,
          alias:'u',
          description: 'username goes here',
          type:'string'
        },
        password:{
          demand: true,
          alias:'p',
          description: 'password goes here',
          type:'string'
        }
      }).help('help')
    })
    .help('help')
    .command('get', 'check account existance', function (yargs) {
      yargs.options({
        username:{
          demand: true,
          alias: 'u',
          description: 'username goes here',
          type: 'string'
        }
      }).help('help')
    })
    .help('help')
    .argv;

//
var command = argv._[0];

//Create account 
function createAccount (account) {
  var accounts = storage.getItemSync('accounts');
  if(typeof accounts === 'undefined')
    accounts = [];
  accounts.push(account);
  storage.setItemSync('accounts',accounts);
  return account;
} 


//Gte existing account 
function getAccount (username) {
  var accounts = storage.getItemSync('accounts');
  var matchedaccount;
  for (var i = 0; i < accounts.length; i++) {
    if(accounts[i].username === username)
      matchedaccount = accounts[i];
  }
  return matchedaccount;
}
if(command === 'create' && argv.name !== 'undefined' && argv.username !== 'undefined' && argv.password !== 'undefined'){
  createAccount({
    name: argv.name,
    username:argv.username,
    password:argv.password
  });
  console.log('Account created');
}
else if(command === 'get' && argv.username !== 'undefined')
  console.log(getAccount(argv.username));


