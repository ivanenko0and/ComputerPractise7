
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
  
const userScheme = new Schema({
    name: String,
    phone: String
});
  

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });
  
const User = mongoose.model("telegram_users", userScheme);


bot.command('write', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, `Can we get access to your contacts?`, requestContacts)

})

const requestContacts = {
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [
            [{
                text: "My contacts",
                request_contact: true,
                one_time_keyboard: true
            }],
            ["Cancel"]
        ]
    }
};


bot.command('read', ctx => {

    User.find({}, function(err, results){
         
        if(err) return console.log(err);

        var str = "Entered data:\n";
        results.forEach(element => str += `\nname: ` + element.name + `;   phone: ` + element.phone);
        bot.telegram.sendMessage(ctx.chat.id, str)

        console.log(results);
    });

})


bot.on("contact",(ctx)=>{

    let user = new User({
        name: ctx.message.contact.first_name + " " + ctx.message.contact.last_name,
        phone: ctx.message.contact.phone_number
    });


    user.save(function(err){
          
        if(err) return console.log(err);
        console.log("Сохранен объект", user);
    });

})


bot.launch();

