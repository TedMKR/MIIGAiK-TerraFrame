// ================================================================================
// ‖   ЧТЕНИЕ ПАРАМЕТРОВ ИЗ URL (СОХРАНЕНИЕ СОСТОЯНИЯ ПРИ ОБНОВЛЕНИИ СТРАНИЦЫ)    ‖
// ================================================================================

// Сохраняем и читаем параметры из URL, чтобы при обновлении вкладки
// настройки и выбранная точка не терялись.
var initRun = 'false';
var runUrl = ui.url.get('run', initRun);
ui.url.set('run', runUrl);

var initSensor = 'Sentinel-2 SR';
// По умолчанию отмечаем сенсор из URL (для совместимости), остальные — нет.
var sensorUrl = ui.url.get('sensor', initSensor);
ui.url.set('sensor', sensorUrl);

var initLon = 37.63201417;
var lonUrl = ui.url.get('lon', initLon);
ui.url.set('lon', lonUrl);

var initLat = 55.67103410;
var latUrl = ui.url.get('lat', initLat);
ui.url.set('lat', latUrl);

// Комбинация каналов для визуализации RGB по умолчанию.
var initRgb = 'RED/GREEN/BLUE';
var rgbUrl = ui.url.get('rgb', initRgb);
ui.url.set('rgb', rgbUrl);

// Порог облачности по умолчанию (в процентах). Для S2 и L8/9 SR
// интерпретируется как доля облачных пикселей внутри AOI.
var initCloud = 10;
var cloudUrl = ui.url.get('cloud', initCloud);
ui.url.set('cloud', cloudUrl);

var zzz = 10;
var zzzUrl = ui.url.get('zzz', zzz);
ui.url.set('zzz', zzzUrl);

// Ширина «чипа» (микроизображения) в километрах по умолчанию.
// Приводим дефолт к минимуму слайдера (10), чтобы избежать несоответствия значений.
var initChipWidth = 10;
var chipWidthUrl = ui.url.get('chipwidth', initChipWidth);
ui.url.set('chipwidth', chipWidthUrl);

// Выбор формата экспорта
var initFormat = 'GEO_TIFF';
var formatUrl = ui.url.get('format', initFormat);
ui.url.set('format', formatUrl);

// Контроль сжатия TIFF файлов
var initCompression = false; // По умолчанию без сжатия для лучшего качества
var compressionUrl = ui.url.get('compression', initCompression);
ui.url.set('compression', compressionUrl);



// ================================================================================
// ‖                      ОБЩИЕ СТИЛИ ЭЛЕМЕНТОВ ИНТЕРФЕЙСА                        ‖
// ================================================================================

// Общие стили UI-элементов.
var CONTROL_PANEL_WIDTH = '280px';
var textFont = {fontSize: '12px'};
var headerFont = {
    fontSize: '13px', fontWeight: 'bold', margin: '4px 8px 0px 8px'};
var sectionFont = {
    fontSize: '16px', color: '#808080', margin: '16px 8px 0px 8px'};
var infoFont = {fontSize: '11px', color: '#505050'};

// Левая панель с кнопками и опциями.
var controlPanel = ui.Panel({
    style: {
        position: 'top-left', width: CONTROL_PANEL_WIDTH,
        maxHeight: '90%'
    }});

// Панель «About» (описание приложения).
var infoElements = ui.Panel(
    {style: {shown: false, margin: '0px -8px 0px -8px'}});

// Панель с контролами (опции приложения).
var controlElements = ui.Panel(
    {style: {shown: false, margin: '0px -8px 0px -8px'}});

// Панель для загрузки
var downloadElements = ui.Panel(
    {style: {shown: false, margin: '0px -8px 0px -8px'}});


// Кнопка «About»: показать/скрыть описание.
var infoButton = ui.Button(
    {label: 'About ❯', style: {margin: '0px 4px 0px 0px', width: '72px'}});

// Кнопка «Options»: показать/скрыть настройки.
var controlButton = ui.Button(
    {label: 'Options ❯', style: {margin: '0px 4px 0px 0px', width: '72px'}});

// Кнопка «Download»: показать/скрыть загрузки.
var downloadButton = ui.Button(
    {label: 'Download ❯', style: {margin: '0px 0px 0px 0px', width: '72px'}});

// Панель для размещения кнопок «About», «Options» и «Download».
var buttonPanel = ui.Panel(
    [infoButton, controlButton, downloadButton],
    ui.Panel.Layout.Flow('horizontal'),
    {stretch: 'horizontal', margin: '0px 0px 0px 0px'});

var coordZoom = ui.Textbox({placeholder:'Координаты', value:'37.63135958, 55.67095556', style:{width:'180px'}});
var coordZoomDa = ui.Button({label: 'Zoom 📸' , style: {margin: '0px 0px 0px -16px', width:'70px'}});

var ZoomSlider = ui.Slider({min: 6, max: 18, value: 15,
    step: 2, style: {stretch: 'horizontal', margin: '5px 0px 0px 10px', width:'120px'}});

// Создаём панель для виджетов быстрого масштабирования (правый нижний угол).
var panel = ui.Panel({
    widgets: [coordZoom],
    layout: ui.Panel.Layout.flow('vertical'),
    style: {width: '200px', position: 'bottom-right'}
});

var panel2 = ui.Panel({
    widgets: [ZoomSlider, coordZoomDa],
    layout: ui.Panel.Layout.flow('horizontal')
});

panel.add(panel2)

// Заголовок секции «Options».
var optionsLabel = ui.Label('Options', sectionFont);
optionsLabel.style().set('margin', '16px 8px 2px 8px');

// Заголовок секции «About».
var infoLabel = ui.Label('About', sectionFont);

// Заголовок секции «Download».
var downloadLabel = ui.Label('Download', sectionFont);

