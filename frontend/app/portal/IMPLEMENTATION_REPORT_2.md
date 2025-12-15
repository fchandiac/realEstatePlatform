# Informe de Implementación - Fase 2

## Hito: Pie de Página (Footer)
- **Ubicación del componente:** `frontend/app/portal/ui/PortalFooter.tsx`.
- **Diseño y Layout:**
  - Se implementó una estructura de **dos filas principales** para organizar la información jerárquicamente.
  - **Fila Superior (Alianzas):**
    - Dedicada exclusivamente a mostrar las alianzas estratégicas de la empresa.
    - Los elementos (tarjetas con logo y descripción) están **centrados horizontalmente** en la pantalla.
    - Se renderizan dinámicamente desde la información de identidad.
  - **Fila Inferior (Información y Navegación):**
    - Estructurada en una grilla de **5 columnas** con anchos responsivos.
    - **Columna 1 - Datos de Empresa:** Muestra el logo (tamaño reducido), nombre, dirección, teléfono y horario. Se eliminó el título de la sección para una apariencia más limpia y la tipografía se redujo para no competir con el contenido principal.
    - **Columna 2 - Menú:** Lista de navegación plana (sin subcategorías) con los enlaces directos a las secciones principales (Inicio, Arriendos, Ventas, Administraciones, Publica tu propiedad, Nuestro equipo, Testimonios, Blog). El texto de los enlaces está **centrado horizontalmente** bajo el título "Menu".
    - **Columna 3 - FAQs:** Presenta un único elemento interactivo: un botón con la etiqueta "FAQs". Al hacer clic, despliega un **cuadro de diálogo modal (Dialog)** que contiene el listado completo de preguntas y respuestas frecuentes, permitiendo al usuario resolver dudas sin abandonar la página actual.
    - **Columna 4 - Contacto:** Simplificada al máximo para mostrar únicamente el enlace de correo electrónico (`mailto:`), facilitando el contacto directo.
    - **Columna 5 - Redes Sociales:** Esta columna es más ancha (`col-span-2` en pantallas medianas) para destacar la presencia social. Incluye el encabezado "Síguenos en redes sociales" y los iconos están **alineados a la izquierda**. Los iconos de las redes (Instagram, Facebook, LinkedIn, YouTube) se aumentaron al doble de su tamaño original (`text-4xl`) para mayor impacto visual.
- **Gestión de Contenido (BackOffice):**
  - Toda la información mostrada en el footer (logos, textos de alianzas, enlaces de redes sociales, preguntas frecuentes, datos de contacto) es dinámica.
  - Se administra desde el **BackOffice** en la sección **CMS > Identidad de la empresa**. Cualquier cambio realizado allí se refleja automáticamente en el pie de página del portal.
- **Estilo y Copyright:**
  - Se eliminaron los bordes decorativos bajo los títulos de las columnas para un diseño más minimalista.
  - El texto de copyright al final se estandarizó a: `© 2025 Todos los derechos reservados.`

## Hito: Recuperación de Contraseña
- **Ubicación del flujo:** `/portal/forgot-password` y `/portal/reset-password`.
- **Descripción del Flujo de Usuario:**
  1. **Inicio:** El usuario accede a la pantalla de inicio de sesión y selecciona la opción "¿Olvidaste tu contraseña?".
  2. **Solicitud (Página Dedicada):** Se redirige al usuario a una página exclusiva (`/portal/forgot-password`) donde se le solicita únicamente su correo electrónico.
     - **Por qué una página separada:** Por razones de seguridad y usabilidad, se separa este proceso del formulario de login. Esto evita la enumeración de usuarios desde el login y previene solicitudes accidentales. Además, permite un flujo enfocado donde el usuario confirma explícitamente su intención de recuperar el acceso.
  3. **Envío de Correo:** Al enviar el formulario, el sistema valida internamente si el correo existe.
     - Si existe, se genera un **token de seguridad** único y se envía un correo electrónico al usuario con un enlace de recuperación.
     - Si no existe, por seguridad, el sistema muestra un mensaje genérico indicando que "si el correo existe, se enviarán las instrucciones", para no revelar qué correos están registrados en la base de datos.
  4. **Enlace Seguro:** El correo contiene un enlace que dirige a `/portal/reset-password` e incluye el token como parámetro.
  5. **Restablecimiento:** El usuario accede al enlace, ingresa su nueva contraseña y la confirma. El sistema valida el token y actualiza la credencial.
  6. **Finalización:** Tras el cambio exitoso, el usuario es redirigido al login para ingresar con su nueva clave.
- **Seguridad (Tokens):**
  - Se utilizan **tokens UUID** generados criptográficamente en el backend.
  - Estos tokens tienen un tiempo de expiración limitado (configurado en el backend) y son de un solo uso.
  - Se almacenan en la base de datos (`password_reset_tokens`) vinculados al usuario, asegurando que solo el destinatario del correo pueda realizar el cambio dentro de la ventana de tiempo permitida.
