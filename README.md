# gps-visualizer

Parses coordinate and time data into separate journeys and visualizes them. Can be used as a react component, or built as standalone.

## Using as a react component

```js
import GpsVisualizer from 'GpsVisualizer';

<GpsVisualizer
    data={/* .. */ }
    options={{
        apiKey: // ...
    }}
/>
```

## Standalone build

### Loading data yourself

```bash
>  npm run build-standalone
```

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="gps-visualizer.js" type="text/javascript"></script>
        <script>
            function init() {
                const data = // ...

                gpsVisualizer(document.getElementById('visualizer'), data, {
                    apiKey: // ...
                });
            }
        </script>
    </head>
    <body onload="init()">
        <div id="visualizer"></div>
    </body>
</html>
```

### Building with embeded dataset

```bash
> GPS_DATA=./path/to/data.json npm run build-standalone
```

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="gps-visualizer.js" type="text/javascript"></script>
        <script>
            function init() {
                gpsVisualizer(document.getElementById('visualizer'), null, {
                    apiKey: // ...
                });
            }
        </script>
    </head>
    <body onload="init()">
        <div id="visualizer"></div>
    </body>
</html>
```

## Data format

Dataset is a json array of objects that have required fields `time` (unix timestamp), `lat` and `lng`.

```js
[
    { "time": 1499092463, "lat":"61.52098","lng":"28.17620" },
    { "time": 1499094179, "lat":"61.52058","lng":"28.17618" },
    // ...
]
```