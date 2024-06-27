//const {addKeyword} = require('@bot-whatsapp/bot');
//import { addKeyword } from '@bot-whatsapp/bot';
import bot from "@bot-whatsapp/bot";
import agenteFlow from "./agente.js";
import reparacionFlow from "./reparacion.js";
/***Flujo de Bienvenida */

const welcomeFlow = bot.addKeyword(['hi', 'hello', 'hola','hay alguien ahí', 'helloo','Buenos dias','buenos dias','Buenos días','buenos días','buenas','Buenos dias'])
.addAnswer([
  `🙌 Hola como estás ? bienvenido al servicio de atención al cliente de CNT EP , en que te puedo ayudar ? 🚀`,
  `recuerda escribir`,
  `👉 *1*: para solicitar una reparación de tu servicio 📅`,
  `👉 *2*: si deseas recibir atención de un *agente* personal 📲`,
  `👉 *3*: Cancelar`,
  ].join('\n'),
    { delay: 800, capture: true},
      async (ctx, { fallBack, gotoFlow, endFlow }) => {
        
        if (!['1','2','3'].includes(ctx.body)) {
            return fallBack('Opción no válida')
        }
        if(ctx.body==='3'){
          endFlow('gracias, estoy para servirte')
        }
        if (ctx.body==='1') {
          return gotoFlow(reparacionFlow)
      }else if(ctx.body==='2') {
        return gotoFlow(agenteFlow)
      }
  }
);

export default welcomeFlow;