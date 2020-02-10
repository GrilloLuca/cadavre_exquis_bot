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
  res.end('Hello World\n');

});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {

  console.log(`Server running at http://${hostname}:${port}/`);
  
  const Telegraf = require('telegraf')
  const bot = new Telegraf(process.env.BOT_TOKEN)
  bot.use(commandParts());
  
  firestore.init();
  
  bot.start((ctx) => {

    ctx.reply('Welcome!');

  })

  bot.command('story', (ctx) => {

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
  })
  
  bot.command('read', ctx => {

    let arr = []
    let story_ref = firestore.read(ctx.message.from, snapshot => 
      snapshot.forEach(doc => 
        arr.push(doc.data().text)
    ));

    story_ref.get().then(doc => {
      ctx.reply(`
        [ ${doc.data().name} ]\n------------------------ \n${arr.join('\n')}`)
    })
  })

  bot.command('last', ctx => {

    firestore.last(doc => {
        
      firestore.story_id = doc.story.id
        console.log(JSON.stringify(doc.story.id))
        ctx.reply(doc.text)

    })
    
  });

  bot.on('text', ctx => {

    firestore.write(ctx.message.from, ctx.message.text)

  })
  
  bot.launch()

});