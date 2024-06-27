//const {addKeyword} = require('@bot-whatsapp/bot');
//import { addKeyword } from '@bot-whatsapp/bot';
import bot from "@bot-whatsapp/bot";
import registerFlow from "./register.js";

/***Flujo Reparación */

const reparacionFlow = bot.addKeyword('reparación','rep','Reparación','REP')
    .addAnswer(
      ['De acuerdo vamos a realizar un agendamiento de tu problema', '¿Estás de acuerdo? *1*: si ó *2*: no'].join(
          '\n'
      ),
      { capture: true },
      async (ctx, { fallBack, gotoFlow, endFlow }) => {
          if (!['1','2'].includes(ctx.body)) {
              return fallBack('Esa opción no es válida')
          }
          if (ctx.body==='1') {
            return gotoFlow(registerFlow)
        }else {
          endFlow('gracias!, estoy para servirte en tus consultas')
        }
      }
  );
export default reparacionFlow;