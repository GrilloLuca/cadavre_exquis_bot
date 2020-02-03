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
  res.end('Hello World\n');

});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {

  console.log(`Server running at http://${hostname}:${port}/`);
  
  const Telegraf = require('telegraf')
  const bot = new Telegraf(process.env.BOT_TOKEN)
  bot.use(commandParts());
  
  firestore.init();
  
  bot.start((ctx) => ctx.reply('Welcome!'))

  bot.command('channel', (ctx) => {

    let channelName = ctx.state.command.args
    if(channelName == '') {
      ctx.reply(`enter channel name`)
    
    } else {
      created = firestore.setChannel(channelName, created => {
        if(created) {
          ctx.reply(`channel "${channelName}" created`)
        } else {
          ctx.reply(`you joined "${channelName}" channel`)
        }
      });
    }
  })
  
  bot.command('read', ctx => {

    ctx.reply(`reading channel ${firestore.channel}`)
    firestore.read(snapshot => {
      
      var str = []
      snapshot.forEach((doc) => {
        str.push(doc.data().text)
      })

      ctx.reply(str.join('\n'))

    });

  });

  bot.on('text', ctx => {

    firestore.write(ctx.message.from.id, ctx.message.text)

  })
  
  bot.launch()

});