// Текст с описанием приложения для панели About
var aboutLabel = ui.Label(
    'Satellite Imagery Explorer\n' +
    '\n' +
    'Interactive web app for exploring multi-temporal satellite imagery from Sentinel-2 and Landsat-8/9.\n' +
    'Built on Google Earth Engine to quickly inspect locations, compare dates and export ready-to-use image chips.\n' +
    '\n' +
    'Key features:\n' +
    '\u2022 Multi-sensor support (Sentinel-2 & Landsat-8/9 SR/TOA)\n' +
    '\u2022 Flexible RGB band combinations\n' +
    '\u2022 Cloud filtering and custom date range\n' +
    '\u2022 Interactive image chips with AOI overlay\n' +
    '\u2022 Layer manager for temporal comparison\n' +
    '\u2022 Export for ML / GIS workflows (GeoTIFF / TFRecord) \n' +
    '\n' +
    'How to use:\n\n' +
    ' 1. Choose sensors, RGB preset and filters in the Options panel.\n' +
    '2. Click any point on the map to load available scenes.\n' +
    '3. Scroll through image chips and add selected dates to the map.\n' +
    '4. Use the Download panel to collect links for batch saving.\n'
);

// Выбор источников данных (несколько сразу через чекбоксы).
var sensorLabel = ui.Label({value: 'Sensor selection', style: headerFont});
var sensorList = ['Sentinel-2 SR', 'Sentinel-2 TOA', 'Landsat-8/9 SR', 'Landsat-8/9 TOA'];
// Инициализация из параметра URL 'sensors' (pipe-separated). Фолбэк — 'sensor'.
var initialSensorsParam = ui.url.get('sensors');
var initialSensors = initialSensorsParam ? initialSensorsParam.split('|') : [ui.url.get('sensor')];
var sensorCheckboxes = sensorList.map(function (name) {
    var initialSelected = initialSensors.indexOf(name) !== -1;
    return ui.Checkbox({label: name, value: initialSelected, style: {margin: '0 0 0 0'}});
});
// Подпишем чекбоксы на общий обработчик изменений
sensorCheckboxes.forEach(function (cb) {
    cb.onChange(optionChange);
});

var sensorPanel = ui.Panel([sensorLabel].concat(sensorCheckboxes), null, {stretch: 'horizontal'});

// Выбор комбинации каналов для RGB-визуализации.
var rgbLabel = ui.Label({value: 'RGB visualization', style: headerFont});
var rgbList = ['SWIR1/NIR/GREEN', 'RED/GREEN/BLUE', 'NIR/RED/GREEN',
    'NIR/SWIR1/RED'];
var rgbSelect = ui.Select({
    items: rgbList, placeholder: ui.url.get('rgb'),
    value: ui.url.get('rgb'), style: {stretch: 'horizontal'}
});
var rgbPanel = ui.Panel([rgbLabel, rgbSelect], null, {stretch: 'horizontal'});

// Выбор периода съёмки.
var durationLabel = ui.Label(
    {value: 'Period', style: headerFont});

var d2 = ee.Date(Date.now()).advance(1, 'day').format('YYYY-MM-dd').getInfo();
var d1 = ee.Date(d2).advance(-1, 'year').format('YYYY-MM-dd').getInfo();
var txtbox1 = ui.Textbox({placeholder:'date1', value: d1, style:{width:'90px'}})
var txtbox2 = ui.Textbox({placeholder:'date2', value: d2, style:{width:'90px'}});
var aaa = ui.Panel([txtbox1, txtbox2], ui.Panel.Layout.flow('horizontal'));

var durationPanel = ui.Panel(
    [durationLabel, txtbox1, txtbox2],
    ui.Panel.Layout.flow('horizontal'), {stretch: 'horizontal'});

// Порог облачности: фильтрует снимки с облачностью выше указанной величины.
var cloudLabel = ui.Label(
    {value: 'Cloud threshold % (exclude >)', style: headerFont});
var cloudSlider = ui.Slider({
    min: 0, max: 100 , value: parseInt(ui.url.get('cloud')),
    step: 1, style: {stretch: 'horizontal'}
});
var cloudPanel = ui.Panel(
    [cloudLabel, cloudSlider], null, {stretch: 'horizontal'});

// Размер чипа (ширина области для предпросмотра и экспорта), км.
var regionWidthLabel = ui.Label(
    {value: 'Image chip width (km)', style: headerFont});
var regionWidthSlider = ui.Slider({
    min: 10, max: 160 , value: parseInt(ui.url.get('chipwidth')),
    step: 10, style: {stretch: 'horizontal'}
});
var regionWidthPanel = ui.Panel(
    [regionWidthLabel, regionWidthSlider], null, {stretch: 'horizontal'});

// Выбор формата экспорта
var formatLabel = ui.Label({value: 'Export format', style: headerFont});
var formatList = ['GEO_TIFF', 'TFRecord'];
var formatSelect = ui.Select({
    items: formatList,
    placeholder: formatUrl,
    value: formatUrl,
    style: {stretch: 'horizontal'}
});
var formatPanel = ui.Panel([formatLabel, formatSelect], null, {stretch: 'horizontal'});

// Контроль сжатия TIFF файлов
var compressionLabel = ui.Label({value: 'TIFF compression', style: headerFont});
var compressionCheckbox = ui.Checkbox({
    label: 'Enable compression (smaller files)',
    value: compressionUrl === 'true',
    style: {margin: '0 0 0 0'}
});
var compressionPanel = ui.Panel([compressionLabel, compressionCheckbox], null, {stretch: 'horizontal'});

// Сообщение о загрузке, чтобы пользователь видел, что идёт обработка.
var waitMsgImgPanel = ui.Label({
    value: '⚙️' + ' Processing, please wait...',
    style: {
        stretch: 'horizontal',
        textAlign: 'center',
        backgroundColor: '#d3d3d3'
    }
});

// Панель для графиков (резерв; сейчас не используется).
var chartPanel = ui.Panel({style: {height: '25%'}});

// Панель-контейнер для карточек изображений (миниатюр).
var imgCardPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('horizontal', true),
    style: {width: '897px', backgroundColor: '#d3d3d3'}
});

