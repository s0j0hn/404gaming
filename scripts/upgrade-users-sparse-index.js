// Set the Node ENV
process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const mongoose = require('../config/lib/mongoose');

mongoose.loadModels();

const indexToRemove = 'email_1';
const errors = [];
// const processedCount = 0;

function reportAndExit(message) {
  if (errors.length) {
    console.log(chalk.red(message));
    console.log();

    console.log(chalk.yellow('Errors:'));
    for (let i = 0; i < errors.length; i++) {
      console.log(chalk.red(errors[i]));

      if (i === (errors.length - 1)) {
        process.exit(0);
      }
    }
  } else {
    console.log(chalk.green(message));
    console.log(chalk.green(`${'The next time your application starts, ' +
    'Mongoose will rebuild the index "'}${indexToRemove}".`));
    process.exit(0);
  }
}


mongoose.connect((db) => {
  // get a reference to the User collection
  const userCollection = db.connections[0].collections.users;

  console.log();
  console.log(chalk.yellow(`Removing index "${
    indexToRemove}" from the User collection.`));
  console.log();

  // Remove the index
  userCollection.dropIndex(indexToRemove, (err) => {
    let message = `Successfully removed the index "${indexToRemove}".`;

    if (err) {
      errors.push(err);
      message = `An error occured while removing the index "${indexToRemove}".`;

      if (err.message.indexOf('index not found with name') !== -1) {
        message = `Index "${indexToRemove}" could not be found.` +
          '\r\nPlease double check the index name in your ' +
          'mongodb User collection.';
      }

      reportAndExit(message);
    } else {
      reportAndExit(message);
    }
  });
});
