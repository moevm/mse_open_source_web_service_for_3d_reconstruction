# Open source веб-сервис для 3D реконструкций

## Аннотация

Данный проект представляет собой open source веб-приложение для 3D реконсрукций. В его основе лежит Meshroom: бесплатное программное обеспечение для 3D-реконструкции с открытым исходным кодом, основанное на платформе AliceVision. AliceVision — это фотограмметрическая платформа компьютерного зрения, которая обеспечивает алгоритмы 3D-реконструкции и отслеживания камеры. AliceVision предлагает мощную программную основу и современные алгоритмы компьютерного зрения, которые можно тестировать, анализировать и повторно использовать. Этот проект является результатом сотрудничества между академическими кругами и промышленностью для обеспечения передовых алгоритмов с надежностью и качеством, необходимыми для использования в производстве

## Запуск с помощью Docker
_(На данный момент запустить контейнеры можно только на Linux)_

Если у Вас нет локально установленного Meshroom, то в /backend/Dockerfile нужно убрать из комментариев следующий строки:

![изображение](https://user-images.githubusercontent.com/54911137/160781355-bb4b875e-57af-4090-acae-844dbfab72e3.png)

Если у Вас есть установленный Meshroom, то перенесите основную папку Meshroom в папку /backend (важно, чтобы название папки было именно "Meshroom")

---

Для запуска Docker в корневой директории проекта выполните команду:

`docker-compose up --build` (или `docker compose up --build`)

Теперь можно открыть проект на http://localhost:3000

Для остановки работы всех контейнеров выполните команду:

`docker-compose down` (или `docker compose down`)

---

Для запуска отдельных контейнеров, добавьте в команды название соответствующего сервиса (db, frontend, backend)

Пример для разработки backend'а:

`docker-compose up frontend db --build` (или `docker compose up frontend db --build`) и локально запустить backend

Пример для разработки frontend'а:

`docker-compose up backend db --build` (или `docker compose up backend db --build`) и локально запустить frontend

## Запуск без Docker

Для локального запуска frontend'а:

1. Копируем директорию frontend и переходим в /frontend
2. Устанавливаем зависимости `npm install`
3. Запускаем `npm start` (откроется на http://localhost:3000)

При разработке использовался Node.js версии 16, поэтому рекомендуется работать с этой версией

---

Для локального запуска db:

Требуется установить локальный сервер PostgreSQL, в проекте используется 14 версия (https://www.postgresql.org/download/)

* Username - postgres
* Password - postgres
* DB name - postgres
* Port - 5432

---

Для локального запуска backend'а:

1. Копируем директорию backend и переходим в /backend
2. Если у Вас есть локально Meshroom, то перенесите его в текущую директорию под названием "Meshroom". Если нет, то введите следующее:
   * `wget https://github.com/alicevision/meshroom/releases/download/v2021.1.0/Meshroom-2021.1.0-linux-cuda10.tar.gz`
   * `tar --totals -xf Meshroom-2021.1.0-linux-cuda10.tar.gz`
   * `rm Meshroom-2021.1.0-linux-cuda10.tar.gz`
   * `mv Meshroom-2021.1.0-av2.4.0-centos7-cuda10.2 Meshroom`
3. Устанавливаем зависимости:
   * `pip install -r requirements.txt`
   * `apt update && apt install -y netcat`
4. Загружаем конфигурацию в бд (делать после каждого изменения структуры бд):
   * `python3 manage.py makemigrations authentication upload`
   * `python3 manage.py migrate`
6. Запускаем backend (по умолчанию http://localhost:8000):
   * `python3 manage.py runserver`

При разработке использовался Python версии 3.10, поэтому рекомендуется работать с этой версией (Python версии <3.8 работать не будет)