var emptyImagePanelLabel = ui.Label({
    value: 'Adjust the options and click on the map to upload images \n\Select a location and the images will appear here \n\The list of links for downloading images is located on the left panel in the "Download" section',
    style: {
        fontSize: '14px',
        color: '#888',
        textAlign: 'center',
        padding: '40px 20px',
        fontStyle: 'italic',
        whiteSpace: 'pre'
    }
});

imgCardPanel.add(emptyImagePanelLabel);

// Виджет карты.
var map = ui.Map();

// Сплит-панель: карта + панель миниатюр.
var splitPanel = ui.SplitPanel(map, imgCardPanel);

// Кнопка подтверждения изменений (показывается после любых правок).
var submitButton = ui.Button({
    label: 'Submit changes',
    style: {stretch: 'horizontal', shown: false}
});



// ================================================================================
// ‖                    НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ УПРАВЛЕНИЯ СЛОЯМИ                    ‖
// ================================================================================

// Хранилище для слоев карты: ключ - ID слоя, значение - объект {layer, checkbox, visible}
var mapLayers = {};

// Панель для управления слоями (будет справа) - ширина как у zoom панели
var layersPanel = ui.Panel({
    style: {
        position: 'top-right',
        width: '200px', // Такая же ширина как у zoom панели
        maxHeight: '70%',
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ccc',
        shown: true
    }
});

// Заголовок панели слоев
var layersTitle = ui.Label({
    value: 'Map Layers',
    style: {fontSize: '16px', fontWeight: 'bold', margin: '0px 0px 10px 0px'}
});
layersPanel.add(layersTitle);

// Контейнер для списка слоев
var layersListPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical'),
    style: {maxHeight: '400px'}
});
layersPanel.add(layersListPanel);

// Кнопка очистки всех слоев
var clearLayersButton = ui.Button({
    label: 'Clear all layers',
    style: {margin: '10px 0px 0px 0px', stretch: 'horizontal'}
});
layersPanel.add(clearLayersButton);



// ================================================================================
// ‖                     ПЕРЕМЕННЫЕ ДЛЯ УПРАВЛЕНИЯ ЗАГРУЗК АМИ                    ‖
// ================================================================================

// Панель для списка загрузок
var downloadsListPanel = ui.Panel({
    layout: ui.Panel.Layout.flow('vertical'),
    style: {maxHeight: '400px'}
});

// Информация о загрузках
var downloadsInfoLabel = ui.Label({
    value: 'Click "Download" on image cards to add files here',
    style: {fontSize: '11px', color: '#666', margin: '10px 0px', fontStyle: 'italic'}
});



// ================================================================================
// ‖                   ФУНКЦИИ ДЛЯ СОКРАЩЕНИЯ НАЗВАНИЙ СЕНСОРОВ                   ‖
// ================================================================================

/**
 * Сокращает название сенсора для отображения
 */
function shortenSensorName(sensorName) {
    var nameMap = {
        'Sentinel-2 SR': 'S2 SR',
        'Sentinel-2 TOA': 'S2 TOA',
        'Landsat-8/9 SR': 'L8/9 SR',
        'Landsat-8/9 TOA': 'L8/9 TOA'
    };
    return nameMap[sensorName] || sensorName;
}

/**
 * Сокращает название сенсора для имени файла
 */
function shortenSensorNameForFile(sensorName) {
    var nameMap = {
        'Sentinel-2 SR': 'S2_SR',
        'Sentinel-2 TOA': 'S2_TOA',
        'Landsat-8/9 SR': 'L89_SR',
        'Landsat-8/9 TOA': 'L89_TOA'
    };
    return nameMap[sensorName] || sensorName.replace(/[^a-zA-Z0-9]/g, '_');
}



// ================================================================================
// ‖                             НАСТРОЙКИ ПРИЛОЖЕНИЯ                             ‖
// ================================================================================

// Цвет и состояние для отображения выбранной точки/окружности на карте и превью.
var AOI_COLOR = 'ffffff';  //'b300b3';

var COORDS = null;
var CLICKED = false;

