# Генератор данных из Figma

## Генератор темы

Пакет `@atls/figma-theme-cli` является энтрипоинтом по созданию темы.

Пререквизиты:

- ID файла Figma. Можно найти в ссылке на любой объект внутри файла Figma, например:

https://www.figma.com/file/SHoss54mn2SZLnI0e3OiJj/...

ID = SHoss54mn2SZLnI0e3OiJj

- папка `theme` рядом с местом исполнения скрипта
- Access Token от
  Figma. [Инструкция тут](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)
  . Токену необходимы доступы
  к чтению `File content` и `Dev resources`

Необходимо запустить
скрипт `generate-theme` с первым аргументом - ID файла Figma, из которого будет браться тема. Для генерации темы по современным паттернам создания компонентов в Figma использовать параметр `--method=secondary`.

Первым промптом с вас спросят Access Token.

После генерации вы получите в папке `theme` файлы с собранными данными из Figma файла, которые
можно использовать в проекте.

## Генератор ассетов

Пакет `@atls/figma-assets-cli` является энтрипоинтом по созданию темы.

Пререквизиты:

- ID файла Figma. Можно найти в ссылке на любой объект внутри файла Figma, например:

https://www.figma.com/file/SHoss54mn2SZLnI0e3OiJj/...

ID = SHoss54mn2SZLnI0e3OiJj

- ID документа Figma
- Access Token от
  Figma. [Инструкция тут](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)
  . Токену необходимы доступы
  к чтению `File content` и `Dev resources`

Необходимо запустить
скрипт `generate-assets` с первым аргументом - ID файла Figma, из которого будет браться тема, а
вторым - ID документа.

Первым промптом с вас спросят Access Token.

## Архив

<details>
<summary>Figma generation tools</summary>

# Figma generation tools

## Colors generator

### 1. Название главного фрейма

Для того чтобы найти кнопки в фигме, необходимо привязываться к названию главного фрейма¹. Это
название будет служить в качестве ID, с помощью которого получим все кнопки находящиеся внутри этого
фрейма.

### Что нужно сделать?

Необходимо в самой фигме назвать главный фрейм¹ с кнопками `Desktop / Buttons`.

### Пример

<details>

#### главный фрейм¹

![image](https://user-images.githubusercontent.com/35490768/203013265-652ad96c-cd14-4f0b-aaf7-8554f849f85d.png)

</details>

### 2. Компоновка кнопок

#### Правильная компоновка

<details>

![image](https://user-images.githubusercontent.com/35490768/202783638-1694d196-c166-4aad-ace4-cdbf399b41be.png)

</details>

#### Неправильная

<details>

<img width="593" alt="image" src="https://user-images.githubusercontent.com/35490768/202784049-7e1e2595-e556-42f5-b4c8-60beae4bf540.png">

</details>

### Что нужно сделать?

Чтобы из неправильной сделать правильную, необходимо разбить неправильную на две независимые части,
т.е будет два вида кнопок, как в правильном варианте, только с названиями `Other / Location On`
и `Other / Location Off`

</details>

<details>
<summary>Figma modern colors tools</summary>

## Colors generator

### 1. Название главного фрейма

Для того чтобы найти кнопки в фигме, необходимо привязываться к названию главного фрейма¹. Это
название будет служить в качестве ID, с помощью которого получим все кнопки находящиеся внутри этого фрейма.

### Что нужно сделать?

Необходимо в самой фигме назвать главный фрейм¹ с кнопками `Generator/Button`.

<details>
<summary>Пример: главный фрейм¹</summary>

![image](https://github.com/user-attachments/assets/5d5a0a50-534a-4a8f-8c69-2926c25a2c6b)

</details>

### 2. Названия и свойства кнопок

У кнопок должны быть корректные свойства, дублирующеися в их название. Для кнопок обязательные свойства `Style`, `State` и `Text`, для инпутов `Type` и `State`.

<details>
<summary>Пример: правильных кнопок</summary>

![image](https://github.com/user-attachments/assets/11ccc7f0-c3a8-4c02-bf04-09370608f6dd)

</details>

<details>
<summary>Пример: неправильных кнопок</summary>

<img width="593" alt="image" src="https://user-images.githubusercontent.com/35490768/202784049-7e1e2595-e556-42f5-b4c8-60beae4bf540.png">

</details>

</details>
