// ^[a-zA-Z0-9._%+-]+: Permite letras, números y algunos caracteres especiales en la parte local del correo.
// @[a-zA-Z0-9.-]+: Permite letras, números, puntos y guiones en el dominio.
// \\.[a-zA-Z]{2,}: Asegura que haya un punto seguido de al menos dos letras (por ejemplo, .com, .org, etc.).
// (\\.[a-zA-Z]{2})?$: Opcionalmente permite un segundo dominio (como .co.uk).

export const regexMail: string = "^[a-zA-Z0-9._%+-]+@(?!.*\\.\\.)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

export const regexTextos = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.\\- ]{1,50}$'; // letras, tildes, espacios, puntos, guiones
export const regexAlfanumericoConEspacios = '^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ]{1,50}$'; // letras, acentos números y espacios
export const regexDireccion = '^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.\\- ]{1,50}$'; // letras, números, tildes, espacios
export const regexNumeros = '^[0-9]{1,10}$'; // solo números (para cantidades)


// pattern contraseña. Debe contener al menos una letra minúscula, una mayúscula, un número, un carácter especial, al menos 8  y maximo 64 caracteres
export const regexContraseña: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:"\\\'<>?,.\\/]).{8,64}$';

// pattern contraseña. Debe contener al menos una letra minúscula, una mayúscula, un número, al menos 6 caracteres
export const regexPassword: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$';


