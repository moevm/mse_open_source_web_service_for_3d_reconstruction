# Open source веб-сервис для 3D реконструкций

## Аннотация

Данный проект представляет собой open source веб-приложение для 3D реконструкций. В его основе лежит Meshroom: бесплатное программное обеспечение для 3D-реконструкции с открытым исходным кодом, основанное на платформе AliceVision. AliceVision — это фотограмметрическая платформа компьютерного зрения, которая обеспечивает алгоритмы 3D-реконструкции и отслеживания камеры. AliceVision предлагает мощную программную основу и современные алгоритмы компьютерного зрения, которые можно тестировать, анализировать и повторно использовать. Этот проект является результатом сотрудничества между академическими кругами и промышленностью для обеспечения передовых алгоритмов с надежностью и качеством, необходимыми для использования в производстве

## Примечание

Команды `docker-compose` и `docker compose` в рамках данной аннотации взаимозаменяемы.

## Запуск проекта в Production-режиме
_(Для каждой команды требуются права суперпользователя)_

Перед запуском рекомендуется удалить имеющиеся docker volumes данного проекта:

```
docker compose -f docker-compose.prod.yml down -v
```

Для запуска Docker в корневой директории проекта выполните команду:

```
docker-compose -f docker-compose.prod.yml up --build
```

Для первого запуска и после каждого удаления docker volumes требуется написать в отдельном терминале (в то время, когда docker уже запущен):

```
docker-compose -f docker-compose.prod.yml exec backend python3 manage.py migrate --no-input
```
```
docker-compose -f docker-compose.prod.yml exec backend python3 manage.py collectstatic --no-input
```
Для создания нового пользователя выполните команду:
```
docker-compose -f docker-compose.prod.yml exec backend python3 manage.py createuser
```
А для создания суперпользователя:
```
docker-compose -f docker-compose.prod.yml exec backend python3 manage.py createsuperuser
```

Теперь можно открыть проект на http://localhost:3000

Для остановки работы всех контейнеров выполните команду:

```
docker-compose -f docker-compose.prod.yml down --remove-orphans
```

## Запуск проекта в Development-режиме

### Запуск с помощью Docker

Если у Вас нет локально установленного Meshroom, то в /backend/Dockerfile нужно убрать из комментариев следующий строки:

![изображение](https://user-images.githubusercontent.com/54911137/160781355-bb4b875e-57af-4090-acae-844dbfab72e3.png)

Если у Вас есть установленный Meshroom, то перенесите основную папку Meshroom в папку /backend (важно, чтобы название папки было именно "Meshroom")

---

Для запуска Docker в корневой директории проекта выполните команду:

```
docker-compose -f docker-compose.dev.yml up --build
```

Теперь можно открыть проект на http://localhost:3000

Для остановки работы всех контейнеров выполните команду:

```
docker-compose -f docker-compose.dev.yml down
```

---

Для запуска отдельных контейнеров, добавьте в команды название соответствующего сервиса (db, frontend, backend)

Пример для разработки backend'а:

```
docker-compose -f docker-compose.dev.yml up frontend db --build
```
Затем можно [локально запустить backend](#локальный-запуск-backend)

Пример для разработки frontend'а:

```
docker-compose -f docker-compose.dev.yml up backend db --build
```
Затем можно [локально запустить frontend](#локальный-запуск-frontend)

### Запуск без Docker

#### Локальный запуск frontend

1. Копируем директорию frontend и переходим в /frontend
2. Устанавливаем зависимости ```npm install```
3. Запускаем ```npm start``` (откроется на http://localhost:3000)

При разработке использовался Node.js версии 16, поэтому рекомендуется работать с этой версией

---

#### Локальный запуск db:

Требуется установить локальный сервер PostgreSQL, в проекте используется 14 версия (https://www.postgresql.org/download/)

* Username - postgres
* Password - postgres
* DB name - postgres
* Port - 5432

---

#### Локальный запуск backend:

1. Копируем директорию backend и переходим в /backend
2. Если у Вас есть локально Meshroom, то перенесите его в текущую директорию под названием "Meshroom". Если нет, то введите следующее:
   ``` 
   wget https://github.com/alicevision/meshroom/releases/download/v2021.1.0/Meshroom-2021.1.0-linux-cuda10.tar.gz
   ```
   ```
   tar --totals -xf Meshroom-2021.1.0-linux-cuda10.tar.gz
   ```
   ```
   rm Meshroom-2021.1.0-linux-cuda10.tar.gz
   ```
   ```
   mv Meshroom-2021.1.0-av2.4.0-centos7-cuda10.2 Meshroom
   ```
3. Устанавливаем зависимости:
   ```
   pip install -r requirements.txt
   ```
   ```
   apt update && apt install -y netcat
   ```
4. При изменении моделей необходимо выполнить команду для передачи изменении в БД:
   ```
   python3 manage.py makemigrations <names_of_apps_where_model_has_changed>
   ```
   Затем необходимо выполнить миграции. Их также нужно выполнять после удаления volume, в котором хранятся данные БД.
   ```
   python3 manage.py migrate
   ```
6. Запускаем backend (по умолчанию http://localhost:8000):
   ```
   python3 manage.py runserver
   ```

При разработке использовался Python версии 3.10, поэтому рекомендуется работать с этой версией (Python версии <3.8 работать не будет)

## Демонстрация работы

Авторизация пользователя:

![authorization](https://user-images.githubusercontent.com/54911137/167158242-e1efbfb6-49be-4ac0-9f77-74ca7333657d.gif)

Загрузка фотографий на сервер:

![choose](https://user-images.githubusercontent.com/54911137/167158284-40968857-da65-4e7f-b897-8ffc6dcee1a3.gif)

Скачивание 3D-объекта(результата работы meshroom на сервере):

![download](https://user-images.githubusercontent.com/54911137/167158358-39e97c5c-91ce-42fa-8474-83ca4f7e4183.gif)

Полный цикл работы приложения на датасете из трех изображений по [ссылке](https://drive.google.com/file/d/1hS83ccNoU1ThuXYxbfVh6diIyp7foyfB/view)