// Справочник по источникам: ID коллекции, рекомендуемый масштаб, радиус AOI,
// пресеты визуализации для разных RGB-комбинаций.
var sensorInfo = {
    'Landsat-8/9 SR': {
        id: 'LANDSAT/LC08/C02/T1_L2',
        scale: 30,
        aoiRadius: 45,
        rgb: {
            'SWIR1/NIR/GREEN': {
                bands: ['SR_B6', 'SR_B5', 'SR_B3'],
                min: [0.01, 0.01 , 0.01],
                max: [0.47, 0.47, 0.47],
                gamma: [1, 1, 1]
            },
            'RED/GREEN/BLUE': {
                bands: ['SR_B4', 'SR_B3', 'SR_B2'],
                min: [0.05, 0.05, 0.05],
                max: [0.25, 0.25, 0.25],
                gamma: [1.3, 1.3, 1.3]
            },
            'NIR/RED/GREEN': {
                bands: ['SR_B5', 'SR_B4', 'SR_B3'],
                min: [0.01, 0.01, 0.01],
                max: [0.47, 0.47, 0.47],
                gamma: [1, 1, 1]
            },
            'NIR/SWIR1/RED': {
                bands: ['SR_B5', 'SR_B6', 'SR_B3'],
                min: [0.01, 0.01, 0.01],
                max: [0.47, 0.47, 0.47],
                gamma: [1, 1, 1]
            }
        }
    },
    'Landsat-8/9 TOA': {
        id: 'LANDSAT/LC08/C02/T1_TOA',
        scale: 30,
        aoiRadius: 45,
        rgb: {
            'SWIR1/NIR/GREEN': {
                bands: ['B6', 'B5', 'B3'],
                min: [0.01, 0.01 , 0.01],
                max: [0.47, 0.47, 0.47],
                gamma: [1, 1, 1]
            },
            'RED/GREEN/BLUE': {
                bands: ['B4', 'B3', 'B2'],
                min: [0.01, 0.01, 0.01],
                max: [0.25, 0.25, 0.25],
                gamma: [1.3, 1.3, 1.3]
            },
            'NIR/RED/GREEN': {
                bands: ['B5', 'B4', 'B3'],
                min: [0.01, 0.01 , 0.01],
                max: [0.47, 0.47, 0.47],
                gamma: [1, 1, 1]
            },
            'NIR/SWIR1/RED': {
                bands: ['B5', 'B6', 'B3'],
                min: [0.01, 0.01 , 0.01],
                max: [0.47, 0.47, 0.47],
                gamma: [1, 1, 1]
            }
        }
    },
    'Sentinel-2 SR': {
        id: 'COPERNICUS/S2_SR_HARMONIZED',
        scale: 20,
        aoiRadius: 30,
        rgb: {
            'SWIR1/NIR/GREEN': {
                bands: ['B11', 'B8', 'B3'],
                min: [100, 100 , 100],
                max: [4700, 4700, 4700],
                gamma: [1, 1, 1]
            },
            'RED/GREEN/BLUE': {
                bands: ['B4', 'B3', 'B2'],
                min: [100, 100, 100],
                max: [2500, 2500, 2500],
                gamma: [1.3, 1.3, 1.3]
            },
            'NIR/RED/GREEN': {
                bands: ['B8', 'B4', 'B3'],
                min: [100, 100 , 100],
                max: [4700, 4700, 4700],
                gamma: [1, 1, 1]
            },
            'NIR/SWIR1/RED': {
                bands: ['B8', 'B11', 'B3'],
                min: [100, 100 , 100],
                max: [4700, 4700, 4700],
                gamma: [1, 1, 1]
            }
        }
    },
    'Sentinel-2 TOA': {
        id: 'COPERNICUS/S2_HARMONIZED',
        scale: 20,
        aoiRadius: 30,
        rgb: {
            'SWIR1/NIR/GREEN': {
                bands: ['B11', 'B8', 'B3'],
                min: [100, 100 , 100],
                max: [4700, 4700, 4700],
                gamma: [1, 1, 1]
            },
            'RED/GREEN/BLUE': {
                bands: ['B4', 'B3', 'B2'],
                min: [100, 100, 100],
                max: [2500, 2500, 2500],
                gamma: [1.2, 1.2, 1.2]
            },
            'NIR/RED/GREEN': {
                bands: ['B8', 'B4', 'B3'],
                min: [100, 100 , 100],
                max: [4700, 4700, 4700],
                gamma: [1, 1, 1]
            },
            'NIR/SWIR1/RED': {
                bands: ['B8', 'B11', 'B3'],
                min: [100, 100 , 100],
                max: [4700, 4700, 4700],
                gamma: [1, 1, 1]
            }
        }
    }
};



// ================================================================================
// ‖                                    ФУНКЦИИ                                   ‖
// ================================================================================

/**
 * Подготовка снимков Landsat 8/9 Level-2 (SR):
 *  - Перевод оптических каналов SR_B* в отражательную способность (масштабный коэффициент);
 *  - Добавление свойства "date" (YYYY-MM-DD).
 */
function prepOliSr(img) {
    var opticalBands = img.select('SR_B.').multiply(0.0000275).add(-0.2);
    img = img.addBands(opticalBands, null, true);
    return addDate(img);
}

/**
 * Подготовка снимков Landsat 8/9 TOA (минимальная):при
 *  - Добавляется только свойство "date" для единообразия обработки.
 */
function prepOliToa(img) {
    return addDate(img);
}

/**
 * Добавляет в изображение строковое свойство "date" (YYYY-MM-DD),
 * чтобы удобно агрегировать и отображать по датам.
 */
function addDate(img) {
    var date = img.date().format('YYYY-MM-dd');
    return img.set('date', date);
}

/**
 * Собирает коллекцию Landsat 8/9 для заданного AOI и периода.
 * Дополнительно:
 *  - Для SR (L2) вычисляет долю облачных пикселей внутри AOI по битам QA_PIXEL:
 *      bit1 — "Dilated Cloud", bit2 — "Cirrus", bit3 — "Cloud".
 *    Итог: mask = dilated OR cirrus OR cloud;
 *    cloudiness = mean(mask) по AOI (доля от 0 до 1).
 *  - Фильтрует снимки по слайдеру порога облачности (проценты → доля).
 *  - Для TOA — используем сценовый метаданный CLOUD_COVER.
 */
function getLandsatCollection(aoi, startDate, endDate, cloudthresh, id) {
    var id8 = id;
    var id9 = id.replace('LC08', 'LC09');

    var oli8Col = ee.ImageCollection(id8)
        .filterBounds(aoi)
        .filterDate(startDate, endDate);
    var oli9Col = ee.ImageCollection(id9)
        .filterBounds(aoi)
        .filterDate(startDate, endDate);
    var oliCol = oli8Col.merge(oli9Col).sort('system:time_start');

    var isToa = (id8 === 'LANDSAT/LC08/C02/T1_TOA');
    oliCol = isToa ? oliCol.map(prepOliToa) : oliCol.map(prepOliSr);

    if (!isToa) {
        // Для L2 SR считаем долю облачных пикселей в AOI по QA_PIXEL
        oliCol = oliCol.map(function (img) {
            var qa = img.select('QA_PIXEL');
            // Биты: 1 — расширенная облачность, 2 — перистые облака (cirrus), 3 — облака
            var dilated = qa.bitwiseAnd(1 << 1).neq(0);
            var cirrus = qa.bitwiseAnd(1 << 2).neq(0);
            var cloud = qa.bitwiseAnd(1 << 3).neq(0);
            var mask = dilated.or(cirrus).or(cloud).rename('cloud');
            var cloudiness = mask.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: aoi,
                scale: 30,
                maxPixels: 1e12
            }).get('cloud');
            return img.set('cloud', cloudiness);
        })
            // Фильтрация по порогу облачности внутри AOI (слайдер в процентах)
            .filter(ee.Filter.lt('cloud', ee.Number(cloudthresh).divide(100)));
    } else {
        // Для TOA — используем сценовый CLOUD_COVER, т.к. QA_PIXEL недоступен
        oliCol = oliCol.filter(ee.Filter.lt('CLOUD_COVER', cloudthresh));
    }

    return oliCol;
}

