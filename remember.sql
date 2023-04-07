CREATE TABLE customers(
    customer_id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE products(
    product_id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2)
);

CREATE TABLE orders(
    order_id INT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

///////////////////////////////

INSERT INTO customers(customer_id, name, email) VALUES
(1, 'John Doe', 'dohn.doe@example.com'),
(2, 'Bob', 'jonson@example.com'),
(3, 'Jane', 'smith@example.com'),
(4, 'On ni4ego ne zakazival', 'test@example.com');

INSERT INTO products (product_id, name, price) VALUES
(1, 'Samsung', 1000),
(2, 'Pixel', 999.99),
(3, 'Takogo tovara ni y kogo net', 799.99);

INSERT INTO orders(order_id, customer_id, product_id, quantity) VALUES
(1, 1, 1, 2),
(2, 1, 2, 1),
(3, 2, 1, 5),
(4, 3, 2, 56);

/////////////////////////////////

SELECT * FROM orders
INNER JOIN customers ON orders.customer_id = customers.customer_id
INNER JOIN products ON orders.product_id = products.product_id;

SELECT * FROM customers
LEFT JOIN orders ON customers.customer_id = orders.customer_id
LEFT JOIN products ON orders.product_id = products.product_id;

SELECT * FROM orders
RIGHT JOIN customers ON orders.customer_id = customers.customer_id
RIGHT JOIN products ON orders.product_id = products.product_id;

SELECT * FROM customers
FULL OUTER JOIN orders ON customers.customer_id = orders.customer_id
FULL OUTER JOIN products ON orders.product_id = products.product_id;




/*

1. Створити в цій базі даних таблицю з супергероями та супресилами.
Структуру таблицб оберіть самостійно.
У кожного супергероя може бути декілька суперсил, крім того, різні супергерої можуть мати однакові суперсили.

2. Заповнити таблиці різними даними. Але зробити так, щоб було було не менше 3 супергероїв. 
Крім того, потрібно передбачити, щоб в таблиці суперсил були суперсили, які не належать жодному з супергероїв.

3. Вивести всю інформацію з таблиці супергероїв.
4. Вивести всю інформацію з таблиці суперсил.

5. Написати запит, щоб за ім'ям супергероя можна було отримати всю інформацію про супергероя та про його суперсили.

6. Вивести всіх супергероїв, які мають суперсилу "здатність літати".

7. Вивести супергероїв, у яких є співпадіння по суперсилам. Інформацію подати у вигляді:
інформація про супергероїв + інформація про суперсили, які повторюються

8. Знайти у таблиці суперсил топ-3 найбільш розповсюджені суперсили.

9. Знайти у таблиці суперсил такі сили, які не використовуються у жодного з супергероїв.

10. Видалити з таблиці супергероїв суперсили, які не використовуються.
Повернути назви видалених суперсил.

11. Підрахувати середню кількість суперсил, які використовуються у супергероїв.
Оновити ім'я для всіх супергероїв, які мають кількість суперсил >= наж середня:
на початок їх імені додати частку: "BOSS "...ім'я герою
(concat)

12. Додати до таблиці суперсил колонку "використовується", яка буде містити значення true, 
якщо суперсила використовується хоча б одним супергероєм, та false - якщо ні.

*/

/*
1. Створення таблиць
*/

CREATE TABLE superheroes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE superpowers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    superhero_id INTEGER REFERENCES superheroes(id)
);

/*
2. Заповнення таблиць
*/

INSERT INTO superheroes (name) VALUES
('Superman'),
('Spiderman'),
('Batman');

INSERT INTO superpowers(name, superhero_id) VALUES
('Flight', 1),
('Strength', 1),
('Flight', 2),
('Web-slinding', 2),
('Wall-crawling', 2),
('Utility belt', 3),
('Intelligence', 3),
('Fast', NULL),
('Invisibility', NULL);

/*
3-4. Вивести всю інформацію
*/

SELECT * FROM superheroes;
SELECT * FROM superpowers;

/*
5. Запит на отримання інформації про супергероя та його суперсили за ім'ям супергероя
*/

SELECT superheroes.name, superpowers.name
FROM superheroes
LEFT JOIN superpowers ON superheroes.id = superpowers.superhero_id
WHERE superheroes.name = 'Superman';



/*
6. Вивести всіх супергероїв, які мають суперсилу "здатність літати"
*/

SELECT superheroes.* FROM superheroes
JOIN superpowers ON superheroes.id = superpowers.superhero_id
WHERE superpowers.name = 'Flight';


/*
7. Вивести супергероїв, у яких є співпадіння по суперсилам
*/

SELECT s1.*, sp1.name FROM superheroes AS s1
JOIN superheroes AS s2 ON s1.id != s2.id
JOIN superpowers AS sp1 ON s1.id = sp1.superhero_id
JOIN superpowers AS sp2 ON s2.id = sp2.superhero_id AND sp1.name = sp2.name;

/*
8. Топ-3 найбільш розповсюджені суперсили
*/

SELECT name, COUNT(*) AS count FROM superpowers
GROUP BY name
ORDER BY count DESC
LIMIT 3;


/*
9. Суперсили, які не використовуються жодним з супергероїв.
*/

SELECT DISTINCT * FROM superpowers
LEFT JOIN superheroes ON superpowers.superhero_id = superheroes.id
WHERE superheroes.id IS NULL;

/*
10. Видалення суперсил, які не використовуються та повернення назв видалених суперсил
*/

DELETE FROM superpowers
WHERE name IN (
    SELECT superpowers.name FROM superpowers
    LEFT JOIN superheroes ON superpowers.superhero_id = superheroes.id
    WHERE superheroes.id IS NULL
)
RETURNING name;

/*
11. Додавання частки "BOSS" до найбільш сильних супергероїв
*/

UPDATE superheroes
SET name = CONCAT('BOSS ', name)
WHERE id IN(
    SELECT superhero_id 
    FROM superpowers
    GROUP BY superhero_id
    HAVING COUNT(*) >= (
        SELECT AVG(superpowers_count)
        FROM (
                SELECT COUNT(*) AS superpowers_count 
                FROM superpowers
                GROUP BY superhero_id
        ) AS counts
    )
)
RETURNING *;

/*
12. Додавання колонки до таблиці суперсил яка вказує на те, що суперсила використовується хоча б одним супергероєм
*/
INSERT INTO superpowers (name, superhero_id) VALUES('Test', NULL);

ALTER TABLE superpowers
ADD COLUMN used BOOLEAN DEFAULT false;

UPDATE superpowers
SET used =
CASE
    WHEN superheroes.id IS NOT NULL THEN true
    ELSE false
END
FROM superheroes
WHERE superheroes.id = superpowers.superhero_id;


DROP TABLE orders;
DROP TABLE customers;
DROP TABLE products;

DROP TABLE superpowers;
DROP TABLE superheroes;