const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const token = '7571158884:AAGPyYz6-PZRe0TrQ94lWu1jtuN6Cr604kY';
const webAppUrl= 'https://gamemakesite.netlify.app'

const bot = new TelegramBot(token, {polling: true});
const app = express();
const userState = {};

// const connectDB = async () => {
//
//     mongoose.connection.on(`connected`,() =>{
//         console.log('MongoDB Connected');
//     })
//
//     await mongoose.connect(`mongodb://127.0.0.1:27017`)  ;
//
// }
// connectDB()


// async function getClient() {
//     const username = "admin"; // Логин администратора
//     const password = "t3mSJUb*"; // Пароль администратора
//     const host = "nestopquusstog.beget.app"; // Адрес сервера / доменное имя
//     const database = "admin"; // Имя БД
//
//     const uri = `mongodb://${username}:${password}@${host}/${database}`;
//
//     const client = new MongoClient(uri);
//
//     try {
//         // Подключаемся к серверу
//         await client.connect();
//         console.log("Подключение успешно!");
//         return client;
//     } catch (err) {
//         console.error("Ошибка подключения:", err);
//         process.exit(1);
//     }
// }
//
// // Для запуска функции
// (async () => {
//     const client = await getClient();
// })();

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
    // if(msg?.web_app_data?.data){
    //     try {
    //         const data = JSON.parse(msg?.web_app_data?.data)
    //
    //         await bot.sendMessage(chatId, "Спасибо за обратную связь");
    //         await bot.sendMessage(chatId, "Ваша страна: " + data?.country);
    //         await bot.sendMessage(chatId, "Ваша улица: " + data?.street);
    //
    //         setTimeout(async ()=>{
    //             await bot.sendMessage("Всю информацию вы получите в этом чате");
    //         }, 3000)
    //     }
    //     catch(error){
    //         console.log(error);
    //     }
    // }
    // if (msg.text === '/start') {
    //     userState[chatId] = { stage: 'waiting_for_budget' };
    //     bot.sendMessage(chatId, 'Привет! Введите ваш бюджет для сборки ПК (в рублях)');
    //     console.log('Состояние пользователя после /start:', userState);
    //     return;
    // }
    // if (userState[chatId] && userState[chatId].stage === 'waiting_for_budget') {
    //     const budget = parseInt(msg.text, 10);
    //     console.log('Проверяем бюджет:', msg.text);
    //
    //     if (isNaN(budget) || budget <= 0) {
    //         bot.sendMessage(chatId, 'Пожалуйста, введите корректный бюджет в рублях.');
    //         return;
    //     }
    //     // Сохраняем бюджет пользователя
    //     userState[chatId].budget = budget;
    //     userState[chatId].stage = 'searching_components';
    //
    //     // Поиск комплектующих
    //     try {
    //         const components = await findComponentsWithinBudget(budget);
    //         if (components.length > 0) {
    //             let response = 'Вот комплектующие, которые подходят под ваш бюджет:\n\n';
    //             components.forEach((component) => {
    //                 response += `${component.category}: ${component.name} - ${component.price} руб.\n`;
    //             });
    //              bot.sendMessage(chatId, response);
    //         } else {
    //             bot.sendMessage(chatId, 'К сожалению, не удалось найти комплектующие для вашего бюджета.');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         bot.sendMessage(chatId, 'Произошла ошибка при поиске комплектующих. Попробуйте позже.');
    //     }
    //
    //     // Сброс состояния пользователя
    //     delete userState[chatId];
    // }
});

