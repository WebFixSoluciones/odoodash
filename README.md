# Dashboard por defecto al iniciar sesión (odoodash)

## 📖 Descripción General
Este es un módulo independiente para **Odoo 19** (versión Community) que mejora la experiencia de usuario al iniciar sesión. 

Por defecto, en Odoo, la pantalla inicial al loguearse suele ser el chat de *Discuss* o la última aplicación configurada. Este módulo asegura que **todos los usuarios** (tanto los nuevos como los ya existentes) aterricen directamente en el **Dashboard principal de Aplicaciones (Home)** justo después de iniciar sesión.

## ✨ Características Principales
- **Configuración Automática para Usuarios Nuevos:** Sobrescribe el método `_default_action_id` del modelo `res.users` para que cualquier usuario recién creado obtenga el Dashboard de aplicaciones como su acción de inicio predeterminada.
- **Actualización de Usuarios Existentes:** Utiliza un `post_init_hook` que se ejecuta automáticamente al instalar el módulo. Esto escanea a todos los usuarios actuales que no tengan una acción de inicio configurada y les asigna el Dashboard de aplicaciones.
- **Ligero y Transparente:** Es un módulo puramente técnico que no añade menús ni vistas adicionales, manteniendo la interfaz de Odoo limpia.

## ⚙️ Detalles Técnicos
- **Dependencias:** `web`
- **Modelo Extendido:** `res.users`
- **Acción Asignada:** `web.web_client_home`

## 🚀 Instalación
1. Descarga o clona este repositorio.
2. Comprime la carpeta `odoodash` en un archivo ZIP (`odoodash.zip`), o cópiala directamente en tu directorio de *addons* (por ejemplo, `odoo/addons/`).
3. Reinicia tu servidor de Odoo.
4. Activa el **Modo Desarrollador** en Odoo.
5. Ve a **Aplicaciones** > **Actualizar lista de aplicaciones**.
6. Busca `Dashboard por defecto al iniciar sesión` (o simplemente `odoodash`) y haz clic en **Activar/Instalar**.

## 👨‍💻 Autor
Creado y mantenido por **Carlos TelecomTV** / **WebFix Soluciones**.
