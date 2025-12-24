# Configuración de Google Maps API Key

## 1. Copia tu API Key de Google Cloud Console

## 2. Edita el archivo app.json y reemplaza:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_API_KEY_AQUI"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_API_KEY_AQUI"
      }
    }
  }
}
```

## 3. Para mayor seguridad, crea un archivo .env:
```
GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

## 4. Instala dotenv para variables de entorno:
```bash
npm install react-native-dotenv
```

## 5. Opcional: Para web, añade en app.json:
```json
"web": {
  "config": {
    "googleMapsApiKey": "TU_API_KEY_AQUI"
  }
}
```

## IMPORTANTE:
- ⚠️ Nunca subas tu API Key a repositorios públicos
- 🔒 Siempre usa restricciones en Google Cloud Console
- 💰 Monitorea el uso para evitar cargos inesperados
- 🔄 Regenera la key si se compromete

## Para testing:
La app funciona SIN API Key usando mapas básicos de Expo.