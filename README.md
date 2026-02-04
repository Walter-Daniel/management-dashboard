# School Management Dashboard

Dashboard de gestión escolar construido con **Next.js 15**, **TypeScript** y **Prisma**. Permite administrar estudiantes, profesores, clases, materias, exámenes y más, con control de acceso basado en roles.

## Tecnologías

- **Next.js 15** - App Router con Server Actions
- **React 19** - Componentes de UI
- **TypeScript** - Tipado estático
- **Prisma** - ORM con PostgreSQL (Neon)
- **Clerk** - Autenticación y gestión de usuarios
- **Tailwind CSS** - Estilos
- **React Hook Form + Zod** - Formularios y validación
- **Recharts** - Gráficos y visualización de datos
- **React Big Calendar** - Calendario de lecciones y eventos
- **Next Cloudinary** - Carga y optimización de imágenes
- **React Toastify** - Notificaciones

## Funcionalidades

### Autenticación y roles

- Autenticación con Clerk (sign-in/sign-up)
- Cuatro roles: **Admin**, **Teacher**, **Student**, **Parent**
- Rutas protegidas según el rol del usuario
- Dashboards específicos por rol

### Gestión de entidades (CRUD)

| Entidad      | Crear | Editar | Eliminar | Listar | Detalle |
|-------------|:-----:|:------:|:--------:|:------:|:-------:|
| Estudiantes |   x   |   x    |    x     |   x    |    x    |
| Profesores  |   x   |   x    |    x     |   x    |    x    |
| Clases      |   x   |   x    |    x     |   x    |    -    |
| Materias    |   x   |   x    |    x     |   x    |    -    |
| Exámenes    |   x   |   x    |    x     |   x    |    -    |
| Lecciones   |   -   |   -    |    -     |   x    |    -    |
| Tareas      |   -   |   -    |    -     |   x    |    -    |
| Resultados  |   -   |   -    |    -     |   x    |    -    |
| Eventos     |   -   |   -    |    -     |   x    |    -    |
| Anuncios    |   -   |   -    |    -     |   x    |    -    |
| Padres      |   -   |   -    |    -     |   x    |    -    |

### Dashboard de administración

- Tarjetas de estadísticas (cantidad de admins, profesores, estudiantes, padres)
- Gráfico de distribución de estudiantes
- Gráfico de asistencia
- Gráfico financiero
- Calendario de eventos
- Panel de anuncios

### Páginas de detalle

- **Estudiante**: información personal, asistencia, horario de clases (calendario), enlaces a lecciones, profesores, exámenes, tareas y resultados
- **Profesor**: información personal, horario de clases, materias asignadas

### Otras funcionalidades

- Paginación en listados (10 elementos por página)
- Búsqueda en tablas
- Formularios con validación Zod y feedback con toast notifications
- Formularios dentro de modales para operaciones CRUD
- Carga de imágenes a Cloudinary
- Diseño responsive (mobile, tablet, desktop)

## Modelo de datos

```
Admin ─── username

Student ─── datos personales, bloodType, sex, birthday
  └── pertenece a: Parent, Class, Grade
  └── tiene: Results, Attendance

Teacher ─── datos personales, bloodType, sex, birthday
  └── enseña: Subjects (muchos a muchos)
  └── tiene: Lessons, Classes (supervisor)

Parent ─── datos personales
  └── tiene: Students

Grade ─── level
  └── tiene: Students, Classes, Exams, Assignments

Class ─── name, capacity
  └── tiene: Students, Lessons, Events, Announcements
  └── supervisor: Teacher, grade: Grade

Subject ─── name
  └── tiene: Teachers (muchos a muchos), Lessons

Lesson ─── title, day, startTime, endTime
  └── pertenece a: Subject, Class, Teacher
  └── tiene: Exams, Assignments, Attendance

Exam ─── title, startTime, endTime
  └── pertenece a: Lesson, Grade
  └── tiene: Results

Assignment ─── title, startDate, dueDate
  └── pertenece a: Lesson, Grade

Result ─── score
  └── pertenece a: Student, Exam o Assignment

Attendance ─── date, present
  └── pertenece a: Student, Lesson

Event ─── title, description, startTime, endTime
  └── pertenece a: Class

Announcement ─── title, description, date
  └── pertenece a: Class
```

## Estructura del proyecto

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── admin/          # Dashboard admin
│   │   ├── student/        # Dashboard estudiante
│   │   ├── teacher/        # Dashboard profesor
│   │   ├── parent/         # Dashboard padre
│   │   └── list/
│   │       ├── students/   # Lista y detalle de estudiantes
│   │       ├── teachers/   # Lista y detalle de profesores
│   │       ├── classes/    # Lista de clases
│   │       ├── subjects/   # Lista de materias
│   │       ├── exams/      # Lista de exámenes
│   │       ├── lessons/    # Lista de lecciones
│   │       ├── assignments/# Lista de tareas
│   │       ├── results/    # Lista de resultados
│   │       ├── events/     # Lista de eventos
│   │       ├── announcements/ # Lista de anuncios
│   │       └── parents/    # Lista de padres
│   └── [[...sign-in]]/     # Página de autenticación
├── components/
│   ├── forms/              # Formularios (Student, Teacher, Class, Subject, Exam)
│   ├── FormContainer.tsx   # Contenedor server-side para formularios
│   ├── FormModal.tsx       # Modal de formulario (create/update/delete)
│   ├── Table.tsx           # Componente de tabla reutilizable
│   ├── Pagination.tsx      # Paginación
│   ├── BigCalendar.tsx     # Calendario grande
│   ├── EventCalendar.tsx   # Calendario de eventos
│   └── ...                 # Gráficos, tarjetas, navbar, menú
└── lib/
    ├── actions/            # Server actions (CRUD por entidad)
    ├── schemas/            # Esquemas de validación Zod
    ├── prisma.ts           # Cliente Prisma singleton
    ├── settings.ts         # Configuración de rutas por rol
    └── utils.ts            # Utilidades
```

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd Dashboard_UI
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno en `.env`:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
NEXT_PUBLIC_CLOUDINARY_API_KEY="..."
```

4. Ejecutar migraciones de Prisma:
```bash
npx prisma migrate dev
```

5. (Opcional) Poblar la base de datos:
```bash
npx prisma db seed
```

6. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.
