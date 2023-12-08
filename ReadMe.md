## Endpoints:
```
    Register: [POST] http://localhost:5000/api/registration    data = {email, password}
    Login: [POST] http://localhost:5000/api/login      data = {email, password}
    Logout: [POST] http://localhost:5000/api/logout    data = refresh token from cookie
    Refresh: [GET] http://localhost:5000/api/refresh   data = refresh token from cookie
```

## Start app

```bash
$ npm run dev
```

```
    Register: 
        Під час реєстрації проводиться валідація на відповідність email та також валідується довжина пароля (мінімум 2 символи).
        При виявленні в базі запису з паролем, що вводиться, буде видана помилка що такий користувач існує.
    
    Login:
        Так само як і у методі реєстрації проводитися валідація вхідних даних.
        Якщо дані відповідають, то ведеться пошук облікового запису в базі даних.
        Якщо запис не знайдено, буде повернено помилку, що такого користувача не існує.
        
    Logout: 
        При зверненні до даного ендпойнта буде взято з cookie refresh token і по ньому буде видалено сесію з бази даних.
        
    Refresh:
        При закінченні часу життя токена фронтенд за допомогою інтерцептора перехоплює помилку і викликає даний ендпойнт.
        З cookie буде взято refresh token і він буде провальований. Таким чином, виключається підробка токена.
        Якщо refresh token у користувача відсутній, буде видано помилку Unauthorization. Та ж помилка повернеться якщо refresh token недійсний.
        За умови, що в базі даних є сесія з даним refresh token і він дійсний, буде видано новий access token і refresh token.
```