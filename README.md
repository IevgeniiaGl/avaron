# AVARON

Статический сайт AVARON на двух языках: румынском (`/ro/`) и русском (`/ru/`). Сборки нет, страницы — обычные HTML-файлы. Сервер — Apache с `.htaccess`.

## Папка `includes/` (серверные вставки)

Страницы подключают файлы из `includes/` через SSI (Server Side Includes) Apache. Папка **не хранится в git** (см. `.gitignore`): её содержимое своё на каждом сервере.

| Файл | Куда вставляется | Формат |
|---|---|---|
| `includes/head.html` | в `<head>` каждой страницы, сразу после `<meta name="viewport">` | HTML: код Google Tag Manager (`<script>`) и других сервисов для `<head>` |
| `includes/body.html` | сразу после `<body>` каждой страницы | HTML: блок `<noscript>` Google Tag Manager и т. п. |
| `includes/site-url.txt` | в canonical, hreflang, Open Graph, Twitter и JSON-LD | адрес сайта без слеша в конце и **без переноса строки** в конце, например `https://avaron.md` |

### Как создать на сервере (один раз)

Создайте папку `includes/` в корне сайта и три файла в ней. Файл с адресом создавайте без переноса строки в конце, например:

```sh
mkdir -p includes
printf 'https://avaron.md' > includes/site-url.txt
printf '<!-- head: GTM -->\n' > includes/head.html
printf '<!-- body: GTM noscript -->\n' > includes/body.html
```

Если в `site-url.txt` окажется перенос строки, он попадёт внутрь всех ссылок и сломает canonical, hreflang и Open Graph.

Если файла `head.html` или `body.html` нет, страница всё равно откроется без ошибки: перед каждой вставкой стоит `<!--#config errmsg="" -->`.

### Важно при заливке по FTP

**Не перезаписывайте и не удаляйте папку `includes/` на сервере.** Её нет в репозитории, поэтому при заливке «зеркалом» она может быть удалена, а при загрузке чужой копии — заменена. Без `site-url.txt` все абсолютные адреса на страницах станут относительными (`/ro/...`).

Прямой доступ к `includes/` из браузера закрыт правилом в `.htaccess` (ответ 403); SSI-вставки при этом работают.

## Требования к серверу

В `.htaccess` включены SSI:

```apache
Options +Includes
AddOutputFilter INCLUDES .html
```

Если хостинг не разрешает менять `Options` через `.htaccess`, сайт будет отвечать ошибкой 500. В этом случае удалите эти две строки и попросите хостинг включить `mod_include` для `.html`.

## Проверка после выкладки

- Откройте исходный код любой страницы: в нём не должно быть `<!--#include`, а вместо них — адрес сайта.
- Откройте `/includes/site-url.txt` в браузере: должен быть ответ 403.
- Проверьте разметку: [Rich Results Test](https://search.google.com/test/rich-results), [Schema Markup Validator](https://validator.schema.org/), [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Карта сайта

`sitemap.xml` содержит все страницы с языковыми альтернативами (hreflang). SSI в `.xml` не работает, поэтому домен в карте сайта прописан явно — при смене домена обновите его и там.
