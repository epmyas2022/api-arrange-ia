# API Arrange IA

## 📋 Descripción

API REST que permite interactuar con múltiples modelos de lenguaje IA (Cerebras, Groq, OpenRouter) mediante un sistema de balanceo de carga round-robin. La API mantiene el contexto de la conversación mediante cursores codificados y soporta streaming de respuestas.

## 🚀 Características

- **Múltiples proveedores de IA**: Integración con Cerebras, Groq y OpenRouter
- **Balanceo de carga**: Rotación automática entre modelos disponibles
- **Gestión de contexto**: Sistema de cursores para mantener el historial de conversación
- **Streaming**: Respuestas en tiempo real mediante streaming
- **Prompts personalizados**: Sistema de prompts modulares
- **CORS habilitado**: Listo para uso desde frontends

## 🛠️ Tecnologías

- **NestJS** - Framework Node.js
- **TypeScript** - Tipado estático
- **pnpm** - Gestor de paquetes
- **SDKs**:
  - @cerebras/cerebras_cloud_sdk
  - groq-sdk
  - @openrouter/sdk
  - openai

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
```

## ⚙️ Configuración

Crea un archivo `.env` con las siguientes variables:

```env
# API Keys de los proveedores
CEREBRAS_API_KEY=your_cerebras_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Configuración del servidor (opcional)
PORT=4000
```

## 🎯 Uso

### Iniciar el servidor

```bash
# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod
```

El servidor estará disponible en `http://localhost:4000`

### Endpoint principal

**POST** `/`

Envía un mensaje y recibe una respuesta del modelo de IA.

#### Request Body

```json
{
  "message": "Tu mensaje aquí",
  "cursor": "cursor_opcional_para_continuar_conversacion"
}
```

#### Response

```json
{
  "ok": "done",
  "response": "Respuesta del modelo de IA",
  "cursor": "base64_encoded_conversation_history"
}
```

#### Ejemplo con cURL

```bash
# Primera interacción
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, ¿cómo estás?"}'

# Continuar conversación usando el cursor
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Cuéntame más sobre eso",
    "cursor": "eyJyb2xlIjoic3lz..."
  }'
```

## 🔄 Sistema de Rotación de Modelos

La API implementa un sistema round-robin que alterna automáticamente entre los modelos disponibles:

1. **Cerebras** → 2. **Groq** → 3. **OpenRouter** → (vuelta a Cerebras)

Cada petición usa el siguiente modelo en la secuencia, distribuyendo la carga entre proveedores.

## 💾 Sistema de Cursores

El cursor codifica en base64 el historial completo de la conversación:

```typescript
// Estructura del cursor decodificado
[
  { role: "system", content: "Prompt del sistema" },
  { role: "user", content: "Primer mensaje" },
  { role: "assistant", content: "Primera respuesta" },
  { role: "user", content: "Segundo mensaje" },
  { role: "assistant", content: "Segunda respuesta" }
]
```

## 🔧 Scripts Disponibles

```bash
pnpm start          # Inicia en modo producción
pnpm start:dev      # Inicia con hot-reload
pnpm start:debug    # Inicia con debugger
pnpm build          # Compila el proyecto
pnpm format         # Formatea código con Prettier
pnpm lint           # Ejecuta ESLint
```

## 📝 Personalización de Prompts

Los prompts del sistema se gestionan en `src/prompts/`:

1. Crea un archivo markdown en `src/prompts/`
2. Usa `loadPrompt('nombre-archivo')` para cargarlo
3. El prompt se incluirá automáticamente en el contexto

**Nota**: Asegúrate de configurar correctamente las API keys antes de usar la aplicación.
