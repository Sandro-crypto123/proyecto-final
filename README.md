## Simulador de Costo de Transporte en Contexto de Crisis

**Materia:** Programación Web I  
**Desafío Final:** Escenario C — Simulador de costo de transporte  
**Tema:** Simulador web de abastecimiento, precios y consumo familiar en contexto de crisis
**Nombre:**Sandro Morales Gutiérrez

---

## Descripción

Página web interactiva que simula el impacto económico del incremento de tarifas de transporte en La Paz, Bolivia, tras la eliminación de la subvención a los combustibles

Permite calcular cuánto más gasta una persona o familia cuando existen **bloqueos, desvíos o rutas más largas** en la ciudad.
## Cómo usar

1. Abre `index.html` en tu navegador **o** visita la página publicada.
2. Ve a la sección **Simulador**.
3. Ingresa los datos de tu ruta (tipo de vehículo, distancias, viajes/semana, personas).
4. Haz clic en **Calcular gasto**.
5. Revisa los resultados en la sección de resultados.
6. También puedes cargar los **Casos de Estudio** directamente.

## Estructura del proyecto

```
proyecto-web-crisis/
│
├── index.html              ← Página principal
├── README.md               ← Este archivo
│
├── css/
│   └── estilos.css         ← Estilos externos (diseño responsivo)
│
└── js/
    └── script.js           ← Lógica JavaScript + manipulación DOM
```



## Tecnologías utilizadas

HTML5:Estructura semántica (header, nav, main, section, footer)
CSS:Estilos externos, diseño responsivo con media queries
JavaScript:Cálculos y lógica
DOM:Captura de datos y presentación de resultados dinámicos


## Modelos matemáticos

Costo por viaje     = distancia (km) × costo por km
Costo adicional     = (distancia con desvío - distancia normal) × costo por km
Gasto semanal extra = costo adicional × viajes/semana × personas
Gasto mensual extra = gasto semanal extra × semanas/mes
Porcentaje aumento  = ((distancia desvío - distancia normal) / distancia normal) × 100


---
## 📊 Datos de referencia 

Vehículo              Antes | Ahora

Minibús tramo corto:  Bs 2,40 / Bs 3,00 
Minibús tramo largo: Bs 3,00 / Bs 3,50 
Micro /Bus: Bs 1,80  Bs 2,50 
Trufi tramo largo Bs 4,00 
