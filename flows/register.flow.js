const {addKeyword} = require('@bot-whatsapp/bot');
//import { addKeyword } from '@bot-whatsapp/bot';

// Función para validar el número de teléfono fijo de Ecuador
function validarTelefonoFijoEcuador(numero) {
  // Asegurarse de que el número tiene exactamente 9 dígitos
  if (numero.length !== 9) {
    return false;
  }

  // Verificar que el número comienza con un código de área válido
  const codigoArea = parseInt(numero.substring(0, 1), 10);
  if (codigoArea < 2 || codigoArea > 7) {
    return false;
  }

  // Verificar que el resto del número son dígitos válidos
  const restoNumero = numero.substring(1);
  return /^\d{8}$/.test(restoNumero);
};



function validarCedulaEcuador(cedula) {
  // Asegurarse de que la cédula tiene exactamente 10 dígitos
  if (cedula.length !== 10) {
    return false;
  }

  // Obtener el código de provincia (dos primeros dígitos)
  const provincia = parseInt(cedula.substring(0, 2), 10);

  // El código de provincia debe estar entre 1 y 24, o ser 30 (extranjeros)
  if (provincia < 1 || (provincia > 24 && provincia !== 30)) {
    return false;
  }

  // Aplicar el algoritmo de validación
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < coeficientes.length; i++) {
    let digito = parseInt(cedula.charAt(i), 10) * coeficientes[i];
    suma += digito > 9 ? digito - 9 : digito;
  }

  const ultimoDigito = parseInt(cedula.charAt(9), 10);
  const decenaSuperior = Math.ceil(suma / 10) * 10;
  const digitoVerificador = (decenaSuperior - suma) % 10;

  return digitoVerificador === ultimoDigito;
}

/***Flujo de registro de reparación */
module.exports = addKeyword('REGISTER_FLOW')
      .addAnswer(`Cual es el nombre de la persona que va a estar en tu domicilio o local?`, { capture: true }, async (ctx, { state }) => {
          await state.update({ name: ctx.body })
      })
      .addAnswer('¿Cual es la dirección ó lugar de tu requerimiento?', { capture: true }, async (ctx, { state }) => {
          await state.update({ direccion: ctx.body })
      })
      .addAnswer('Proporciona un número de contacto?', { capture: true }, async (ctx, { state }) => {
          await state.update({ numcontacto: ctx.body })
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
          .addAnswer('¿Posees un número de servicio de telefonía fija de CNT EP? (responde 0 para "sí" o 2 para "no")', { capture: true }, async (ctx, { state, fallBack }) => {
            const respuesta = ctx.body.trim();
          
            if (respuesta === '0') {
              await ctx.sendMessage('Proporciona tu número de servicio de telefonía fija de CNT EP');
            } else if (respuesta === '1') {
              await state.update({ numeroServicio: 'desconozco' });
              await ctx.sendMessage('Entendido, continuemos.');
            } else {
              return fallBack('Por favor, responde 0 para "sí" o 2 para "no".');
            }
          })

      // Captura y validación del número de servicio de telefonía fija
      .addAnswer('', { capture: true }, async (ctx, { state, fallBack }) => {
        const numeroServicio = ctx.body.replace(/\s+/g, ''); // Eliminar espacios
      
        if (!validarTelefonoFijoEcuador(numeroServicio)) {
          return fallBack('Proporciona un número de servicio válido');
        }
      
        await state.update({ numeroServicio: numeroServicio });
        await ctx.sendMessage('Número de servicio registrado correctamente.');
      })
      .addAction(async (_, { flowDynamic, state }) => {
          await flowDynamic(`Gracias por la información!: Nombre ${state.get('name')} Dirección: ${state.get('direccion')} contacto ${state.get('numcontacto')} suscriptor ${state.get('idsuscriptor')}`)
      })
      .addAnswer(
          "Perfecto tu pedido está agendado, un asistente se comuncará lo mas pronto posible",
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
