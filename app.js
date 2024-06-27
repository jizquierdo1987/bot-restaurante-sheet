import "dotenv/config";
import bot from "@bot-whatsapp/bot";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/mock";
//import chatgpt from "./services/openai/chatgpt.js";
//import GoogleSheetService from "./services/sheets/index.js";

import agenteFlow from "./flows/agente.js";
import despedidaFlow from "./flows/despedida.js";
import welcomeFlow from "./flows/welcome.js";
import reparacionFlow from "./flows/reparacion.js";
import registerFlow from "./flows/register.js";
import registerAgenteFlow from "./flows/registerAgente.js";


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = bot.createFlow([welcomeFlow,despedidaFlow,agenteFlow,registerAgenteFlow,registerFlow, reparacionFlow]);
  const adapterProvider = bot.createProvider(BaileysProvider);

  bot.createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();