# mse_open_source_web_service_for_3d_reconstruction

## Запуск
_(На данный момент запустить контейнеры можно только на Linux)_

В корневой директории проекта выполните команду:

`docker-compose up --build` (или `docker compose up --build`)

Для локальной разработки backend'а:

1. Запускаем frontend и БД: `docker-compose up frontend db --build`
2. Переходим в директорию `/backend`
3. Запускаем backend (по умолчанию http://localhost:8000):
   * `python3 manage.py makemigrations <список приложений>`
   * `python3 manage.py migrate`
   * `python3 manage.py runserver <ip>:<port>`