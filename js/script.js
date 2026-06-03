//TARIFAS POR TIPO DE VEHÍCULO (Bs)
const TARIFAS = {
  minibus_corto:    3.00,
  minibus_largo:    3.50,
  micro:            2.50,
  trufi_largo:      4.00,
  minibus_nocturno: 3.30,
  diferenciado:     2.50,
  personalizado:    null
};
 
// TOGGLE
document.getElementById('menuToggle').addEventListener('click', function () {
  const nav = document.getElementById('navMobile');
  nav.classList.toggle('open');
});
 
// Cerrar menú al hacer clic en enlace
document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMobile').classList.remove('open');
  });
});
 
//campo de tarifa
document.getElementById('tipoVehiculo').addEventListener('change', function () {
  const grupoPersonalizado = document.getElementById('grupoTarifaPersonalizada');
  if (this.value === 'personalizado') {
    grupoPersonalizado.style.display = 'flex';
  } else {
    grupoPersonalizado.style.display = 'none';
  }
});
 
//calculo
function calcular() {

  const errorDiv = document.getElementById('errorMsg');
  errorDiv.style.display = 'none';
 
  // Obtener valores del DOM
  const tipoVehiculo     = document.getElementById('tipoVehiculo').value;
  const distNormal       = parseFloat(document.getElementById('distanciaNormal').value);
  const distDesvio       = parseFloat(document.getElementById('distanciaDesvio').value);
  const costoPorKm       = parseFloat(document.getElementById('costoPorKm').value);
  const viajesSemana     = parseInt(document.getElementById('viajesSemana').value);
  const semanasMes       = parseFloat(document.getElementById('semanasMes').value);
  const personas         = parseInt(document.getElementById('personas').value);
 
  // Tarifa del pasaje
  let tarifaPasaje = TARIFAS[tipoVehiculo];
  if (tipoVehiculo === 'personalizado') {
    tarifaPasaje = parseFloat(document.getElementById('tarifaPersonalizada').value);
  }
 
  //VALIDACIONES
  const errores = [];
  if (isNaN(distNormal) || distNormal <= 0)    errores.push('⚠ Ingresa una distancia normal válida (mayor a 0 km).');
  if (isNaN(distDesvio) || distDesvio <= 0)    errores.push('⚠ Ingresa una distancia con desvío válida (mayor a 0 km).');
  if (isNaN(costoPorKm) || costoPorKm <= 0)   errores.push('⚠ Ingresa un costo por km válido.');
  if (isNaN(viajesSemana) || viajesSemana <= 0) errores.push('⚠ Ingresa el número de viajes por semana.');
  if (isNaN(personas) || personas <= 0)        errores.push('⚠ Ingresa un número de personas válido.');
  if (isNaN(tarifaPasaje) || tarifaPasaje <= 0) errores.push('⚠ Ingresa una tarifa de pasaje válida.');
  if (distDesvio < distNormal) errores.push('⚠ La distancia con desvío debe ser mayor o igual a la distancia normal.');
 
  if (errores.length > 0) {
    errorDiv.innerHTML = errores.join('<br>');
    errorDiv.style.display = 'block';
    return;
  }
 
//modelas matematicos

 
  // 1. Costo por viaje
  const costoNormalViaje  = distNormal  * costoPorKm;
  const costoDesvioViaje  = distDesvio  * costoPorKm;
 
  // 2. Diferencia de costo por viaje
  const diferenciaPorViaje = costoDesvioViaje - costoNormalViaje;
 
  // 3. Km adicionales
  const kmAdicionales = distDesvio - distNormal;
  const porcentajeAumento = ((distDesvio - distNormal) / distNormal) * 100;
 
  // 4. Costo semanal 
  const costoSemanalNormal  = tarifaPasaje * viajesSemana * personas;
  const costoSemanalDesvio  = costoDesvioViaje * viajesSemana * personas;
  const diferenciaSemanal   = (costoDesvioViaje - costoNormalViaje) * viajesSemana * personas;
 
  // 5. Costo mensual
  const costoMensualNormal  = costoSemanalNormal  * semanasMes;
  const costoMensualDesvio  = costoSemanalDesvio  * semanasMes;
  const diferenciaMensual   = diferenciaSemanal   * semanasMes;
 
  // 6. Costo anual
  const costoAnualNormal = costoMensualNormal * 12;
  const costoAnualDesvio = costoMensualDesvio * 12;
  const diferenciaAnual  = diferenciaMensual  * 12;
 
  // 7. Nivel de impacto
  let nivel, nivelTexto, nivelClass, nivelIcono;
  const pctGasto = (diferenciaMensual / costoMensualNormal) * 100;
  if (pctGasto < 15) {
    nivel = 'Normal'; nivelTexto = 'El impacto del desvío en tu presupuesto de transporte es bajo. El gasto adicional mensual es manejable.';
    nivelClass = 'normal'; nivelIcono = '🟢';
  } else if (pctGasto < 40) {
    nivel = 'Moderado'; nivelTexto = 'El desvío genera un gasto adicional notable. Considera ajustar horarios o buscar rutas alternativas.';
    nivelClass = 'moderado'; nivelIcono = '🟡';
  } else {
    nivel = '¡Crítico!'; nivelTexto = 'El impacto es muy alto. El desvío está elevando significativamente tus costos de transporte mensual.';
    nivelClass = 'critico'; nivelIcono = '🔴';
  }
 

  const contenedor = document.getElementById('resultadosContainer');
  contenedor.innerHTML = '';
 
  //resumen 
  const grid = document.createElement('div');
  grid.className = 'resultado-grid';
  grid.innerHTML = `
    <div class="res-card">
      <span class="res-label">Km adicionales por desvío</span>
      <span class="res-val">${kmAdicionales.toFixed(1)} km</span>
      <span class="res-sub">+${porcentajeAumento.toFixed(1)}% más largo</span>
    </div>
    <div class="res-card highlight">
      <span class="res-label">Gasto extra semanal</span>
      <span class="res-val">Bs ${diferenciaSemanal.toFixed(2)}</span>
      <span class="res-sub">${personas} persona(s) × ${viajesSemana} viajes</span>
    </div>
    <div class="res-card ${nivelClass === 'critico' ? 'alert-red' : nivelClass === 'moderado' ? 'alert-orange' : 'alert-green'}">
      <span class="res-label">Gasto extra mensual</span>
      <span class="res-val">Bs ${diferenciaMensual.toFixed(2)}</span>
      <span class="res-sub">+${pctGasto.toFixed(1)}% del gasto normal</span>
    </div>
    <div class="res-card">
      <span class="res-label">Gasto extra anual</span>
      <span class="res-val">Bs ${diferenciaAnual.toFixed(0)}</span>
      <span class="res-sub">Proyección a 12 meses</span>
    </div>
  `;
  contenedor.appendChild(grid);
 
  //tabla comparativa
  const tablaWrap = document.createElement('div');
  tablaWrap.className = 'resultado-tabla-wrap';
  tablaWrap.innerHTML = `
    <h3>📊 Comparativa de costos de transporte</h3>
    <table>
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Ruta normal (${distNormal} km)</th>
          <th>Con desvío (${distDesvio} km)</th>
          <th>Diferencia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Costo por viaje (km)</td>
          <td>Bs ${costoNormalViaje.toFixed(2)}</td>
          <td>Bs ${costoDesvioViaje.toFixed(2)}</td>
          <td style="color:var(--color-danger)">+Bs ${diferenciaPorViaje.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Gasto semanal (${personas} pers. × ${viajesSemana} viajes)</td>
          <td>Bs ${costoSemanalNormal.toFixed(2)}</td>
          <td>Bs ${costoSemanalDesvio.toFixed(2)}</td>
          <td style="color:var(--color-danger)">+Bs ${diferenciaSemanal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Gasto mensual (${semanasMes} semanas)</td>
          <td>Bs ${costoMensualNormal.toFixed(2)}</td>
          <td>Bs ${costoMensualDesvio.toFixed(2)}</td>
          <td style="color:var(--color-danger)">+Bs ${diferenciaMensual.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Gasto anual (12 meses)</td>
          <td>Bs ${costoAnualNormal.toFixed(2)}</td>
          <td>Bs ${costoAnualDesvio.toFixed(2)}</td>
          <td style="color:var(--color-danger)">+Bs ${diferenciaAnual.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  `;
  contenedor.appendChild(tablaWrap);
 
  // Alerta de nivel
  const alerta = document.createElement('div');
  alerta.className = `nivel-alerta ${nivelClass}`;
  alerta.innerHTML = `
    <span class="nivel-icon">${nivelIcono}</span>
    <div class="nivel-text">
      <strong>Nivel de impacto: ${nivel}</strong>
      <span>${nivelTexto}</span>
    </div>
  `;
  contenedor.appendChild(alerta);
 
  // resultados scroll
  document.getElementById('resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
 
function limpiarFormulario() {
  document.getElementById('distanciaNormal').value = '';
  document.getElementById('distanciaDesvio').value = '';
  document.getElementById('costoPorKm').value = '0.37';
  document.getElementById('viajesSemana').value = '';
  document.getElementById('semanasMes').value = '4.3';
  document.getElementById('personas').value = '1';
  document.getElementById('tipoVehiculo').value = 'minibus_corto';
  document.getElementById('tarifaPersonalizada').value = '';
  document.getElementById('grupoTarifaPersonalizada').style.display = 'none';
  document.getElementById('errorMsg').style.display = 'none';
 
  //
  document.getElementById('resultadosContainer').innerHTML = `
    <div class="resultados-placeholder">
      <div class="placeholder-icon">📊</div>
      <p>Los resultados aparecerán aquí después de ingresar tus datos en el simulador.</p>
    </div>
  `;
}
 
// casos deestudio
function cargarCaso(num) {
  const casos = {
    1: {
      tipoVehiculo: 'minibus_corto',
      distanciaNormal: 6,
      distanciaDesvio: 11,
      costoPorKm: 0.37,
      viajesSemana: 10,
      semanasMes: '4.3',
      personas: 1
    },
    2: {
      tipoVehiculo: 'trufi_largo',
      distanciaNormal: 8,
      distanciaDesvio: 15,
      costoPorKm: 0.5,
      viajesSemana: 12,
      semanasMes: '4.3',
      personas: 4
    },
    3: {
      tipoVehiculo: 'minibus_nocturno',
      distanciaNormal: 5,
      distanciaDesvio: 9,
      costoPorKm: 0.37,
      viajesSemana: 6,
      semanasMes: '4.3',
      personas: 1
    },
    4: {
      tipoVehiculo: 'micro',
      distanciaNormal: 4,
      distanciaDesvio: 7,
      costoPorKm: 0.37,
      viajesSemana: 14,
      semanasMes: '4.3',
      personas: 1
    },
    5: {
      tipoVehiculo: 'diferenciado',
      distanciaNormal: 3,
      distanciaDesvio: 6,
      costoPorKm: 0.37,
      viajesSemana: 3,
      semanasMes: '4.3',
      personas: 1
    }
  };
 
  const c = casos[num];
  if (!c) return;
 
  //valores en el formulario
  document.getElementById('tipoVehiculo').value       = c.tipoVehiculo;
  document.getElementById('distanciaNormal').value    = c.distanciaNormal;
  document.getElementById('distanciaDesvio').value    = c.distanciaDesvio;
  document.getElementById('costoPorKm').value         = c.costoPorKm;
  document.getElementById('viajesSemana').value       = c.viajesSemana;
  document.getElementById('semanasMes').value         = c.semanasMes;
  document.getElementById('personas').value           = c.personas;
  document.getElementById('grupoTarifaPersonalizada').style.display = 'none';
 
  document.getElementById('simulador').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => calcular(), 600);
}