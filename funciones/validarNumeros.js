// Función para validar el número de teléfono fijo de Ecuador
export function validarTelefonoFijoEcuador(numero) {
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
  
  
 export function validarCedulaEcuador(cedula) {
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
  };


  export function validarNumeroEcuador(num) {
    const regex = /^09\d{8}$/;
    return regex.test(num);
  };
  