# SYSTEM DESIGN SPECIFICATION: Personal Pocket Lightning Rod

Данный документ описывает строгие математические и визуальные параметры дизайн-системы. Все значения приведены в пикселях, ремах или точных гекс-кодах для внедрения в серверный рендеринг SVG (на Serv00) и фронтенд Telegram WebApp (TMA).

## 1. DESIGN TOKENS (JSON)
Блок дизайн-токенов в формате JSON (Design Tokens Format Module). Семантические токены ссылаются на глобальные при помощи интерполяции `{}`.

```json
{
  "colors": {
    "global": {
      "slate-black": "#0C0D10",
      "cyber-neon-yellow": "#FFEA00",
      "neon-coral-red": "#FF7575",
      "safety-neon-orange": "#FF7B00",
      "white-100": "#FFFFFF",
      "gray-800": "#1F2128",
      "gray-600": "#3F424E"
    },
    "semantic": {
      "background": {
        "primary": "{colors.global.slate-black}",
        "surface": "{colors.global.gray-800}"
      },
      "text": {
        "primary": "{colors.global.white-100}",
        "secondary": "{colors.global.gray-600}",
        "halo": "{colors.global.slate-black}"
      },
      "signal": {
        "warning": "{colors.global.cyber-neon-yellow}",
        "critical": "{colors.global.neon-coral-red}",
        "critical-alt": "{colors.global.safety-neon-orange}"
      }
    }
  },
  "typography": {
    "fonts": {
      "telemetry": "\"JetBrains Mono\", monospace",
      "ui": "\"Inter\", sans-serif"
    },
    "sizes": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.5rem",
      "2xl": "2rem"
    },
    "weights": {
      "regular": 400,
      "semibold": 600,
      "bold": 700
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem"
  },
  "radii": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "full": "9999px"
  },
  "shadows": {
    "hud": "0 8px 16px rgba(0, 0, 0, 0.75)",
    "neon-warning": "0 0 8px {colors.global.cyber-neon-yellow}",
    "neon-critical": "0 0 8px {colors.global.neon-coral-red}"
  },
  "z-indices": {
    "map-base": 0,
    "map-concentric": 10,
    "map-hex-grid": 20,
    "map-user": 30,
    "map-strikes": 40,
    "map-scit": 50,
    "map-labels": 60,
    "ui-hud": 100,
    "ui-modal": 200
  }
}
```

## 2. MAP RENDER RULES (Спецификация отрисовки статической карты)
Правила рендеринга серверного SVG/PNG изображения карты (холст `1080x1080 px` для постов Threads / Imgur).

### Слои (Снизу вверх по Z-Index)

1. **Base Tile (Z: 0):** CartoDB Dark Matter. Не модифицируется, служит абсолютно нижним слоем.
2. **Concentric Circles (Z: 10):**
   - **Радиус 15 км (Warning):**
     - `stroke`: `{color.semantic.signal.warning}`
     - `stroke-width`: `2px`
     - `stroke-dasharray`: `8 8`
     - `fill`: `none`
   - **Радиус 5 км (Critical):**
     - `stroke`: `{color.semantic.signal.critical}`
     - `stroke-width`: `2px`
     - `stroke-dasharray`: `4 4`
     - `fill`: `none`
3. **Hex Grid Density (Z: 20):**
   - Гексагональные ячейки для отображения плотности грозовых разрядов.
   - `fill`: Градиент или заливка от `{warning}` до `{critical}`.
   - `fill-opacity`: `0.45` (Экспериментальный оптимум: позволяет читать дороги на базовом слое).
   - `stroke`: `none`
4. **User Position (Z: 30):**
   - Центральный маркер.
   - `fill`: `{color.global.white-100}`
   - Радиус внутреннего круга `r`: `8px`.
   - Внешнее полупрозрачное кольцо (эмуляция пульсации): `r`: `24px`, `fill`: `none`, `stroke`: `white`, `stroke-width`: `2px`, `opacity`: `0.5`.
5. **Strike Dots (Z: 40):**
   - Единичные удары молний (до биннинга).
   - `r`: `3px`
   - `fill`: `{color.semantic.signal.warning}`
   - Недавние удары (до 10 мин): `opacity: 1.0`. Старые удары: `opacity: 0.3`.
6. **SCIT (Storm Cell Identification and Tracking) Vector (Z: 50):**
   - Вектор движения шторма.
   - Основная линия: `stroke`: `{color.global.white-100}`, `stroke-width`: `3px`, `stroke-dasharray`: `6 6`.
   - Засечки времени (каждые 15 минут): Отрезки длиной `12px` перпендикулярно вектору, `stroke-width`: `3px`, `stroke-linecap`: `round`.
7. **Text Labels with Halo (Z: 60):**
   - Телеметрия (дистанция, время).
   - `font-family`: `"JetBrains Mono", monospace`
   - `font-size`: `32px`
   - `font-weight`: `700`
   - `fill`: `{color.semantic.text.primary}`
   - **Halo-эффект (Критическое требование):**
     - Достигается через свойство `paint-order: stroke fill;`
     - `stroke`: `{color.semantic.text.halo}`
     - `stroke-width`: `2.5px`
     - `stroke-linejoin`: `round`

## 3. SAFE AREA SCHEME (Мобильная верстка TMA)
Telegram WebApp открывается внутри мессенджера на смартфонах с аппаратными вырезами и "челками".

### CSS Спецификация Безопасных Зон:
Приложение должно использовать нативные переменные Telegram с резервным (fallback) значением из среды браузера.
```css
.app-container {
  /* Отступ сверху (с учетом шапки Telegram и вырезов экрана) */
  padding-top: var(--tg-safe-area-inset-top, env(safe-area-inset-top, 0px));
  /* Отступ снизу (с учетом полосы Home Indicator или нижней навигации) */
  padding-bottom: var(--tg-safe-area-inset-bottom, env(safe-area-inset-bottom, 0px));
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
```

### Touch Targets (Кнопки и плавающие панели)
- **Минимальный размер:** Любой интерактивный элемент (кнопка слоев карты, центрирования, зума) обязан иметь размер не менее **`48px` x `48px`** для безошибочного нажатия мокрым пальцем на бегу (WCAG Target Size requirement).
- Отступ между плавающими кнопками в HUD панели: минимум `8px` (токен `{spacing.sm}`).

## 4. COMPONENT SPECIFICATIONS (State Matrix)
Матрица состояний для UI-компонентов (кнопки, плавающие плашки HUD).

| Компонент / Состояние | Default | Hover / Active | Focus | Disabled | Loading |
| --- | --- | --- | --- | --- | --- |
| **HUD Button (Кнопка карты)** | `bg: {background.surface}`, `border: 1px solid {text.secondary}`, `shadow: {hud}` | `bg: {text.secondary}` | `outline: 2px solid {signal.warning}`, `outline-offset: 2px` | `opacity: 0.5`, `pointer-events: none` | Анимация вращения иконки (Spin), `opacity: 0.8` |
| **Action Button (Основная)** | `bg: {signal.warning}`, `text: {background.primary}` (Dark text) | `bg: {signal.critical-alt}`, `shadow: {neon-warning}` | `outline: 2px solid {text.primary}`, `outline-offset: 2px` | `opacity: 0.5`, `cursor: not-allowed` | `text-indent: -9999px` (Скрытие текста), показ SVG спиннера |
| **Info Card (Плашка)** | `bg: {background.primary}`, `border-radius: {radii.md}`, `opacity: 0.9` | - | - | - | Скелетон: градиент от `{background.surface}` до `{background.primary}` |
