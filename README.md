# ECOsmart — App Android (Etapa 8-11)

App móvil equivalente al dashboard web: mismo backend, misma cuenta de
estudiantes (Supabase Auth), mismas 6 luces y el mismo relé simulado.
Construida con Expo + React Native + TypeScript + Expo Router.

## 1. Requisitos

- Node.js 18.18+ (recomendado 20+)
- La app **Expo Go** instalada en tu teléfono Android (para desarrollo) —
  descárgala de Google Play
- El backend `ecosmart-web` corriendo (`npm run dev`) — Android habla con
  esa misma API, nunca con el Sonoff directamente
- Tu teléfono y tu computador en la **misma red WiFi**

## 2. Instalación

```bash
cd ecosmart-mobile
npm install
cp .env.example .env.local
```

## 3. Configurar las variables de entorno

Edita `.env.local`:

```
EXPO_PUBLIC_API_BASE_URL=http://TU-IP-LOCAL:3000/api
EXPO_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

- `SUPABASE_URL` y `SUPABASE_ANON_KEY` son **las mismas** que usaste en
  `ecosmart-web/.env.local` — es la misma cuenta de estudiantes.
- `API_BASE_URL` es la parte que sí cambia frente a la web: tu teléfono no
  puede usar `localhost` para llegar al Next.js de tu computador (eso
  apuntaría al teléfono mismo). Necesitas la IP local de tu computador.

### Cómo encontrar tu IP local

Corre `npm run dev` en `ecosmart-web` y mira la terminal:

```
- Local:    http://localhost:3000
- Network:  http://192.168.1.8:3000   <- esta es la que usas
```

Usa esa IP con `/api` al final: `http://192.168.1.8:3000/api`.

## 4. Ejecutar en desarrollo (con Expo Go)

Con el backend (`ecosmart-web`) corriendo en una terminal, en otra:

```bash
npx expo start
```

Escanea el código QR con la cámara de tu Android (te ofrecerá abrirlo con
Expo Go). La app carga `/login` — regístrate con el mismo correo que
usarías en la web, o uno nuevo, y prueba encender/apagar las luces.

Si prefieres previsualizar rápido en el navegador de tu computador sin
usar el teléfono: `npm run web`.

## 5. Cómo fluye una acción desde Android

```
Botón "Encender todas" (app/index.tsx)
  -> useLightsSystem.sendAction("ON")
    -> apiPost("/lights", { action: "ON" })
      -> adjunta el access_token de la sesión de Supabase como
         Authorization: Bearer <token>
        -> Next.js: authenticateRequest() valida el token contra Supabase
          -> deviceService.turnOnRelay(userId)   [el mismo que usa la web]
          -> historyService.addHistoryEntry(...)
      -> responde con el nuevo estado
    -> la pantalla se actualiza
```

Ningún archivo de Android sabe cómo se enciende un relé — solo llama al
mismo backend que la web. Esto es intencional: cuando conectemos el Sonoff
real, no habrá que tocar ni una línea de esta app.

## 6. Generar el APK (Etapa 11) — pendiente hasta que confirmes la Etapa 8-10

Cuando ya hayas probado la app con Expo Go y funcione como esperas, el
siguiente paso es generar un `.apk` instalable sin depender de Expo Go.
Eso se hace con **EAS Build** (Expo Application Services), el servicio de
Expo en la nube que compila la app nativa por ti — no necesitas Android
Studio instalado. En resumen (lo detallamos paso a paso cuando llegues
aquí):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

Eso genera un link de descarga del `.apk`, que instalas en el teléfono
igual que cualquier APK (activando "Instalar apps de origen desconocido"
la primera vez). Antes de ese paso también hay que decidir cómo el APK de
producción va a apuntar al backend en Vercel en vez de a tu IP local —
lo vemos en detalle cuando lleguemos ahí.

## 7. Estructura

```
ecosmart-mobile/
├── app/                    # Expo Router: una ruta por archivo
│   ├── _layout.tsx         # carga fuentes, sesión, protección de rutas
│   ├── login.tsx
│   ├── register.tsx
│   └── index.tsx           # dashboard (protegido)
├── src/
│   ├── config/env.ts       # API_BASE_URL centralizada
│   ├── lib/
│   │   ├── supabase.ts     # cliente Supabase (AsyncStorage)
│   │   ├── api.ts          # fetch con Bearer token automático
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useLightsSystem.ts
│   ├── components/         # StatusBar, PowerPanel, LightGrid, HistoryLog...
│   ├── types/lights.ts     # mismo contrato que el backend
│   └── theme.ts            # misma paleta de colores que la web
└── .env.example
```

## 8. Nota de seguridad

No hay ninguna credencial del Sonoff en este proyecto, y no la habrá: las
variables `SONOFF_*` del backend nunca se exponen aquí. La app Android solo
conoce la URL pública de la API y las claves públicas de Supabase (seguras
de exponer, la seguridad real la da Row Level Security en la base de
datos).