const pcBuilds = {
    30000: {
        cpu: "AMD Ryzen 3 3200G " +
            "https://www.dns-shop.ru/product/588277aa3347ed20/processor-amd-ryzen-3-3200g-oem/?utm_referrer=https%3A%2F%2Fwww.dns-shop.ru%2Fcatalog%2F17a899cd16404e77%2Fprocessory%2F%3Fq%3Dryzen%2B3%2B3200g%26stock%3Dnow-today-tomorrow-later-out_of_stock%26order%3D6",
        cpu_cooler: "DEEPCOOL GAMMA ARCHER " +
            "https://www.dns-shop.ru/product/376bac04499230b1/kuler-dla-processora-deepcool-gamma-archer-dp-mcal-ga/",
        gpu: "Интегрированная Vega 8 Graphics",
        ram: "Kingston FURY Beast Black 8GB DDR4 3000MHz " +
            "https://www.dns-shop.ru/product/bb6fb3a7fad5ed20/operativnaa-pamat-kingston-fury-beast-black-kf432c16bbk216-16-gb/",
        storage: "Kingston A400 SSD 240GB " +
            "https://www.dns-shop.ru/product/d870c9c7e7a0ed20/240-gb-25-sata-nakopitel-kingston-a400-sa400s37240g/",
        psu: "DEEPCOOL PF450 " +
            "https://www.dns-shop.ru/product/10c2d18bfa5ad763/blok-pitania-deepcool-pf450-r-pf450d-ha0b-eu-cernyj/",
        motherboard: "MSI A520M-A PRO " +
            "https://www.dns-shop.ru/product/13bf2d4ecbcf3332/materinskaa-plata-msi-a520m-a-pro/",
        case: "DEXP DCV-200W " +
            "https://www.dns-shop.ru/product/26ca3df3aa70ed20/korpus-dexp-dcv-200w--belyj/",
    },
    55000: {
        cpu: "Intel Core i5-11400F " +
            "https://www.dns-shop.ru/product/64bfbe9ffcc6ed20/processor-intel-core-i5-11400f-oem/",
        cpu_cooler: "Deepcool AK400 Performance",
        gpu: "KFA2 GeForce GTX 1650 X Black " +
            "https://www.dns-shop.ru/product/30bd04fb7f63ed20/videokarta-kfa2-geforce-gtx-1650-x-black-65sql8ds93ek/",
        ram: "16GB DDR4 3200MHz Kingston FURY Beast Black, " +
            "https://www.dns-shop.ru/product/bb6fb3a7fad5ed20/operativnaa-pamat-kingston-fury-beast-black-kf432c16bbk216-16-gb/",
        storage: "ARDOR GAMING Ally AL1284 " +
            "https://www.dns-shop.ru/product/c3128ae1c2d7ed20/512-gb-m2-nvme-nakopitel-ardor-gaming-ally-al1284-almaym1024-al1284/",
        psu: "MONTECH BETA 550 " +
            "https://www.dns-shop.ru/product/18bd6e4b3bb5ed20/blok-pitania-montech-beta-550-beta-550-cernyj/",
        motherboard: "GIGABYTE Z690I AORUS ULTRA " +
            "https://www.dns-shop.ru/product/e00c2f017cc3ed20/materinskaa-plata-gigabyte-z690i-aorus-ultra/",
        case: "ARDOR GAMING Rare MM1 черный " +
            "https://www.dns-shop.ru/product/b8740dbb77b4ed20/korpus-ardor-gaming-rare-mm1--cernyj/",
    },
    120000:{
        cpu: "AMD Ryzen 5 7600x " +
            "https://www.dns-shop.ru/product/5825b93b38afed20/processor-amd-ryzen-5-7600x-oem/",
        cpu_cooler: "Deepcool AK400 Performance",
        gpu: "MSI Radeon RX 6700 XT Mech 12GB " +
            "https://www.dns-shop.ru/product/219911078211d760/videokarta-msi-amd-radeon-rx-6700-xt-mech-2x-rx-6700-xt-mech-2x-12g/",
        ram: "32GB (2x16GB) DDR5 6000MHz Kingston FURY Beast " +
            "https://www.dns-shop.ru/product/9855ff3b3957ed20/operativnaa-pamat-kingston-fury-beast-black-kf560c36bbek2-32-32-gb/",
        storage: "Samsung 980 1TB NVMe SSD " +
            "https://www.dns-shop.ru/product/e5bc121a1873ed20/1000-gb-m2-nvme-nakopitel-samsung-980-pro-mz-v8p1t0bw/",
        psu: "Deepcool PQ850M 850W 80+ Gold " +
            "https://www.dns-shop.ru/product/87a4a785fa44d763/blok-pitania-deepcool-pq850m-r-pq850m-fa0b-eu-cernyj/",
        motherboard: "ASUS PRIME B650-PLUS " +
            "https://www.dns-shop.ru/product/6e50102163deed20/materinskaa-plata-asus-prime-b650-plus/",
        case: "Cougar Duoface Pro RGB White белый " +
            "https://www.dns-shop.ru/product/e1325f527f62ed20/korpus-cougar-duoface-pro-rgb-white--belyj/"
    }
};

function suggestPcBuild(budget) {
    if (!pcBuilds[budget]) {
        return "К сожалению, у нас нет сборки для заданного бюджета. Доступные бюджеты: 30000 руб, 55000 руб.";
    }

    const build = pcBuilds[budget];
    return `
    Сборка ПК за ${budget} руб:
    - Процессор: ${build.cpu}
    - Видеокарта: ${build.gpu}
    - Оперативная память: ${build.ram}
    - Накопитель: ${build.storage}
    - Блок питания: ${build.psu}
    - Материнская плата: ${build.motherboard}
    - Корпус: ${build.case}
  `;
}

// Функция для обработки сообщений от бота
bot.onText(/\/pcbuild_(\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const budget = parseInt(match[1], 10); // Извлекаем бюджет из команды
    const response = suggestPcBuild(budget);
    bot.sendMessage(chatId, response,{
        reply_markup:{
            inline_keyboard: [
                [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
            ]
        }
    });
});


// // Функция для поиска комплектующих в базе данных
// async function findComponentsWithinBudget(budget) {
//
//     const categories = ['Процессор', 'Видеокарта', 'Материнская плата', 'Оперативная память', 'Блок питания', 'Корпус'];
//     const components = [];
//
//     for (const category of categories) {
//         const component = await Component.findOne({ category, price: { $lte: budget } }).sort({ price: -1 });
//         if (component) {
//             components.push(component);
//             budget -= component.price; // Уменьшаем оставшийся бюджет
//         }
//     }
//
//     return components;
// }

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 4000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));