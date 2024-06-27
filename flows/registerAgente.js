//const {addKeyword} = require('@bot-whatsapp/bot');
//import { addKeyword } from '@bot-whatsapp/bot';
import bot from "@bot-whatsapp/bot";
import GoogleSheetService from "../services/sheets/index.js";
const googelSheet = new GoogleSheetService(
  "15Ihwlc-6N-hMRctQV8vxR9P43UcVsJ9TTcGmdK8y6BM"
);
function validarNumeroEcuador(num) {
  const regex = /^09\d{8}$/;
  return regex.test(num);
};

/***Flujo de registro para agente */
const registerAgenteFlow = bot.addKeyword('REGISTER_FLOW_AGENTE')
          .addAnswer(`Favor dime tu nombre y apellido`, { capture: true }, async (ctx, { state }) => {
            await state.update({ name: ctx.body })
          })    
          .addAnswer('Proporciona un número de contacto para poder llamarte', { capture: true }, async (ctx, { state, fallBack }) => {
            const numero = ctx.body.replace(/\s+/g, ''); // Eliminar espacios
            console.log("Número ingresado:", numero);
            if (!validarNumeroEcuador(numero)) {
              console.log("Número inválido:", numero);
              return fallBack('Proporciona un número de contacto válido (09xxxxxxxx)');
            } 
            console.log("Número válido:", numero);
            await state.update({ numcontacto: numero });
          })
            .addAnswer('Favor proporciona un texto breve sobre tu requerimiento con el agente', { capture: true }, async (ctx, { state }) => {
              await state.update({ observaciones: ctx.body })
            })
            .addAction(async (_, { flowDynamic, state }) => {
                await flowDynamic(`Gracias por la información!: Nombre ${state.get('name')} contacto ${state.get('numcontacto')}`)
            })
            .addAnswer(
                "Perfecto tu pedido está agendado, un asistente se comuncará lo mas pronto posible",
                null,
                async (ctx, { state }) => {
                    const currentState = state.getMyState();
                    await googelSheet.saveOrderAgente({
                    fecha: new Date().toLocaleString(),
                    telefono: ctx.from,
                    nombre: currentState.name,
                    contacto: currentState.numcontacto,
                    observaciones: currentState.observaciones,
                  });
                }
              );
export default registerAgenteFlow;