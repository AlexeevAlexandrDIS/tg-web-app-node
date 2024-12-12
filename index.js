const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");


const token = '7571158884:AAGPyYz6-PZRe0TrQ94lWu1jtuN6Cr604kY';
const webAppUrl= 'https://6874069850b04e.lhr.life'

const bot = new TelegramBot(token, {polling: true});
const app = express();
const userState = {};

const connectDB = async () => {

    mongoose.connection.on(`connected`,() =>{
        console.log('MongoDB Connected');
    })

    await mongoose.connect(`mongodb://127.0.0.1:27017`)  ;

}
connectDB()

app.use(express.json());
app.use(cors());

const Component = mongoose.model('Component', new mongoose.Schema({
    category: String,
    name: String,
    price: Number
}));

// async function seedData() {
//     await Component.insertMany([
//         { category: "Процессор", name: "AMD Ryzen 3 1200X", price: 5000 },
//         { category: "Видеокарта", name: "NVIDIA GTX 1060", price: 10000 },
//         { category: "Материнская плата", name: "ASUS B450", price: 5000 },
//         { category: "Оперативная память", name: "Corsair 8GB", price: 3000 },
//         { category: "Блок питания", name: "Cooler Master 550W", price: 4000 },
//         { category: "Корпус", name: "ARDOR XXXX", price: 3000 }
//     ]);
//     console.log("Данные успешно добавлены!");
//     mongoose.disconnect();
// }
//
// seedData();


bot.on('message', async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    console.log('Получено сообщение:', msg.text);

    if(text === '/start'){
        await bot.sendMessage(chatId, "Ниже появится кнопка, заполните форму",{
            reply_markup:{
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl  + '/form'}}]
                ]
            }
        });
        await bot.sendMessage(chatId, "Заходи в наш интернет магазин по кнопке ниже",{
            reply_markup:{
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        });
    }
    if(msg?.web_app_data?.data){
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            await bot.sendMessage(chatId, "Спасибо за обратную связь");
            await bot.sendMessage(chatId, "Ваша страна: " + data?.country);
            await bot.sendMessage(chatId, "Ваша улица: " + data?.street);

            setTimeout(async ()=>{
                await bot.sendMessage("Всю информацию вы получите в этом чате");
            }, 3000)
        }
        catch(error){
            console.log(error);
        }
    }
    if (msg.text === '/start') {
        userState[chatId] = { stage: 'waiting_for_budget' };
        bot.sendMessage(chatId, 'Привет! Введите ваш бюджет для сборки ПК (в рублях)');
        console.log('Состояние пользователя после /start:', userState);
        return;
    }
    if (userState[chatId] && userState[chatId].stage === 'waiting_for_budget') {
        const budget = parseInt(msg.text, 10);
        console.log('Проверяем бюджет:', msg.text);

        if (isNaN(budget) || budget <= 0) {
            bot.sendMessage(chatId, 'Пожалуйста, введите корректный бюджет в рублях.');
            return;
        }
        // Сохраняем бюджет пользователя
        userState[chatId].budget = budget;
        userState[chatId].stage = 'searching_components';

        // Поиск комплектующих
        try {
            const components = await findComponentsWithinBudget(budget);
            if (components.length > 0) {
                let response = 'Вот комплектующие, которые подходят под ваш бюджет:\n\n';
                components.forEach((component) => {
                    response += `${component.category}: ${component.name} - ${component.price} руб.\n`;
                });
                 bot.sendMessage(chatId, response);
            } else {
                bot.sendMessage(chatId, 'К сожалению, не удалось найти комплектующие для вашего бюджета.');
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'Произошла ошибка при поиске комплектующих. Попробуйте позже.');
        }

        // Сброс состояния пользователя
        delete userState[chatId];
    }
});

// Функция для поиска комплектующих в базе данных
async function findComponentsWithinBudget(budget) {

    const categories = ['Процессор', 'Видеокарта', 'Материнская плата', 'Оперативная память', 'Блок питания', 'Корпус'];
    const components = [];

    for (const category of categories) {
        const component = await Component.findOne({ category, price: { $lte: budget } }).sort({ price: -1 });
        if (component) {
            components.push(component);
            budget -= component.price; // Уменьшаем оставшийся бюджет
        }
    }

    return components;
}

app.post('/web-data', async(req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try{
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `Поздравляю с покупкой вы приобрели товар на сумму ${totalPrice},
                ${products.map(item => item.title).join(', ')}`
                }
        })
        return res.status(200).json({})
    }
    catch(error){

        return res.status(500).json({})

    }
})

const PORT = 4000;

app.listen(PORT, () => console.log(`
            }Listening on port ${PORT}`));