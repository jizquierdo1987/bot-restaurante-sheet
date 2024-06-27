import bot from "@bot-whatsapp/bot";
import { validarCedulaEcuador, validarNumeroEcuador,validarTelefonoFijoEcuador } from "../funciones/validarNumeros.js";
import GoogleSheetService from "../services/sheets/index.js";
const googelSheet = new GoogleSheetService(
  "15Ihwlc-6N-hMRctQV8vxR9P43UcVsJ9TTcGmdK8y6BM"
);

/***Flujo de registro de reparación */
const registerFlow = bot.addKeyword('REGISTER_FLOW')
      .addAnswer(`Cual es el nombre de la persona que va a estar en tu domicilio o local?`, { capture: true }, async (ctx, { state }) => {
          await state.update({ name: ctx.body })
      })
      .addAnswer('¿Cual es la dirección ó lugar de tu requerimiento?', { capture: true }, async (ctx, { state }) => {
          await state.update({ direccion: ctx.body })
      })
      .addAnswer('Proporciona un número de contacto',  { capture: true }, async (ctx, { state, fallBack }) => {
        const numero = ctx.body.replace(/\s+/g, ''); // Eliminar espacios
        console.log("Número ingresado:", numero);
        if (!validarNumeroEcuador(numero)) {
          console.log("Número inválido:", numero);
          return fallBack('favor proporciona un número de contacto válido (09xxxxxxxx)');
        }
        console.log("Número válido:", numero);
        await state.update({ numcontacto: numero });
      })
      .addAnswer('Favor proporciona un texto breve sobre tu inconveniente o problema con el servicio', { capture: true }, async (ctx, { state }) => {
          await state.update({ observaciones: ctx.body })
      })
      .addAnswer('Finalmente proporciona el *número de cédula* del titular del servicio, sino lo tiene puedes colocar el suyo', { capture: true }, async (ctx, { state, fallBack }) => {
        const cedula = ctx.body.replace(/\s+/g, ''); // Eliminar espacios

        if (!validarCedulaEcuador(cedula)) {
          return fallBack('Proporciona un número de cédula válido');
        } 
        await state.update({ idsuscriptor: ctx.body })
    })
          // Pregunta inicial para confirmar si poseen un número de servicio de telefonía fija
          .addAnswer('Favor ingrese el servicio de telefonía fija si es que lo tiene, de lo contrario ingrese *no* ', { capture: true }, async (ctx, {state}) => {
            await state.update({ numeroServicio: ctx.body })
          })      
      .addAction(async (_, { flowDynamic, state }) => {
          await flowDynamic(`Gracias por la información!: Nombre ${state.get('name')} Dirección: ${state.get('direccion')} contacto ${state.get('numcontacto')} suscriptor ${state.get('idsuscriptor')}`)
      })
      .addAnswer(
          "Perfecto tu pedido está agendado, un asistente se comuncará contigo lo más pronto posible",
          null,
          async (ctx, { state }) => {
              const currentState = state.getMyState();
              await googelSheet.saveOrder({
                fecha: new Date().toLocaleString(),
                telefono: ctx.from,
                suscriptor: currentState.idsuscriptor,
                numeroServicio: currentState.numeroServicio,
                contacto: currentState.numcontacto,
                nombre: currentState.name,
                direccion: currentState.direccion,
                observaciones: currentState.observaciones,
            });
          }
        );

export default registerFlow;