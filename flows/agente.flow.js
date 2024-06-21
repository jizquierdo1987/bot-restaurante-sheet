const {addKeyword} = require('@bot-whatsapp/bot');
//import {addKeyword} from '@bot-whatsapp/bot';

/***Flujo de Agente */

module.exports = addKeyword('agente','Agente','AGENTE')
    .addAnswer(
      ['Necesito algunos datos de contacto para que un agente te llame', '¿Estás de acuerdo? *1*: si ó *2*: no'].join(
          '\n'
      ),
      { capture: true },
      async (ctx, { fallBack, gotoFlow, endFlow }) => {
        if (!['1','2'].includes(ctx.body)) {
            return fallBack('Esa opción no es válida')
        }
        if (ctx.body==='1') {
          return gotoFlow(registerFlowAgente)
      }else {
        endFlow('gracias!, estoy para servirte en tus consultas')
      }
    }
  );
