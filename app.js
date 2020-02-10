require('dotenv').config();
const http = require('http');
const commandParts = require('telegraf-command-parts');
const firestore = require('./firestore');
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;


//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Fuck World\n');

});

var welcome = ctx => ctx.reply('Welcome!')

var write = (ctx) => firestore.write(ctx.message.from, ctx.message.text)

var last = (ctx) => {
  firestore.last(doc => {
      console.log(`last: ${JSON.stringify(doc.story.id)} ${JSON.stringify(doc.text)}`)
      ctx.reply(doc.text)
  })
}

var read = (ctx) => {
  
  firestore.read(arr => {
    ctx.reply(arr.join('\n'))
  })

}

var story = (ctx) => {

  let storyName = ctx.state.command.args
  if(storyName == '') {
    ctx.reply(`enter story name`)
  
  } else {
    created = firestore.setStory(storyName, created => {
      if(created) {
        ctx.reply(`story "${storyName}" created`)
      } else {
        ctx.reply(`you joined "${storyName}" story`)
      }
    });
  }
}

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {

  console.log(`Server running at http://${hostname}:${port}/`);
  
  const Telegraf = require('telegraf')
  const bot = new Telegraf(process.env.BOT_TOKEN)
  bot.use(commandParts());
  
  // firestore.init();
  
  bot.start(welcome)

  bot.command('story', story)
  bot.command('read', read)
  bot.command('last', last)
  bot.on('text', write)
  
  bot.launch()

});