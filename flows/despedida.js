//const {addKeyword} = require('@bot-whatsapp/bot');
import bot from "@bot-whatsapp/bot";
//import { addKeyword } from '@bot-whatsapp/bot';
/***Flujo de Despedida */

const despedidaFlow = bot.addKeyword(['chao','adios','nos vemos','gracias','hasta luego','thanks','muchas gracias','Nos vemos','NOS VEMOS','CHAO'])
  .addAnswer('Un gusto ayudarte');

export default despedidaFlow;