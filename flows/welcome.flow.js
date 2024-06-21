const {addKeyword} = require('@bot-whatsapp/bot');
//import { addKeyword } from '@bot-whatsapp/bot';

/***Flujo de Bienvenida */

module.exports = addKeyword(['hi', 'hello', 'hola','hay alguien ahí', 'helloo','Buenos dias','buenos dias','Buenos días','buenos días','buenas'])
    .addAnswer([
      `🙌 Hola como estás ? bienvenido al servicio de atención al cliente de CNT EP , en que te puedo ayudar ? 🚀`,
      `recuerda escribir`,
      `👉 *1*: para solicitar una reparación de tu servicio 📅`,
      `👉 *2*: si deseas recibir atención de un *agente* personal 📲`,
      ].join('\n'),
        { delay: 800, capture: true },
        async (ctx, { fallBack, gotoFlow, endFlow }) => {
          if (!['1','2'].includes(ctx.body)) {
              return fallBack('Esa opción no es válida')
          }
          if (ctx.body==='1') {
            return gotoFlow(registerFlow)
        }else if(ctx.body==='2') {
          return gotoFlow(registerFlowAgente)
        }
      }
);