/**
 * Сборка коллекции Sentinel‑2 (SR/TOA) с использованием Cloud Score+:
 *  - Для каждого дня строится медианный композит (если данных нет — пропуск);
 *  - Через linkCollection подмешивается полоса 'cs' (Cloud Score+, 0..1);
 *  - Считаем среднее по AOI Cloud Score+ как долю облачности.
 *  - Фильтруем по порогу (проценты → доля 0..1).
 */
function getS2SrCldCol(aoi, startDate, endDate, cloudthresh, id) {
    var date_start = ee.Date(startDate);
    var date_end   = ee.Date(endDate);

    var nDays = date_end.difference(date_start, 'days');
    var dayOffsets = ee.List.sequence(0, nDays.subtract(1));

    // ИСПРАВЛЕНИЕ: Правильное создание ImageCollection
    // Подбираем корректный Cloud Score+ датасет под тип входной коллекции (SR vs TOA)
    var csDatasetId = 'GOOGLE/CLOUD_SCORE_PLUS/V1/S2_HARMONIZED';
    var s2SrCol = ee.ImageCollection.fromImages(
        dayOffsets.map(function (dayOffset) {
            var dayStart = date_start.advance(dayOffset, 'days');
            var dayFinish = dayStart.advance(1, 'days');

            var dailyCol = ee.ImageCollection(id)
                .filterBounds(aoi)
                .filterDate(dayStart, dayFinish);

            var dailyColWithCloudScore = dailyCol.linkCollection(
                ee.ImageCollection(csDatasetId),
                ['cs']
            );

            var composite = dailyColWithCloudScore.median();

            return composite
                .set('system:time_start', dayStart.millis())
                .set('date', dayStart.format('YYYY-MM-dd'));
        })
    );

    s2SrCol = s2SrCol
        .filter(ee.Filter.notNull(['system:time_start']))
        .map(function (image) {
            // Если бэнд 'cs' отсутствует, не считаем облачность для этого дня
            var hasCs = image.bandNames().contains('cs');
            var csMean = ee.Algorithms.If(
                hasCs,
                image.select('cs').reduceRegion({
                    reducer: ee.Reducer.mean(),
                    geometry: aoi,
                    scale: 20,
                    maxPixels: 1e12
                }).get('cs'),
                null
            );
            // Нормализуем Cloud Score+ к 0..100 и инвертируем к облачности (100 - clear%)
            var csNorm = ee.Algorithms.If(
                ee.Algorithms.IsEqual(csMean, null),
                null,
                ee.Algorithms.If(
                    ee.Number(csMean).lte(1),
                    ee.Number(csMean).multiply(100),
                    ee.Number(csMean)
                )
            );
            var cloudPct = ee.Algorithms.If(
                ee.Algorithms.IsEqual(csNorm, null),
                null,
                ee.Number(100).subtract(ee.Number(csNorm))
            );
            return image.set('cloud', cloudPct);
        })
        .filter(ee.Filter.notNull(['cloud']))
        .filter(ee.Filter.lt('cloud', ee.Number(cloudthresh)))
        .sort('system:time_start');

    return s2SrCol;
}

/**
 * Очищает панель миниатюр.
 */
function clearImgs() {
    imgCardPanel.clear();
}

/**
 * Добавляет ссылку для скачивания в панель загрузок
 */
function addDownloadLink(url, filename, date, sensorName) {
    // Создаем панель для элемента загрузки
    var downloadItemPanel = ui.Panel({
        layout: ui.Panel.Layout.flow('vertical'),
        style: {padding: '5px', backgroundColor: '#f9f9f9', margin: '2px 0px', border: '1px solid #ddd'}
    });

    var fileInfo = ui.Label({
        value: date + ' - ' + shortenSensorName(sensorName),
        style: {fontSize: '11px', fontWeight: 'bold', margin: '0px 0px 2px 0px'}
    });

    var fileName = ui.Label({
        value: filename,
        style: {fontSize: '10px', color: '#666', margin: '0px 0px 5px 0px'}
    });

    var downloadLink = ui.Label({
        value: '⬇️ Download',
        style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#4CAF50',
            padding: '5px',
            margin: '0px 0px 0px 0px',
            textAlign: 'center',
            border: '1px solid #45a049'
        },
        targetUrl: url
    });

    var removeButton = ui.Button({
        label: 'Remove',
        style: {margin: '5px 0px 0px 0px', fontSize: '10px', padding: '2px'}
    });

    removeButton.onClick(function() {
        downloadsListPanel.remove(downloadItemPanel);
        // Показываем информационное сообщение, если список пуст
        if (downloadsListPanel.widgets().length === 0) {
            downloadsListPanel.add(downloadsInfoLabel);
        }
    });

    downloadItemPanel.add(fileInfo);
    downloadItemPanel.add(fileName);
    downloadItemPanel.add(downloadLink);
    downloadItemPanel.add(removeButton);

    // Убираем информационное сообщение при добавлении первой загрузки
    // Проверяем есть ли информационное сообщение в панели
    var hasInfoLabel = false;
    var widgets = downloadsListPanel.widgets();
    for (var i = 0; i < widgets.length; i++) {
        if (widgets.get(i) === downloadsInfoLabel) {
            hasInfoLabel = true;
            break;
        }
    }

    if (hasInfoLabel) {
        downloadsListPanel.remove(downloadsInfoLabel);
    }

    downloadsListPanel.add(downloadItemPanel);
}



// ================================================================================
// ‖                     НОВЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ СЛОЯМИ                      ‖
// ================================================================================

/**
 * Добавляет слой на карту и создает элемент управления в панели слоев
 */
