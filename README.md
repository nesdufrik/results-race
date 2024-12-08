# Administrador y Control de Eventos de Competición de Ciclismo

Este proyecto es una aplicación web para la administración y control de eventos de competición de ciclismo. Está construido con Vue 3 y Vite, y utiliza Pinia para el manejo del estado. La aplicación permite a los administradores gestionar eventos, participantes y visualizar los resultados de las competiciones.

## Características

- **Autenticación**: Inicio de sesión para administradores.
- **Gestión de Eventos**: Crear, actualizar y eliminar eventos de ciclismo.
- **Participantes**: Gestión de participantes en los eventos.
- **Resultados**: Visualización de resultados y clasificaciones.
- **Panel de Administración**: Dashboard para la administración de eventos y participantes.

## Tecnologías Utilizadas

- **Vue 3**: Framework de JavaScript para la construcción de interfaces de usuario.
- **Vite**: Herramienta de construcción rápida para proyectos de frontend.
- **Pinia**: Biblioteca para el manejo del estado en aplicaciones Vue.
- **Axios**: Cliente HTTP para realizar solicitudes a la API.
- **PrimeVue**: Biblioteca de componentes UI para Vue.

## Estructura del Proyecto

- **src**: Contiene el código fuente de la aplicación.
  - **components**: Componentes reutilizables de Vue.
  - **composables**: Funciones reutilizables que encapsulan lógica de negocio.
  - **pages**: Vistas de la aplicación.
  - **router**: Configuración de rutas de la aplicación.
  - **services**: Servicios para interactuar con la API.
  - **stores**: Almacenes de estado gestionados por Pinia.

## Instalación

1. Clona el repositorio:

```sh
   git clone https://github.com/nesdufrik/results-race.git
```

2. Navega al direcotrio del proyecto:

```sh
cd results-race
```

3. Instala las dependencias:

```sh
npm install
```

4. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:

```env
VITE_END_POINT=http://api-del-enpoint-backend
```

5. Inicia el servidor de desarrollo:

```sh
npm run dev
```

6. La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

## Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## Contacto

- [Sitio Web](https://friktek.com)
- [Correo Electrónico](mailto:marco.decormis@friktek.com)
