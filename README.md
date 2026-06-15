# 🇨🇱 Vacaciones Chile

Aplicación web para optimizar tus días de vacaciones aprovechando feriados nacionales, regionales e irrenunciables de Chile.

## ¿Qué hace?

Analiza el calendario del año y detecta automáticamente las mejores oportunidades para tomar vacaciones, maximizando los días libres con la menor cantidad de días de vacaciones posibles.

Clasifica cada oportunidad en tres niveles:
- 🥇 **Oro** — eficiencia 3x o más (ej: 9 días libres con 3 de vacaciones)
- 🥈 **Plata** — eficiencia 2x o más
- 🥉 **Bronce** — igual vale la pena

## Stack tecnológico

- React 19
- TypeScript
- Vite
- CSS custom (sin librerías UI)
- Mobile First

## Arquitectura

```
src/
├── data/         # Feriados 2025-2026 y regiones de Chile
├── types/        # Modelos de dominio TypeScript
├── services/     # Lógica de negocio pura (sin React)
├── hooks/        # Custom hooks
├── context/      # Estado global
├── components/   # Componentes reutilizables
├── features/     # Pantallas de la app
└── styles/       # Design tokens y estilos globales
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Roadmap

- [x] v1 — MVP: recomendaciones por región y días disponibles
- [ ] v2 — Calendario visual, persistencia, compartir
- [ ] v3 — PWA, API oficial de feriados, exportar a Google Calendar