function addLayerToMap(imageData, aoiBox, cardCheckbox) {
    var date = imageData.date;
    var sensorName = imageData.sensorName;
    var img = imageData.image;
    var visParams = imageData.visParams;

    // Создаем уникальный ID для слоя
    var layerId = date + '_' + shortenSensorNameForFile(sensorName);

    // Если слой уже существует, сначала удаляем его
    if (mapLayers[layerId]) {
        removeLayerFromMap(layerId);
    }

    // Создаем визуализированное изображение для отображения на карте
    var visualizedImage = img.visualize(visParams).clip(aoiBox.bounds());

    // Добавляем слой на карту
    map.addLayer(visualizedImage, {}, layerId);

    // Получаем добавленный слой (последний добавленный)
    var layers = map.layers();
    var layer = layers.get(layers.length() - 1);

    // Создаем чекбокс для управления видимостью слоя
    var layerCheckbox = ui.Checkbox({
        label: date + ' (' + shortenSensorName(sensorName) + ')',
        value: true,
        style: {margin: '2px 0px', fontSize: '12px'}
    });

    // Создаем кнопку удаления слоя
    var removeButton = ui.Button({
        label: '❌',
        style: {margin: '0px 0px 0px 5px', width: '20px', height: '20px'}
    });

    // Панель для элемента слоя
    var layerItemPanel = ui.Panel({
        widgets: [layerCheckbox, removeButton],
        layout: ui.Panel.Layout.flow('horizontal'),
        style: {padding: '2px 5px', backgroundColor: '#f5f5f5', margin: '1px 0px'}
    });

    // Сохраняем информацию о слое (теперь храним изображение и параметры для повторного добавления)
    mapLayers[layerId] = {
        layer: layer,
        image: visualizedImage,
        visParams: {},
        checkbox: layerCheckbox,
        cardCheckbox: cardCheckbox, // Сохраняем ссылку на чекбокс карточки
        visible: true,
        layerItem: layerItemPanel,
        layerId: layerId
    };

    // Добавляем элемент в список слоев
    layersListPanel.add(layerItemPanel);

    // Обработчики событий
    layerCheckbox.onChange(function(checked) {
        toggleLayerVisibility(layerId, checked);
    });

    removeButton.onClick(function() {
        removeLayerFromMap(layerId);
    });
}

/**
 * Переключает видимость слоя на карте
 */
function toggleLayerVisibility(layerId, visible) {
    if (mapLayers[layerId]) {
        var layerData = mapLayers[layerId];
        layerData.visible = visible;

        if (visible) {
            // Добавляем слой заново с теми же параметрами
            map.addLayer(layerData.image, {}, layerData.layerId);
            // Обновляем ссылку на слой
            var layers = map.layers();
            layerData.layer = layers.get(layers.length() - 1);
        } else {
            // Удаляем слой с карты
            map.layers().remove(layerData.layer);
        }
    }
}

/**
 * Удаляет слой с карты и из панели управления
 */
function removeLayerFromMap(layerId) {
    if (mapLayers[layerId]) {
        var layerData = mapLayers[layerId];

        // Удаляем слой с карты (если он видим)
        if (layerData.visible) {
            map.layers().remove(layerData.layer);
        }

        // Синхронизируем чекбокс на карточке
        if (layerData.cardCheckbox) {
            layerData.cardCheckbox.setValue(false);
        }

        // Удаляем элемент из панели слоев
        layersListPanel.remove(layerData.layerItem);

        // Удаляем из хранилища
        delete mapLayers[layerId];
    }
}

/**
 * Очищает все слои с карты и из панели управления
 */
function clearAllLayers() {
    // Создаем копию ключей, так как мы будем удалять элементы из mapLayers
    var layerIds = Object.keys(mapLayers);

    layerIds.forEach(function(layerId) {
        removeLayerFromMap(layerId);
    });
}

/**
 * Рендерит миниатюры (image chips) для всех источников данных одновременно:
 *  - Объединяет все снимки из разных источников
 *  - Сортирует их по датам
 *  - Отображает карточки с указанием источника и даты
 */
function displayBrowseImg(collectionsData, aoiBox, aoiCircle) {
    // Показываем индикатор загрузки
    var waitLabel = ui.Label({
        value: '⚙️' + ' Processing, please wait...',
        style: {
            stretch: 'horizontal',
            textAlign: 'center',
            backgroundColor: '#d3d3d3'
        }
    });
    imgCardPanel.add(waitLabel);

    // Массив для хранения всех данных о снимках из всех источников
    var allImageData = [];
    var processedSensors = 0;
    var totalSensors = collectionsData.length;

    // Обрабатываем каждый источник данных
    collectionsData.forEach(function (sensorData) {
        var col = sensorData.collection;
        var sensorName = sensorData.sensorName;
        var baseSensorName = String(sensorName).split(' - ')[0];
        var visParams = sensorInfo[baseSensorName]['rgb'][rgbSelect.getValue()];

        // Получаем уникальные даты из коллекции
        var dates = col.aggregate_array('date').distinct().sort();

        dates.evaluate(function (dates) {
            if (dates && Array.isArray(dates)) {
                dates.forEach(function (date) {
                    // Композит за конкретную дату
                    var img = col.filter(ee.Filter.eq('date', date)).median();

                    allImageData.push({
                        date: date,
                        sensorName: sensorName,
                        image: img,
                        visParams: visParams
                    });
                });
            }

            processedSensors++;

            // Когда все источники обработаны, отображаем карточки
            if (processedSensors === totalSensors) {
                displaySortedImages(allImageData, aoiBox, aoiCircle, waitLabel);
            }
        });
    });
}

/**
 * Отображает отсортированные по датам карточки снимков из всех источников
 */
