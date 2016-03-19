console.log('Starting password manager'); 

var storage = require('node-persist');
storage.initSync();

function createAccount (account) {
  var accounts = storage.getItemSync('accounts');
  if(typeof accounts === 'undefined')
    accounts = [];
  accounts.push(account);
  storage.setItemSync('accounts',accounts);
  return account;
} 

function getAccount (username) {
  var accounts = storage.getItemSync('accounts');
  var matchedaccount;
  for (var i = 0; i < accounts.length; i++) {
    if(accounts[i].username === username)
      matchedaccount = accounts[i];
  }
  return matchedaccount;
}

/*var FacebookAccount = createAccount({
  name:'Facebook',
  username:'Ahmed189',
  password:'55255'
});*/

/*var accounts = storage.getItemSync('accounts');*/
console.log(getAccount('Ahmed189'));

