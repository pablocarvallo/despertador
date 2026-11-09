# Reloj Reposo

Reloj despertador de cabecera para iPhone al estilo del modo **En reposo**, con registro de **ronquidos** durante la noche. Funciona en iOS 15.8 (iPhone 7) como app web instalada en la pantalla de inicio.

## Despertador

- En horizontal muestra la hora en cifras grandes, el día, la temperatura y la próxima alarma.
- En vertical muestra los ajustes: alarmas con días de repetición, tono, posponer, estilo del reloj y modo de luz.
- En horizontal, deslizar el dedo hacia arriba aclara el reloj y hacia abajo lo oscurece (un nivel para el modo celeste y otro para el rojo). Deslizar hacia los lados cambia el estilo.
- Protección de pantalla: el reloj se mueve de a poco (Deriva, Latido o Paseo) para que la imagen no quede fija toda la noche.
- Celeste con luz y rojo en oscuridad. La luz se mide con la cámara frontal (o por horario, o fija).

## Ronquidos

En vertical, la pestaña **Ronquidos** (arriba de los ajustes) tiene todo lo de la app Ronquidos:

- **Empezar la noche**: escucha con el micrófono, reconoce los ronquidos (banda grave, ritmo de respiración), los cuenta minuto a minuto y graba un trozo de cada episodio.
- **Anoche**, gráfico **Por hora** (minutos o ronquidos), **Grabaciones** (escuchar, compartir o eliminar) e **Historial** de 14, 30 o 90 noches, con el detalle de cada noche.
- **Ajustes** (botón arriba a la derecha de la pestaña): sensibilidad, grabar o no, cuántas noches se conservan los audios, empezar de inmediato o en 15 o 30 minutos, terminar sola a una hora, borrar todo, y **Probar la detección**.
- Mientras escucha, en vertical se ve la pantalla negra de la noche (hora, ronquidos contados y próxima alarma; **mantén presionado para terminar**). En horizontal se ve el reloj en reposo con el aviso «Escuchando» y, al tocar la pantalla, el botón **Mantén para terminar la noche**.

### Cómo conviven la alarma y la escucha

- Cuando suena una alarma, el micrófono se pone en pausa (para que el tono salga por el parlante) y esa pausa queda anotada en la noche.
- **Posponer** vuelve a abrir el micrófono y la escucha sigue.
- **Detener** guarda y termina la noche (se puede desactivar en Ajustes de Ronquidos › «Terminar al detener la alarma»; en ese caso la escucha sigue).
- «Sonar en 10 s» (prueba) nunca termina la noche.

Los datos de Ronquidos quedan solo en el iPhone: noches y audios en IndexedDB `ronquidos`, ajustes en `localStorage` (`ronquidos-ajustes`); los del reloj en `reposo.v1`.

## Instalación en el iPhone

1. Publica esta carpeta con GitHub Pages (rama `main`, carpeta raíz).
2. En el iPhone abre la dirección en **Safari**, toca **Compartir › Agregar a pantalla de inicio**.
3. Abre la app desde el icono **Reposo**, toca la pantalla una vez y ponla en horizontal. Para Ronquidos, la primera vez pide permiso para el micrófono: elige **Permitir**.

## Para que suene (y escuche) toda la noche

- iPhone conectado al cargador.
- **Ajustes › Pantalla y brillo › Bloqueo automático › Nunca**.
- Sin bloqueo de orientación vertical.
- La app abierta y al frente: si se cierra o se bloquea la pantalla, la alarma no suena y la escucha se corta.
- La alarma usa el volumen multimedia: súbelo con los botones mientras suena el tono de prueba.

## Detalles técnicos

- Un solo `index.html`. El código de Ronquidos va en su propio bloque `<script>` (motor de detección entre `/*MOTOR:START*/ … /*MOTOR:END*/`) y sus estilos en un bloque `<style>` con todo bajo `.rq`, con las variables `--ds-*` conectadas a la paleta del reloj (celeste con luz, rojo en oscuridad).
- Los dos módulos se hablan por `window.Reposo` (próxima alarma, espera de la cámara) y `window.RQ` (pausar y reanudar con la alarma, terminar la noche, redibujar gráficos).
- `silencio.mp4` mantiene encendida la pantalla durante la escucha en iPhones sin Wake Lock; `keepawake.mp4` hace lo mismo para el reloj.

Fuente Antonio (SIL Open Font License, ver `fonts/OFL-Antonio.txt`). Tonos de alarma originales generados para esta app.