function displaySortedImages(allImageData, aoiBox, aoiCircle, waitLabel) {
    // Скрываем индикатор загрузки
    waitLabel.style().set('shown', false);

    // Сортируем все снимки по датам
    allImageData.sort(function (a, b) {
        return a.date.localeCompare(b.date);
    });

    // Отображаем карточки для каждого снимка
    allImageData.forEach(function (imageData) {
        var img = imageData.image;
        var date = imageData.date;
        var sensorName = imageData.sensorName;
        var visParams = imageData.visParams;
        var baseSensorName = String(sensorName).split(' - ')[0];
        var scale = sensorInfo[baseSensorName]['scale'];

        var exp_im = img.visualize(visParams).clip(aoiBox.bounds());
        var dateNow = Date.now();

        var aoiImg = ee.Image().byte()
            .paint(aoiCircle, 1, 2)
            .visualize({palette: 'ff0000'});

        var thumbnail = ui.Thumbnail({
            image: img.visualize(visParams).blend(aoiImg),
            params: {region: aoiBox, dimensions: '200', crs: 'EPSG:3857', format: 'PNG'}
        });

        // ЧЕКБОКС ДЛЯ ДОБАВЛЕНИЯ НА КАРТУ
        var addToMapCheckbox = ui.Checkbox({
            label: 'Add to map',
            value: false,
            style: {margin: '2px 0px', fontSize: '10px'}
        });

        // Обработчик изменения чекбокса
        addToMapCheckbox.onChange(function(checked) {
            if (checked) {
                addLayerToMap(imageData, aoiBox, addToMapCheckbox);
            } else {
                var layerId = date + '_' + shortenSensorNameForFile(sensorName);
                removeLayerFromMap(layerId);
            }
        });

        // Кнопка скачивания TIFF на локальный компьютер
        var downloadButtonLabel = date + ' (' + shortenSensorName(sensorName) + ') - Download';
        var downloadButton = ui.Button(downloadButtonLabel, null, false, {fontSize: '9px', margin: '1px'});
        downloadButton.onClick(function () {
            var chipWidthKm = regionWidthSlider.getValue();
            var selectedFormat = formatSelect.getValue();

            // Автоматически скачиваем RGB визуализацию
            exp_im.getDownloadURL({
                name: date + '_' + shortenSensorNameForFile(sensorName) + '_rgb',
                region: aoiBox,
                scale: 10, // Принудительно используем высокое разрешение 10м
                filePerBand: false,
                format: selectedFormat,
                maxPixels: 1e13,   // Значительно увеличиваем лимит пикселей
                formatOptions: {
                    cloudOptimized: true,  // Оптимизация для облачного хранения
                    compressed: compressionCheckbox.getValue()  // Сжатие по состоянию чекбокса
                }
            }, function (url) {
                // Создаем имя файла
                var filename = date + '_' + shortenSensorNameForFile(sensorName) + '_rgb.' +
                    (selectedFormat === 'GEO_TIFF' ? 'tif' : 'tfrecord');

                // Добавляем ссылку в панель загрузок
                addDownloadLink(url, filename, date, sensorName);
            });
        });

        // Создаем панель для кнопок и чекбокса
        var topPanel = ui.Panel([addToMapCheckbox], ui.Panel.Layout.flow('horizontal'), {stretch: 'horizontal'});
        var buttonPanel = ui.Panel([downloadButton], ui.Panel.Layout.flow('horizontal'), {stretch: 'horizontal'});

        var imgCard = ui.Panel([
            topPanel,
            buttonPanel,
            thumbnail,
        ], null, {margin: '4px 0px 0px 4px', width: 'px'});

        imgCardPanel.add(imgCard);
    });
}

/**
 * Основной рендер:
 *  - Читает выбранные сенсоры, период, порог облачности;
 *  - Строит AOI (круг) и «ящик» для чипов;
 *  - Собирает коллекции по каждому сенсору и выводит миниатюры в объединенном виде.
 */
function renderGraphics(coords) {
    // Определяем выбранные сенсоры; если ничего не выбрано, используем дефолтный из URL
    var selectedSensors = getSelectedSensors();
    if (selectedSensors.length === 0) {
        selectedSensors = [ui.url.get('sensor')];
    }

    // Получаем точку клика и создаем буферы
    var point = ee.Geometry.Point(coords);
    // Используем первый выбранный сенсор для радиуса AOI круга, просто для отрисовки наложения
    var firstSensor = selectedSensors[0];
    var aoiCircle = point.buffer(sensorInfo[firstSensor]['aoiRadius']);
    var aoiBox = point.buffer(regionWidthSlider.getValue()*1000/2);

    // Очищаем слои карты безопасно (не итерируясь по изменяемой коллекции)
    function clearMapLayers() {
        while (map.layers().length() > 0) {
            map.layers().remove(map.layers().get(0));
        }
    }

    clearMapLayers();

    // Добавляем новую точку на карту
    map.addLayer(aoiCircle, {color: AOI_COLOR});
    map.centerObject(aoiCircle, 14);

    // Получаем параметры коллекций
    var cloudThresh = cloudSlider.getValue();
    var startDate = txtbox1.getValue();
    var endDate = txtbox2.getValue();

    // Полностью очищаем панель миниатюр перед новым рендером
    clearImgs();

    // Для каждого выбранного сенсора формируем коллекцию
    var collectionsData = selectedSensors.map(function (sensor) {
        var datasetId = sensorInfo[sensor]['id'];
        var col;
        if (sensor == 'Sentinel-2 SR' || sensor == 'Sentinel-2 TOA') {
            col = getS2SrCldCol(aoiBox, startDate, endDate, cloudThresh, datasetId);
        } else if (sensor == 'Landsat-8/9 SR' || sensor == 'Landsat-8/9 TOA') {
            col = getLandsatCollection(aoiBox, startDate, endDate, cloudThresh, datasetId);
        }
        col = ee.ImageCollection(col.distinct('date')).sort('system:time_start');
        return {
            collection: col,
            sensorName: sensor
        };
    });

    // Отображаем объединенные и отсортированные по датам миниатюры из всех источников
    displayBrowseImg(collectionsData, aoiBox, aoiCircle);
}

/**
 * Обработчик клика по карте: запоминаем координаты, обновляем URL и перерисовываем.
 */
function handleMapClick(coords) {
    CLICKED = true;
    COORDS = [coords.lon, coords.lat];
    ui.url.set('run', 'true');
    ui.url.set('lon', COORDS[0]);
    ui.url.set('lat', COORDS[1]);
    renderGraphics(COORDS);
}

