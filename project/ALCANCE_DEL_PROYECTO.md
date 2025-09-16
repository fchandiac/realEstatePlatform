# ALCANCE DEL PROYECTO

## Proyecto: Plataforma Inmobiliaria

El proyecto es una plataforma inmobiliaria digital integral, diseñada para cubrir todas las necesidades de gestión, operación y experiencia de usuario en el sector de bienes raíces. Su enfoque es ofrecer una solución robusta, escalable y segura tanto para los administradores internos (agentes y administradores) como para los usuarios finales (visitantes y comunidad). A continuación, se presenta una descripción de la visión, alcance, arquitectura, módulos y procesos que definen este proyecto.

## Visión y Propósito

Su objetivo es facilitar a los administradores internos la gestión de propiedades, contratos, usuarios y contenido, al tiempo que ofrece a los miembros de la comunidad y visitantes una interfaz intuitiva para buscar, publicar, valorar y gestionar inmuebles. La solución está pensada para soportar el crecimiento del negocio, garantizar la seguridad y privacidad de los datos.

## Alcance Funcional

**Gestión de Propiedades:** El núcleo del sistema es la administración de propiedades inmobiliarias. Los usuarios pueden publicar, editar y gestionar inmuebles, incluyendo detalles como ubicación, características, precios, imágenes, videos y estado de publicación (solicitud, preaprobada, publicada, cerrada). El sistema permite clasificar propiedades por tipo (casa, departamento, oficina, etc.), operación (venta, arriendo), y asociarlas a agentes o administradores responsables.

**Contratos y Documentos:** La plataforma gestiona contratos de arriendo y venta, permitiendo la creación, edición, seguimiento y cierre de acuerdos. Cada contrato puede estar vinculado a múltiples personas (arrendatario, arrendador, comprador, vendedor) y sus documentos (PDF, imágenes).

**Usuarios y roles:** El sistema implementa un modelo de usuarios robusto, diferenciando entre super-adminstrador (unico), administradores, agentes, miembros de la comunidad e invitados. Cada usuario tiene un perfil con datos personales, estado, roles y permisos específicos. El sistema soporta flujos de registro, verificación de identidad, y recuperación de contraseña.

**Solicitudes y Valoraciones:** Los usuarios invitados o miembros de la comunidad pueden solicitar la publicación de propiedades o la valoración de un inmueble. Estas solicitudes pasan por un workflow de revisión, asignación y aprobación, permitiendo la intervención de agentes o administradores. El sistema almacena el historial de solicitudes, valoraciones y resultados, facilitando la gestión y el análisis de la demanda.

**Portal Público y Experiencia de Usuario:** El portal está diseñado para ofrecer una experiencia atractiva y funcional a visitantes y miembros de la comunidad. Incluye un slider, visualización de propiedades seleccionadas por un administrador en el Home y secciones como buscador de propiedades con filtros avanzados, formularios para publicar o valorar inmuebles, información sobre la empresa, blog de contenidos, testimonios de clientes y acceso a la cuenta personal. Los usuarios miembros de la comunidad pueden gestionar sus datos, publicaciones, favoritos, contratos y estado de pagos desde un panel privado.

**CMS y Contenido Institucional:** El sistema incorpora un CMS (Content Management System) para gestionar elementos visuales y textuales del portal, como sliders, secciones de “Sobre Nosotros”, blog, testimonios, logo, datos de contacto y otros. Los administradores pueden actualizar el contenido de manera sencilla, asegurando la coherencia y actualidad de la información institucional.

**Reportes y Auditoría:** La plataforma genera reportes sobre propiedades, contratos, usuarios, actividad y métricas clave del negocio. Incluye un sistema de auditoría que registra todas las acciones relevantes (creación, edición, eliminación, notificaciones), permitiendo el seguimiento y la trazabilidad de los cambios.

**Notificaciones y Comunicación:** El sistema envía notificaciones automáticas, informando sobre cambios de estado, aprobaciones, recordatorios, novedades y alertas. Además de las notificaciones internas está contemplado el envío de correos.
