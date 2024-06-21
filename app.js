import "dotenv/config";
import bot from "@bot-whatsapp/bot";
import { getDay } from "date-fns";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/mock";

import chatgpt from "./services/openai/chatgpt.js";
import GoogleSheetService from "./services/sheets/index.js";

import agenteFlow from "./flows/agente.flow.js";
import despedidaFlow from "./flows/despedida.flow.js";
import registerFlow from "./flows/register.flow.js";
import registerAgenteFlow from "./flows/registerAgente.flow.js";
import reparacionFlow from "./flows/reparacion.flow.js";
import welcomeFlow from "./flows/welcome.flow.js";

const googelSheet = new GoogleSheetService(
  "15Ihwlc-6N-hMRctQV8vxR9P43UcVsJ9TTcGmdK8y6BM"
);


const GLOBAL_STATE = [];

/*** add Answer
 * const A = Obloigatorio: Un texto "hola", array ["hola", "como estás"]
 * const B = Opcional null: es un objeto {media, delay, capture, buttons}
 * const C = Opcional null: es una array de flujos
 * const D = Opcional = es una array de flujos hojos!
 */

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = bot.createFlow([
   agenteFlow, despedidaFlow, registerFlow, registerAgenteFlow, reparacionFlow, welcomeFlow
  ]);
  const adapterProvider = bot.createProvider(BaileysProvider);

  bot.createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();