/**
 * Обработчик кнопки «Submit changes»: перерисовываем чипы и скрываем кнопку.
 */
function handleSubmitClick() {
    renderGraphics(COORDS);
    submitButton.style().set('shown', false);
}

/**
 * Сохраняет текущие параметры UI в URL (для восстановления состояния).
 * Для множества сенсоров параметр сохраняется как строка, разделённая «|».
 */
function setParams() {
    // Persist sensors as a pipe-separated list for simplicity
    var sensorsParam = getSelectedSensors().join('|');
    if (sensorsParam.length > 0) ui.url.set('sensors', sensorsParam);
    ui.url.set('rgb', rgbSelect.getValue());
    ui.url.set('cloud', cloudSlider.getValue());
    ui.url.set('chipwidth', regionWidthSlider.getValue());
    ui.url.set('format', formatSelect.getValue()); // Сохраняем выбранный формат
    ui.url.set('compression', compressionCheckbox.getValue()); // Сохраняем состояние сжатия
}

/**
 * Показывает кнопку «Submit changes» только после того,
 * как пользователь кликнул по карте хотя бы один раз.
 */
function showSubmitButton() {
    if(CLICKED) {
        submitButton.style().set('shown', true);
    }
}

/**
 * Любое изменение опций: показать Submit и обновить URL-параметры.
 */
function optionChange() {
    showSubmitButton();
    setParams();
}

/**
 * Возвращает массив имён сенсоров, отмеченных пользователем.
 */
function getSelectedSensors() {
    // Collect labels of all checked checkboxes
    return sensorCheckboxes
        .filter(function (cb) {
            return cb.getValue();
        })
        .map(function (cb) {
            return cb.getLabel();
        });
}

/**
 * Показ/скрытие панели с опциями (левая панель).
 */
var controlShow = false;
function controlButtonHandler() {
    if(controlShow) {
        controlShow = false;
        controlElements.style().set('shown', false);
        controlButton.setLabel('Options ❯');
    } else {
        controlShow = true;
        controlElements.style().set('shown', true);
        controlButton.setLabel('Options ❮');
    }
}

/**
 * Показ/скрытие панели «About».
 */
var infoShow = false;
function infoButtonHandler() {
    if(infoShow) {
        infoShow = false;
        infoElements.style().set('shown', false);
        infoButton.setLabel('About ❯');
    } else {
        infoShow = true;
        infoElements.style().set('shown', true);
        infoButton.setLabel('About ❮');
    }
}

/**
 * Показ/скрытие панели «Download».
 */
var downloadShow = false;
function downloadButtonHandler() {
    if(downloadShow) {
        downloadShow = false;
        downloadElements.style().set('shown', false);
        downloadButton.setLabel('Download ❯');
    } else {
        downloadShow = true;
        downloadElements.style().set('shown', true);
        downloadButton.setLabel('Download ❮');
    }

    if(infoShow || controlShow || downloadShow) {
        controlPanel.style().set('width', CONTROL_PANEL_WIDTH);
    } else {
        controlPanel.style().set('width', CONTROL_PANEL_WIDTH);
    }
}



// ================================================================================
// ‖                                 ИНИЦИАЛИЗАЦИЯ UI                             ‖
// ================================================================================

infoElements.add(infoLabel);
infoElements.add(aboutLabel);

controlElements.add(optionsLabel);
controlElements.add(sensorPanel);
controlElements.add(rgbPanel);
controlElements.add(durationPanel);
controlElements.add(cloudPanel);
controlElements.add(regionWidthPanel);
controlElements.add(formatPanel); // Добавляем панель выбора формата
controlElements.add(compressionPanel); // Добавляем панель сжатия
controlElements.add(submitButton);

downloadElements.add(downloadLabel);
downloadElements.add(downloadsInfoLabel);
downloadElements.add(downloadsListPanel);

controlPanel.add(buttonPanel);
controlPanel.add(infoElements);
controlPanel.add(controlElements);
controlPanel.add(downloadElements);

map.add(controlPanel);
map.add(panel);
map.add(layersPanel); // Добавляем панель слоев на карту

infoButton.onClick(infoButtonHandler);
controlButton.onClick(controlButtonHandler);
downloadButton.onClick(downloadButtonHandler);
rgbSelect.onChange(optionChange);
txtbox1.onChange(optionChange);
txtbox2.onChange(optionChange);
formatSelect.onChange(optionChange); // Добавляем обработчик изменения формата
cloudSlider.onChange(optionChange);
regionWidthSlider.onChange(optionChange);
compressionCheckbox.onChange(optionChange); // Добавляем обработчик изменения сжатия
submitButton.onClick(handleSubmitClick);
map.onClick(handleMapClick);

// Обработчик кнопки очистки всех слоев
clearLayersButton.onClick(clearAllLayers);

/**
 * Быстрое масштабирование по введённым координатам и уровню зума.
 * Формат поля: "долгота, широта".
 */
function zoomDaDa() {
    var coords = coordZoom.getValue().split(", ");
    if (coords.length === 2) {
        var lon = Number(coords[0]);
        var lat = Number(coords[1]);
        var zoom = parseFloat(ZoomSlider.getValue());
        map.setCenter(lon, lat, zoom);
    }
}

coordZoomDa.onClick(zoomDaDa);
ZoomSlider.onChange(zoomDaDa);
map.style().set('cursor', 'crosshair');
map.setOptions('hybrid');
map.setControlVisibility(
    {layerList: false, fullscreenControl: false, zoomControl: false});

ui.root.clear();
ui.root.add(splitPanel);

// Обработка URL-параметров при запуске приложения: если есть координаты,
// сразу запускаем рендер.
// Автозапуск только при явном run=true
if (ui.url.get('run') === 'true') {
    CLICKED = true;
    COORDS = [ui.url.get('lon'), ui.url.get('lat')];
    renderGraphics(COORDS);
}