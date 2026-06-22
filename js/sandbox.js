/**
 * 브라우저 내 SQL(sql.js) / Python(Pyodide) 실행 샌드박스
 */
const StudySandbox = (() => {
  const SCHEMAS = {
    gym_member: `
      DROP TABLE IF EXISTS GYM_MEMBER;
      CREATE TABLE GYM_MEMBER (
        MEMBER_ID INTEGER PRIMARY KEY,
        SQUAT INTEGER,
        BENCH_PRESS INTEGER,
        DEADLIFT INTEGER
      );
      INSERT INTO GYM_MEMBER VALUES
        (1, 100, 80, 100),
        (2, 30, 30, 40),
        (3, 200, 200, 200),
        (4, 200, 200, 200),
        (5, 5, 5, 5),
        (6, 400, 350, 240);
    `,
    book: `
      DROP TABLE IF EXISTS book;
      CREATE TABLE book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        category TEXT,
        price REAL,
        rating INTEGER,
        stock INTEGER
      );
      INSERT INTO book VALUES
        (1, 'SQL입문', 'IT', 15000, 5, 10),
        (2, '파이썬첫걸음', 'IT', 18000, 4, 5),
        (3, '데이터분석', 'IT', 22000, 5, 3),
        (4, '춘향전', '문학', 12000, 5, 8);
    `,
    invoice: `
      DROP TABLE IF EXISTS Invoice;
      CREATE TABLE Invoice (
        InvoiceId INTEGER PRIMARY KEY,
        CustomerId INTEGER,
        InvoiceDate TEXT,
        BillingCountry TEXT,
        Total REAL
      );
      INSERT INTO Invoice VALUES
        (1, 1, '2024-01-05', 'USA', 50.0),
        (2, 2, '2024-01-10', 'Canada', 30.0),
        (3, 1, '2024-02-01', 'USA', 45.0),
        (4, 3, '2024-02-15', 'Germany', 60.0),
        (5, 2, '2024-03-01', 'Canada', 25.0);
    `,
    library: `
      DROP TABLE IF EXISTS book;
      DROP TABLE IF EXISTS user;
      CREATE TABLE book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        publisher TEXT,
        date_received TEXT
      );
      CREATE TABLE user (
        id INTEGER PRIMARY KEY,
        name TEXT
      );
      INSERT INTO book VALUES
        (1, '돈키호테', '미겔 데 세르반테스', '엘리스출판', '2010-01-01'),
        (2, '어린왕자', '생텍쥐페리', '엘리스출판', '2011-02-01'),
        (3, '해리포터', 'J.K. 롤링', '문학수첩', '2012-03-01'),
        (4, '데미안', '헤르만 헤세', '민음사', '2013-04-01'),
        (5, '죄와 벌', '표도르 도스토옙스키', '엘리스출판', '2014-05-01'),
        (6, '1984', '조지 오웰', '문학수첩', '2015-06-01');
      INSERT INTO user VALUES
        (1, 'user_a'), (2, 'user_b'), (3, 'user_c'), (4, 'user_d');
    `,
    employees: `
      DROP TABLE IF EXISTS employees;
      DROP TABLE IF EXISTS salaries;
      CREATE TABLE employees (
        emp_no INTEGER PRIMARY KEY,
        birth_date TEXT,
        first_name TEXT,
        last_name TEXT,
        gender TEXT,
        hire_date TEXT,
        superior_no INTEGER
      );
      CREATE TABLE salaries (
        emp_no INTEGER,
        salary INTEGER,
        from_date TEXT,
        to_date TEXT
      );
      INSERT INTO employees VALUES
        (10001, '1953-01-01', 'Georgi', 'Facello', 'M', '1986-06-26', NULL),
        (10002, '1964-02-02', 'Bezalel', 'Simmel', 'F', '1985-11-21', 10001),
        (10003, '1959-09-03', 'Parto', 'Bamford', 'M', '1986-08-28', 10002);
      INSERT INTO salaries VALUES
        (10001, 60117, '1986-06-26', '1987-06-26'),
        (10001, 62102, '1987-06-26', '1988-06-26'),
        (10002, 65828, '1996-02-11', '1997-02-11'),
        (10002, 65909, '1997-02-11', '1998-02-11'),
        (10003, 40006, '1996-08-28', '1997-08-28'),
        (10004, 72527, '1986-12-01', '1987-12-01'),
        (10005, 94692, '1996-12-03', '1997-12-03'),
        (10006, 43311, '1989-09-21', '1990-09-21'),
        (10007, 88070, '1996-02-12', '1997-02-12');
    `,
    sell_product: `
      DROP TABLE IF EXISTS SELL;
      DROP TABLE IF EXISTS PRODUCT;
      CREATE TABLE PRODUCT (
        PRODUCT_ID INTEGER PRIMARY KEY,
        PRODUCT_NAME TEXT,
        PRICE INTEGER
      );
      CREATE TABLE SELL (
        SELL_ID INTEGER PRIMARY KEY,
        SELLER_NAME TEXT,
        PRODUCT_ID INTEGER,
        QUANTITY INTEGER
      );
      INSERT INTO PRODUCT VALUES
        (1, 'Red Car', 2000),
        (2, 'White Car', 5000),
        (3, 'Black Car', 8000),
        (4, 'Blue Car', 3500);
      INSERT INTO SELL VALUES
        (1, 'Kim', 1, 2),
        (2, 'Kim', 2, 1),
        (3, 'Kim', 3, 2),
        (4, 'Lee', 1, 1),
        (5, 'Lee', 4, 1),
        (6, 'Lee', 3, 3),
        (7, 'Choi', 1, 3),
        (8, 'Choi', 2, 11);
    `,
    student: `
      DROP TABLE IF EXISTS STUDENT;
      CREATE TABLE STUDENT (
        ID INTEGER PRIMARY KEY,
        MATH INTEGER,
        PHYSICS INTEGER,
        CHEMISTRY INTEGER
      );
      INSERT INTO STUDENT VALUES
        (1, 90, 85, 88), (2, 78, 80, 75), (3, 95, 92, 90),
        (4, 60, 65, 70), (5, 88, 90, 85), (6, 72, 70, 68),
        (7, 98, 95, 96), (8, 55, 58, 60), (9, 82, 84, 80),
        (10, 70, 72, 74), (11, 91, 89, 87), (12, 65, 68, 66);
    `,
    book_history: `
      DROP TABLE IF EXISTS BOOK_HISTORY;
      CREATE TABLE BOOK_HISTORY (
        BOOK_ID INTEGER PRIMARY KEY,
        BOOK_NAME TEXT,
        KIND TEXT,
        CATEGORY TEXT,
        SELL_COUNT INTEGER
      );
      INSERT INTO BOOK_HISTORY VALUES
        (1, 'SQL', 'E BOOK', 'IT', 20),
        (2, 'PASTA', 'E BOOK', 'COOK', 13),
        (3, 'KOREA', 'P BOOK', 'TRAVEL', 8),
        (4, 'JAVA', 'E BOOK', 'IT', 15),
        (5, 'PYTHON', 'E BOOK', 'IT', 22),
        (6, 'NOODLE', 'E BOOK', 'COOK', 10),
        (7, 'EUROPE', 'P BOOK', 'TRAVEL', 6),
        (8, 'DATA', 'E BOOK', 'IT', 18),
        (9, 'SOUP', 'E BOOK', 'COOK', 9),
        (10, 'ASIA', 'P BOOK', 'TRAVEL', 5),
        (11, 'LINUX', 'E BOOK', 'IT', 12);
    `,
    employee_position: `
      DROP TABLE IF EXISTS EMPLOYEE;
      DROP TABLE IF EXISTS POSITION_T;
      CREATE TABLE POSITION_T (
        POSITION_ID TEXT PRIMARY KEY,
        POSITION_NAME TEXT
      );
      CREATE TABLE EMPLOYEE (
        EMPLOYEE_ID TEXT PRIMARY KEY,
        NAME TEXT,
        POSITION_ID TEXT
      );
      INSERT INTO POSITION_T VALUES
        ('P01', '부장'), ('P02', '차장'), ('P03', '과장'), ('P04', '대리');
      INSERT INTO EMPLOYEE VALUES
        ('E001', 'kim', 'P01'),
        ('E002', 'song', 'P02'),
        ('E003', 'park', 'P03'),
        ('E004', 'lee', 'P04'),
        ('E005', 'choi', 'P03'),
        ('E006', 'han', 'P02');
    `,
    name_cross: `
      DROP TABLE IF EXISTS FIRST_NAME_T;
      DROP TABLE IF EXISTS LAST_NAME_T;
      CREATE TABLE FIRST_NAME_T (
        id INTEGER PRIMARY KEY,
        first_name TEXT
      );
      CREATE TABLE LAST_NAME_T (
        id INTEGER PRIMARY KEY,
        last_name TEXT
      );
      INSERT INTO FIRST_NAME_T VALUES
        (1, 'Kim'), (2, 'Lee'), (3, 'Choi');
      INSERT INTO LAST_NAME_T VALUES
        (1, 'Chulsoo'), (2, 'Gildong'), (3, 'Yeonghee');
    `,
    employee_self: `
      DROP TABLE IF EXISTS EMPLOYEE;
      CREATE TABLE EMPLOYEE (
        employee_id INTEGER PRIMARY KEY,
        employee_name TEXT,
        manager_id INTEGER
      );
      INSERT INTO EMPLOYEE VALUES
        (10001, 'Kim', NULL),
        (10002, 'Lee', 10001),
        (10003, 'Park', 10001),
        (10004, 'Moon', 10002),
        (10005, 'Choi', 10002);
    `,
    request_member: `
      DROP TABLE IF EXISTS REQUEST_HIST;
      DROP TABLE IF EXISTS MEMBER;
      CREATE TABLE REQUEST_HIST (
        request_id INTEGER PRIMARY KEY,
        req_status TEXT,
        req_member_id TEXT
      );
      CREATE TABLE MEMBER (
        member_id TEXT PRIMARY KEY,
        member_name TEXT
      );
      INSERT INTO REQUEST_HIST VALUES
        (10001, 'success', 'P001'),
        (10002, 'success', 'P002'),
        (10003, 'fail', 'P001'),
        (10004, 'success', 'P002'),
        (10005, 'fail', 'P003'),
        (10006, 'fail', 'P001');
      INSERT INTO MEMBER VALUES
        ('P001', 'Kim'),
        ('P002', 'Park'),
        ('P003', 'Lee');
    `,
    request_union: `
      DROP TABLE IF EXISTS request_past;
      DROP TABLE IF EXISTS request_new;
      CREATE TABLE request_past (
        name TEXT,
        number TEXT
      );
      CREATE TABLE request_new (
        name TEXT,
        number TEXT
      );
      INSERT INTO request_past VALUES
        ('Kim', '1011116789'),
        ('KimDog', '1099998765'),
        ('KimDino', '1033331234'),
        ('KimMonkey', '1012345678'),
        ('KimTiger', '1011112222'),
        ('Park', '1012345555');
      INSERT INTO request_new VALUES
        ('KimDog', '1099998765'),
        ('Giraffe', '1098765432'),
        ('Rabbit', '1012345679'),
        ('Tiger', '1022221234'),
        ('Giraffe', '1098765432');
    `,
    participant: `
      DROP TABLE IF EXISTS PARTICIPANT;
      CREATE TABLE PARTICIPANT (
        ID INTEGER PRIMARY KEY,
        GROUP_NUM INTEGER,
        TIME_RECORD TEXT
      );
      INSERT INTO PARTICIPANT VALUES
        (1, 1, '02:01:05'),
        (2, 1, '02:15:30'),
        (3, 1, '02:45:00'),
        (4, 2, '01:55:10'),
        (5, 2, '02:05:20'),
        (6, 2, '02:30:45'),
        (7, 3, '03:10:00'),
        (8, 3, '03:25:15');
    `,
    library_rental: `
      DROP TABLE IF EXISTS rental;
      DROP TABLE IF EXISTS user;
      CREATE TABLE user (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT
      );
      CREATE TABLE rental (
        id INTEGER PRIMARY KEY,
        book_id INTEGER,
        user_id INTEGER,
        rental_begin_date TEXT,
        rental_end_date TEXT
      );
      INSERT INTO user VALUES
        (1000, 'Elice', 'elice@elice.com', '010-1234-5678', '101-23 CeileDong'),
        (1001, 'Cheshire', 'cheshire@elice.com', '010-8765-4321', '101-24 CeileDong'),
        (1002, 'Dodo', 'dodo@elice.com', '010-1111-2222', '100-11 CeileDong'),
        (1003, 'Caterpillar', 'caterpillar@elice.com', '010-1212-3434', '100-12 CeileDong'),
        (1004, 'Hatter', 'hatter@elice.com', '010-1357-2468', '103-34 CeileDong');
      INSERT INTO rental VALUES
        (1000, 1001, 1000, '2024-01-01', '2024-01-15'),
        (1001, 1002, 1000, '2024-01-20', '2024-02-05'),
        (1002, 1003, 1001, '2024-02-01', '2024-02-20'),
        (1003, 1004, 1002, '2024-02-10', '2024-02-25'),
        (1004, 1005, 1002, '2024-03-01', '2024-03-15'),
        (1005, 1006, 1003, '2024-03-05', '2024-03-20');
    `,
    kickboard_empty: `
      -- 빈 DB (DDL 실습용)
    `,
    kickboard_ready: `
      DROP TABLE IF EXISTS kickboard;
      CREATE TABLE kickboard (
        id INTEGER PRIMARY KEY,
        model TEXT NOT NULL,
        battery INTEGER,
        price INTEGER UNIQUE
      );
    `,
    kickboard_norm: `
      DROP TABLE IF EXISTS customer;
      CREATE TABLE customer (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        kickboard_model TEXT,
        borrow_date TEXT,
        return_date TEXT
      );
      INSERT INTO customer VALUES
        (1, '김민수', '010-1111-2222', 'A-100', '2024-01-01', '2024-01-03'),
        (2, '김민수', '010-1111-2222', 'B-200', '2024-01-05', '2024-01-07'),
        (3, '이영희', '010-3333-4444', 'A-100', '2024-02-01', '2024-02-02');
    `,
    kickboard_2nf: `
      DROP TABLE IF EXISTS borrow;
      DROP TABLE IF EXISTS customer;
      CREATE TABLE customer (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT
      );
      INSERT INTO customer VALUES
        (1, '김민수', '010-1111-2222'),
        (2, '이영희', '010-3333-4444');
    `,
    kickboard_3nf: `
      DROP TABLE IF EXISTS borrow;
      DROP TABLE IF EXISTS price;
      DROP TABLE IF EXISTS company;
      DROP TABLE IF EXISTS customer;
      CREATE TABLE customer (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT
      );
      CREATE TABLE company (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );
      INSERT INTO customer VALUES (1, '김민수', '010-1111-2222');
      INSERT INTO company VALUES (1, 'KickCo');
    `,
    sql_structure: `
      DROP TABLE IF EXISTS Employee;
      DROP TABLE IF EXISTS Customer;
      DROP TABLE IF EXISTS book;
      DROP TABLE IF EXISTS Invoice;
      DROP TABLE IF EXISTS employees;
      DROP TABLE IF EXISTS salaries;
      DROP TABLE IF EXISTS request_past;
      DROP TABLE IF EXISTS request_new;

      CREATE TABLE Employee (
        EmployeeID INTEGER PRIMARY KEY,
        Name TEXT,
        ReportsTo INTEGER,
        BirthDate TEXT,
        Country TEXT,
        Age INTEGER
      );
      INSERT INTO Employee VALUES
        (1, 'Kim', NULL, '1988-03-12', 'Korea', 36),
        (2, 'Lee', 1, '1990-07-21', 'Korea', 34),
        (3, 'Park', 1, '1992-11-05', 'Korea', 32),
        (4, 'Choi', 2, '1995-01-18', 'Korea', 29),
        (5, 'Jung', 2, '1993-09-30', 'USA', 31),
        (6, 'Han', NULL, '1987-12-01', 'Korea', 37);

      CREATE TABLE Customer (
        CustomerID INTEGER PRIMARY KEY,
        Name TEXT,
        Country TEXT,
        Age INTEGER,
        City TEXT
      );
      INSERT INTO Customer VALUES
        (1, 'Alice', 'Korea', 28, 'Seoul'),
        (2, 'Bob', 'USA', 35, 'New York'),
        (3, 'Carol', 'Korea', 42, 'Busan'),
        (4, 'Dave', 'Germany', 31, 'Berlin'),
        (5, 'Eve', 'Korea', 25, 'Seoul');

      CREATE TABLE book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        category TEXT,
        price REAL,
        rating INTEGER,
        stock INTEGER,
        publisher TEXT
      );
      INSERT INTO book VALUES
        (1, 'SQL입문', 'IT', 15000, 5, 10, '한빛'),
        (2, '파이썬첫걸음', 'IT', 18000, 4, 5, '위키'),
        (3, '데이터분석', 'IT', 22000, 5, 3, '한빛'),
        (4, '춘향전', '문학', 12000, 5, 8, NULL),
        (5, 'Python Cookbook', 'IT', 25000, 4, 2, 'OReilly'),
        (6, '통계기초', 'IT', 20000, 4, 6, NULL);

      CREATE TABLE Invoice (
        InvoiceId INTEGER PRIMARY KEY,
        CustomerId INTEGER,
        InvoiceDate TEXT,
        BillingCountry TEXT,
        Total REAL
      );
      INSERT INTO Invoice VALUES
        (1, 1, '2024-01-05', 'Korea', 50.0),
        (2, 2, '2024-01-10', 'USA', 30.0),
        (3, 1, '2024-02-01', 'Korea', 45.0),
        (4, 3, '2024-02-15', 'Germany', 60.0),
        (5, 2, '2024-03-01', 'USA', 25.0),
        (6, 4, '2024-03-12', 'Korea', 80.0);

      CREATE TABLE employees (
        emp_no INTEGER PRIMARY KEY,
        first_name TEXT,
        superior_no INTEGER
      );
      CREATE TABLE salaries (
        emp_no INTEGER,
        salary INTEGER,
        from_date TEXT
      );
      INSERT INTO employees VALUES
        (10001, 'Georgi', NULL),
        (10002, 'Bezalel', 10001),
        (10003, 'Parto', 10001),
        (10004, 'Chirstopher', 10002),
        (10005, 'Kyoichi', 10002);
      INSERT INTO salaries VALUES
        (10001, 60000, '2020-01-01'),
        (10002, 55000, '2020-01-01'),
        (10003, 52000, '2020-01-01'),
        (10004, 48000, '2021-01-01'),
        (10005, 50000, '2021-01-01');

      CREATE TABLE request_past (
        name TEXT,
        number TEXT
      );
      CREATE TABLE request_new (
        name TEXT,
        number TEXT
      );
      INSERT INTO request_past VALUES
        ('Kim', '1011116789'),
        ('Park', '1012345555'),
        ('Lee', '1099887766');
      INSERT INTO request_new VALUES
        ('Kim', '1011116789'),
        ('Giraffe', '1098765432'),
        ('Tiger', '1022221234');
    `,
  };

  const TABLE_META = {
    gym_member: {
      tableName: "GYM_MEMBER",
      schemaText: [
        "테이블: GYM_MEMBER",
        "┌─────────────┬─────────┬──────────────────────────┐",
        "│ 컬럼        │ 타입    │ 설명                     │",
        "├─────────────┼─────────┼──────────────────────────┤",
        "│ MEMBER_ID   │ INTEGER │ 회원 ID (PK)             │",
        "│ SQUAT       │ INTEGER │ 스쿼트(kg)               │",
        "│ BENCH_PRESS │ INTEGER │ 벤치프레스(kg)           │",
        "│ DEADLIFT    │ INTEGER │ 데드리프트(kg)           │",
        "└─────────────┴─────────┴──────────────────────────┘",
      ].join("\n"),
      previewSql: "SELECT * FROM GYM_MEMBER;",
    },
    book: {
      tableName: "book",
      schemaText: [
        "테이블: book",
        "┌──────────┬────────┬────────────────────────┐",
        "│ 컬럼     │ 타입   │ 설명                   │",
        "├──────────┼────────┼────────────────────────┤",
        "│ id       │ INTEGER│ 도서 ID (PK)           │",
        "│ title    │ TEXT   │ 제목                   │",
        "│ category │ TEXT   │ 분류                   │",
        "│ price    │ REAL   │ 가격                   │",
        "│ rating   │ INTEGER│ 평점                   │",
        "│ stock    │ INTEGER│ 재고                   │",
        "└──────────┴────────┴────────────────────────┘",
      ].join("\n"),
      previewSql: "SELECT * FROM book;",
    },
    invoice: {
      tableName: "Invoice",
      schemaText: [
        "테이블: Invoice",
        "┌────────────────┬─────────┬────────────────────┐",
        "│ 컬럼           │ 타입    │ 설명               │",
        "├────────────────┼─────────┼────────────────────┤",
        "│ InvoiceId      │ INTEGER │ 청구 ID (PK)       │",
        "│ CustomerId     │ INTEGER │ 고객 ID            │",
        "│ InvoiceDate    │ TEXT    │ 청구일             │",
        "│ BillingCountry │ TEXT    │ 청구 국가          │",
        "│ Total          │ REAL    │ 청구 금액          │",
        "└────────────────┴─────────┴────────────────────┘",
      ].join("\n"),
      previewSql: "SELECT * FROM Invoice;",
    },
    library: {
      tableName: "book / user",
      schemaText: [
        "테이블: book (id, title, author, publisher, date_received) — 6권",
        "  · 엘리스출판 3권 / 문학수첩 2권 / 민음사 1권",
        "  · 생텍쥐페리 저자: 어린왕자 / title LIKE '%왕자' → 어린왕자",
        "테이블: user (id, name) — 4명",
      ].join("\n"),
      previewQueries: ["SELECT * FROM book;", "SELECT * FROM user;"],
      samplePreview: [
        {
          label: "book",
          columns: ["id", "title", "author", "publisher", "date_received"],
          rows: [
            [1, "돈키호테", "미겔 데 세르반테스", "엘리스출판", "2010-01-01"],
            [2, "어린왕자", "생텍쥐페리", "엘리스출판", "2011-02-01"],
            [3, "해리포터", "J.K. 롤링", "문학수첩", "2012-03-01"],
            [4, "데미안", "헤르만 헤세", "민음사", "2013-04-01"],
            [5, "죄와 벌", "표도르 도스토옙스키", "엘리스출판", "2014-05-01"],
            [6, "1984", "조지 오웰", "문학수첩", "2015-06-01"],
          ],
        },
        {
          label: "user",
          columns: ["id", "name"],
          rows: [
            [1, "user_a"],
            [2, "user_b"],
            [3, "user_c"],
            [4, "user_d"],
          ],
        },
      ],
    },
    employees: {
      tableName: "employees / salaries",
      schemaText: [
        "employees: emp_no, birth_date, first_name, last_name, gender, hire_date, superior_no",
        "salaries: emp_no, salary, from_date, to_date",
      ].join("\n"),
      previewQueries: ["SELECT * FROM employees;", "SELECT * FROM salaries;"],
    },
    sell_product: {
      tableName: "SELL / PRODUCT",
      schemaText: [
        "PRODUCT: PRODUCT_ID, PRODUCT_NAME, PRICE",
        "SELL: SELL_ID, SELLER_NAME, PRODUCT_ID, QUANTITY",
      ].join("\n"),
      previewQueries: ["SELECT * FROM SELL;", "SELECT * FROM PRODUCT;"],
      samplePreview: [
        {
          label: "PRODUCT",
          columns: ["PRODUCT_ID", "PRODUCT_NAME", "PRICE"],
          rows: [
            [1, "Red Car", 2000],
            [2, "White Car", 5000],
            [3, "Black Car", 8000],
            [4, "Blue Car", 3500],
          ],
        },
        {
          label: "SELL",
          columns: ["SELL_ID", "SELLER_NAME", "PRODUCT_ID", "QUANTITY"],
          rows: [
            [1, "Kim", 1, 2],
            [2, "Kim", 2, 1],
            [3, "Kim", 3, 2],
            [4, "Lee", 1, 1],
            [5, "Lee", 4, 1],
          ],
        },
      ],
    },
    student: {
      tableName: "STUDENT",
      schemaText: "STUDENT: ID, MATH, PHYSICS, CHEMISTRY (12명)",
      previewSql: "SELECT * FROM STUDENT;",
    },
    book_history: {
      tableName: "BOOK_HISTORY",
      schemaText: "BOOK_HISTORY: BOOK_ID, BOOK_NAME, KIND, CATEGORY, SELL_COUNT",
      previewSql: "SELECT * FROM BOOK_HISTORY;",
    },
    employee_position: {
      tableName: "EMPLOYEE / POSITION_T",
      schemaText: [
        "EMPLOYEE: EMPLOYEE_ID, NAME, POSITION_ID",
        "POSITION_T: POSITION_ID(PK), POSITION_NAME",
      ].join("\n"),
      previewQueries: [
        "SELECT * FROM EMPLOYEE;",
        "SELECT * FROM POSITION_T;",
      ],
      samplePreview: [
        {
          label: "POSITION_T",
          columns: ["POSITION_ID", "POSITION_NAME"],
          rows: [
            ["P01", "부장"],
            ["P02", "차장"],
            ["P03", "과장"],
            ["P04", "대리"],
          ],
        },
        {
          label: "EMPLOYEE",
          columns: ["EMPLOYEE_ID", "NAME", "POSITION_ID"],
          rows: [
            ["E001", "kim", "P01"],
            ["E002", "song", "P02"],
            ["E003", "park", "P03"],
            ["E004", "lee", "P04"],
          ],
        },
      ],
    },
    name_cross: {
      tableName: "FIRST_NAME_T / LAST_NAME_T",
      schemaText: [
        "FIRST_NAME_T: id, first_name (Kim, Lee, Choi)",
        "LAST_NAME_T: id, last_name (Chulsoo, Gildong, Yeonghee)",
      ].join("\n"),
      previewQueries: ["SELECT * FROM FIRST_NAME_T;", "SELECT * FROM LAST_NAME_T;"],
      samplePreview: [
        {
          label: "FIRST_NAME_T",
          columns: ["id", "first_name"],
          rows: [
            [1, "Kim"],
            [2, "Lee"],
            [3, "Choi"],
          ],
        },
        {
          label: "LAST_NAME_T",
          columns: ["id", "last_name"],
          rows: [
            [1, "Chulsoo"],
            [2, "Gildong"],
            [3, "Yeonghee"],
          ],
        },
      ],
    },
    employee_self: {
      tableName: "EMPLOYEE (셀프 조인)",
      schemaText: [
        "EMPLOYEE: employee_id(PK), employee_name, manager_id",
        "관리자 관계: Kim(10001) ← Lee, Park / Lee(10002) ← Moon, Choi",
      ].join("\n"),
      previewQueries: ["SELECT * FROM EMPLOYEE;"],
    },
    request_member: {
      tableName: "REQUEST_HIST / MEMBER",
      schemaText: [
        "REQUEST_HIST: request_id, req_status, req_member_id",
        "MEMBER: member_id(PK), member_name",
      ].join("\n"),
      previewQueries: ["SELECT * FROM REQUEST_HIST;", "SELECT * FROM MEMBER;"],
      samplePreview: [
        {
          label: "MEMBER",
          columns: ["member_id", "member_name"],
          rows: [
            ["P001", "Kim"],
            ["P002", "Park"],
            ["P003", "Lee"],
          ],
        },
        {
          label: "REQUEST_HIST",
          columns: ["request_id", "req_status", "req_member_id"],
          rows: [
            [10001, "success", "P001"],
            [10002, "success", "P002"],
            [10003, "fail", "P001"],
          ],
        },
      ],
    },
    request_union: {
      tableName: "request_past / request_new",
      schemaText: [
        "request_past: name, number (6건)",
        "request_new: name, number (5건, 일부 중복)",
      ].join("\n"),
      previewQueries: ["SELECT * FROM request_past;", "SELECT * FROM request_new;"],
    },
    participant: {
      tableName: "PARTICIPANT",
      schemaText: "PARTICIPANT: ID, GROUP_NUM, TIME_RECORD (마라톤 기록 8건)",
      previewSql: "SELECT * FROM PARTICIPANT;",
    },
    library_rental: {
      tableName: "rental / user",
      schemaText: [
        "user: id, name, email, phone, address (5명)",
        "rental: id, book_id, user_id, rental_begin_date, rental_end_date (6건)",
      ].join("\n"),
      previewQueries: ["SELECT * FROM rental;", "SELECT * FROM user;"],
    },
    kickboard_empty: {
      tableName: "(빈 DB)",
      schemaText: "DDL 실습용 빈 데이터베이스입니다. CREATE TABLE부터 작성합니다.",
      previewSql: "SELECT 1;",
      samplePreview: [
        {
          label: "만들 kickboard 컬럼 (목표 스키마)",
          columns: ["컬럼", "타입", "제약"],
          rows: [
            ["id", "INTEGER", "PRIMARY KEY"],
            ["model", "TEXT", "NOT NULL"],
            ["battery", "INTEGER", ""],
            ["price", "INTEGER", "UNIQUE"],
          ],
        },
      ],
    },
    kickboard_ready: {
      tableName: "kickboard",
      schemaText: "kickboard: id, model, battery, price (빈 테이블)",
      previewSql: "PRAGMA table_info(kickboard);",
    },
    kickboard_norm: {
      tableName: "customer",
      schemaText: "customer: 비정규화 킥보드 대여 데이터 (1NF 실습)",
      previewSql: "SELECT * FROM customer;",
    },
    kickboard_2nf: {
      tableName: "customer",
      schemaText: "customer: id, name, phone (2NF 실습 — borrow 분리)",
      previewSql: "SELECT * FROM customer;",
    },
    kickboard_3nf: {
      tableName: "customer / company",
      schemaText: "customer, company (3NF 실습)",
      previewQueries: ["SELECT * FROM customer;", "SELECT * FROM company;"],
    },
    sql_structure: {
      tableName: "SQL 구조 학습 통합 DB",
      schemaText: [
        "── 레시피·키워드 연습용 통합 테이블 (sql.js 실시간) ──",
        "",
        "Employee  : EmployeeID, Name, ReportsTo, BirthDate, Country, Age",
        "Customer  : CustomerID, Name, Country, Age, City",
        "book      : id, title, category, price, rating, stock, publisher",
        "Invoice   : InvoiceId, CustomerId, InvoiceDate, BillingCountry, Total",
        "employees : emp_no, first_name, superior_no",
        "salaries  : emp_no, salary, from_date",
        "request_past / request_new : name, number (UNION 연습)",
      ].join("\n"),
      previewQueries: [
        "SELECT * FROM Employee LIMIT 5;",
        "SELECT * FROM book LIMIT 5;",
        "SELECT * FROM Customer LIMIT 5;",
      ],
      completions: {
        tables: [
          "Employee", "Customer", "book", "Invoice",
          "employees", "salaries", "request_past", "request_new",
        ],
        columns: {
          Employee: ["EmployeeID", "Name", "ReportsTo", "BirthDate", "Country", "Age"],
          Customer: ["CustomerID", "Name", "Country", "Age", "City"],
          book: ["id", "title", "category", "price", "rating", "stock", "publisher"],
          Invoice: ["InvoiceId", "CustomerId", "InvoiceDate", "BillingCountry", "Total"],
          employees: ["emp_no", "first_name", "superior_no"],
          salaries: ["emp_no", "salary", "from_date"],
          request_past: ["name", "number"],
          request_new: ["name", "number"],
        },
      },
    },
  };

  let sqlDb = null;
  let sqlInitPromise = null;
  let sqlSessionSchemaKey = null;
  let pyodide = null;
  let pyInitPromise = null;
  let pyPackagesLoaded = new Set();
  let pyDatasetsMounted = new Set();
  let pyStdoutChunks = [];
  let pyStderrChunks = [];
  const refOutputCache = new Map();

  const PY_DATA_ROOT = "/data";
  const PY_EMPTY_OUTPUT = "(출력 없음)";

  function getPyDatasetsMap() {
    return typeof window !== "undefined" && window.PY_DATASETS ? window.PY_DATASETS : {};
  }

  let pyMplHookReady = false;
  let pyKoreanFontReady = false;
  let lastPlotB64 = null;

  const PY_FONT_DIR = "/fonts";
  const PY_FONT_FILE = `${PY_FONT_DIR}/NanumGothic-Regular.ttf`;
  const PY_FONT_URL = "fonts/NanumGothic-Regular.ttf";

  function isMatplotlibItem(item, code = "") {
    const blob = [item?.starterCode, item?.referenceCode, item?.setupCode, code].join("\n");
    if (item?.packages?.includes("matplotlib")) return true;
    return /\bmatplotlib\b|plt\.show\s*\(/i.test(blob);
  }

  function filterPyStderr(stderr) {
    if (!stderr?.trim()) return "";
    return stderr
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        if (!t) return false;
        if (t.includes("UserWarning")) return false;
        if (t.includes("Glyph") && t.includes("missing from font")) return false;
        return true;
      })
      .join("\n")
      .trim();
  }

  function removeStrayMatplotlibDom() {
    if (typeof document === "undefined") return;
    document.querySelectorAll("body > div").forEach((node) => {
      if (node.querySelector?.("canvas")) {
        const id = node.id || "";
        if (id.includes("matplotlib") || id.includes("figure") || node.className?.includes?.("mpl")) {
          node.remove();
        }
      }
    });
  }

  function studyShowPlotFigure(b64) {
    lastPlotB64 = b64 || null;
  }

  async function ensureKoreanMatplotlibFont() {
    if (pyKoreanFontReady) return;
    await initPython();
    try {
      pyodide.FS.mkdirTree(PY_FONT_DIR);
    } catch (_) {
      /* already exists */
    }
    if (!pyDatasetsMounted.has(PY_FONT_FILE)) {
      const res = await fetch(PY_FONT_URL);
      if (!res.ok) {
        throw new Error(
          "한글 그래프 폰트를 불러오지 못했습니다. 로컬 서버로 열었는지 확인하세요."
        );
      }
      pyodide.FS.writeFile(PY_FONT_FILE, new Uint8Array(await res.arrayBuffer()));
      pyDatasetsMounted.add(PY_FONT_FILE);
    }
    await pyodide.runPythonAsync(`
import matplotlib.font_manager as fm
fm.fontManager.addfont("${PY_FONT_FILE}")
`);
    pyKoreanFontReady = true;
  }

  async function ensureMatplotlibSandboxHook() {
    if (pyMplHookReady) return;
    await ensureKoreanMatplotlibFont();
    await pyodide.loadPackage("matplotlib");
    pyPackagesLoaded.add("matplotlib");
    if (typeof globalThis !== "undefined") {
      globalThis.study_show_plot = studyShowPlotFigure;
    }
    await pyodide.runPythonAsync(`
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
import matplotlib
matplotlib.use("AGG")
import matplotlib.font_manager as fm
import matplotlib.pyplot as plt
fm.fontManager.addfont("${PY_FONT_FILE}")
plt.rcParams["font.family"] = "NanumGothic"
plt.rcParams["axes.unicode_minus"] = False
from io import BytesIO
import base64

def _study_plt_show(*args, **kwargs):
    fig = plt.gcf()
    if not fig.get_axes():
        plt.close(fig)
        return
    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=110, bbox_inches="tight", facecolor="white")
    buf.seek(0)
    from js import study_show_plot
    study_show_plot(base64.b64encode(buf.read()).decode("ascii"))
    plt.close(fig)

plt.show = _study_plt_show
`);
    pyMplHookReady = true;
  }

  async function ensurePyPackages(packages = []) {
    await initPython();
    const need = new Set(packages.filter(Boolean));
    if (need.has("pandas")) need.add("numpy");
    if (need.has("matplotlib")) {
      await ensureMatplotlibSandboxHook();
      need.delete("matplotlib");
    }
    for (const pkg of need) {
      if (pyPackagesLoaded.has(pkg)) continue;
      await pyodide.loadPackage(pkg);
      pyPackagesLoaded.add(pkg);
    }
  }

  function mountPyDatasets(names = []) {
    if (!pyodide) return;
    const map = getPyDatasetsMap();
    try {
      pyodide.FS.mkdirTree(PY_DATA_ROOT);
    } catch (_) {
      /* already exists */
    }
    for (const name of names) {
      const ds = map[name];
      if (!ds?.file || !ds?.csv) continue;
      const path = `${PY_DATA_ROOT}/${ds.file}`;
      if (pyDatasetsMounted.has(path)) continue;
      pyodide.FS.writeFile(path, ds.csv);
      pyDatasetsMounted.add(path);
    }
  }

  function collectDatasetNames(item, userCode = "") {
    const names = new Set();
    if (!item) return [];
    if (item.dataset) names.add(item.dataset);
    if (Array.isArray(item.datasets)) {
      item.datasets.forEach((d) => names.add(d));
    }
    inferDatasetNamesFromCode(
      item.setupCode,
      item.starterCode,
      item.referenceCode,
      userCode
    ).forEach((d) => names.add(d));
    return [...names];
  }

  function inferDatasetNamesFromCode(...codes) {
    const names = new Set();
    const map = getPyDatasetsMap();
    const fileToKey = {};
    for (const [key, ds] of Object.entries(map)) {
      if (ds?.file) fileToKey[ds.file] = key;
    }
    for (const code of codes) {
      if (!code) continue;
      const re = /\/data\/([A-Za-z0-9_.-]+\.csv)/g;
      let m;
      while ((m = re.exec(code))) {
        const key = fileToKey[m[1]];
        if (key) names.add(key);
      }
    }
    return [...names];
  }

  function parseCsvText(csvText, maxRows = 5) {
    if (!csvText?.trim()) return { columns: [], rows: [] };
    const lines = csvText.trim().split(/\r?\n/);
    const parseLine = (line) => {
      const cells = [];
      let cur = "";
      let quoted = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          quoted = !quoted;
          continue;
        }
        if (c === "," && !quoted) {
          cells.push(cur);
          cur = "";
          continue;
        }
        cur += c;
      }
      cells.push(cur);
      return cells;
    };
    const columns = parseLine(lines[0]);
    const rows = lines.slice(1, 1 + maxRows).map(parseLine);
    return { columns, rows };
  }

  function getDatasetPreview(datasetKey, maxRows = 5) {
    const ds = getPyDatasetsMap()[datasetKey];
    if (!ds?.csv) return null;
    const { columns, rows } = parseCsvText(ds.csv, maxRows);
    return {
      key: datasetKey,
      file: ds.file,
      label: ds.file || datasetKey,
      columns,
      rows,
    };
  }

  function formatDatasetPreviewHtml(preview) {
    if (!preview?.columns?.length) return "";
    const thead = `<tr>${preview.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
    const body = preview.rows
      .map(
        (row) =>
          `<tr>${row.map((c) => `<td>${escapeHtml(String(c ?? ""))}</td>`).join("")}</tr>`
      )
      .join("");
    return (
      `<p class="guide-ref-label">${escapeHtml(preview.label)} <span class="guide-ref-meta">(상위 ${preview.rows.length}행)</span></p>` +
      `<div class="guide-ref-table-wrap"><table class="guide-ref-table"><thead>${thead}</thead><tbody>${body}</tbody></table></div>`
    );
  }

  let dfPreviewHelperReady = false;

  async function ensureDfPreviewHelper() {
    await initPython();
    if (dfPreviewHelperReady) return;
    pyodide.runPython(`
def __study_df_preview(var_name, max_rows=8):
    import pandas as pd
    g = globals()
    if var_name not in g:
        return None
    v = g[var_name]
    if not isinstance(v, pd.DataFrame):
        return None
    if len(v) == 0:
        return {"name": var_name, "columns": [str(c) for c in v.columns], "rows": [], "total": 0}
    head = v.head(max_rows)
    rows = []
    for row in head.itertuples(index=False, name=None):
        rows.append(["" if x is None else str(x) for x in row])
    return {
        "name": var_name,
        "columns": [str(c) for c in head.columns],
        "rows": rows,
        "total": int(len(v)),
    }
`);
    dfPreviewHelperReady = true;
  }

  function inferDataFramePreviewNames(item, userCode) {
    const names = [];
    const todo = (item?.starterCode || "").match(/(\w+)\s*=\s*None\s*#/);
    if (todo) names.push(todo[1]);

    const code = String(userCode || "");
    const assignRe = /(\w+)\s*=\s*(?:df|mm|april|merged)\s*[\[.]/g;
    let match;
    while ((match = assignRe.exec(code))) {
      names.push(match[1]);
    }

    return [...new Set(names.filter(Boolean))];
  }

  function prioritizeDataFramePreviews(previews, item) {
    if (!previews?.length) return [];
    const todo = (item?.starterCode || "").match(/(\w+)\s*=\s*None\s*#/)?.[1];
    if (todo) {
      const target = previews.find((p) => p.name === todo);
      if (target) return [target];
    }
    const nonDf = previews.filter((p) => p.name !== "df");
    if (nonDf.length) {
      return nonDf.sort((a, b) => a.total - b.total).slice(0, 2);
    }
    return previews.slice(0, 1);
  }

  async function collectDataFramePreviews(globals, item, userCode) {
    const names = inferDataFramePreviewNames(item, userCode);
    if (!names.length) return [];

    await ensureDfPreviewHelper();
    const previews = [];

    for (const name of names) {
      try {
        const exists = pyodide.runPython(`'${name}' in globals()`, { globals });
        if (!exists) continue;
        const raw = pyodide.runPython(`__study_df_preview(${JSON.stringify(name)})`, { globals });
        if (!raw) continue;
        const preview = raw.toJs ? raw.toJs() : raw;
        if (preview?.columns) previews.push(preview);
      } catch {
        /* skip invalid variable */
      }
    }

    return prioritizeDataFramePreviews(previews, item);
  }

  function formatDataFramePreviewHtml(preview, options = {}) {
    if (!preview?.columns?.length) {
      if (preview?.total === 0) {
        return `<p class="guide-ref-label">${escapeHtml(preview.name)} <span class="guide-ref-meta">(0행)</span></p><p class="guide-tip-muted">조건에 맞는 행이 없습니다.</p>`;
      }
      return "";
    }
    const thead = `<tr>${preview.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;
    const body = (preview.rows || [])
      .map(
        (row) =>
          `<tr>${row.map((c) => `<td>${escapeHtml(String(c ?? ""))}</td>`).join("")}</tr>`
      )
      .join("");
    const shown = preview.rows?.length || 0;
    const total = preview.total ?? shown;
    const label =
      options.label ||
      `${preview.name} — ${total}행 중 ${shown}행`;
    return (
      `<div class="guide-ref-block guide-ref-block--run">` +
      `<p class="guide-ref-label">${escapeHtml(label)}</p>` +
      `<div class="guide-ref-table-wrap"><table class="guide-ref-table guide-ref-table--run"><thead>${thead}</thead><tbody>${body}</tbody></table></div>` +
      `</div>`
    );
  }

  function formatDataFramePreviewsHtml(previews) {
    if (!previews?.length) return "";
    return previews.map((p) => formatDataFramePreviewHtml(p)).join("");
  }

  async function preparePythonItem(item, userCode = "") {
    await ensurePyPackages(item?.packages || []);
    mountPyDatasets(collectDatasetNames(item, userCode));
  }

  async function executePythonWithItem(userCode, item, options = {}) {
    await preparePythonItem(item, userCode);
    if (isMatplotlibItem(item, userCode)) {
      await ensureMatplotlibSandboxHook();
    }
    lastPlotB64 = null;
    const globals = options.globals || makeFreshGlobals();
    resetPyCapture();
    if (item?.setupCode?.trim()) {
      pyodide.runPython(item.setupCode, { globals });
    }
    const trimmed = String(userCode || "").trim();
    if (trimmed) {
      pyodide.runPython(trimmed, { globals });
    }
    removeStrayMatplotlibDom();
    const { stdout, stderr } = getPyCaptureText();
    const cleanStderr = filterPyStderr(stderr);
    const text = stdout.trim() || (cleanStderr ? "" : PY_EMPTY_OUTPUT);
    const previews = await collectDataFramePreviews(globals, item, trimmed);
    return {
      ok: true,
      globals,
      text,
      stdout,
      stderr: cleanStderr,
      plotB64: lastPlotB64,
      previews,
    };
  }

  function resetPyCapture() {
    pyStdoutChunks = [];
    pyStderrChunks = [];
  }

  function getPyCaptureText() {
    return {
      stdout: pyStdoutChunks.join(""),
      stderr: pyStderrChunks.join(""),
    };
  }

  function normalizePythonOutput(text) {
    const raw = String(text || "")
      .replace(/\r\n/g, "\n")
      .replace(/\(출력 없음[^)]*\)/g, "")
      .trim();
    if (!raw) return "";
    return raw
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
  }

  function outputsMatch(actual, expected) {
    return normalizePythonOutput(actual) === normalizePythonOutput(expected);
  }

  function summarizePyError(stderr) {
    const text = String(stderr || "").trim();
    if (!text) return "";
    const lines = text.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim());
    if (!text.includes("Traceback")) return text;
    const errIdx = lines.findIndex((l) =>
      /^(?:[\w.]+Error|[\w.]+Exception|SyntaxError|IndentationError):/.test(l.trim())
    );
    if (errIdx >= 0) {
      const start = Math.max(0, errIdx - 2);
      return lines.slice(start).join("\n");
    }
    return lines.slice(-5).join("\n");
  }

  function formatPythonConsole(stdout, stderr, meta = {}) {
    const elice = meta.elice !== false;
    const chrome =
      '<div class="py-repl-chrome"><span class="py-repl-dot py-repl-dot--r"></span>' +
      '<span class="py-repl-dot py-repl-dot--y"></span><span class="py-repl-dot py-repl-dot--g"></span>' +
      `<span class="py-repl-title">${escapeHtml(meta.title || "터미널")}</span></div>`;

    if (meta.running) {
      const cursor = meta.streamUi
        ? '<span class="terminal-cursor-blink" aria-hidden="true">▍</span>'
        : "";
      const status = elice
        ? `<p class="py-elice-status terminal-running-msg">/* 코드가 실행되는 중입니다${cursor} */</p>`
        : `<div class="py-repl-line py-repl-status terminal-running-msg">▶ 실행 중…${cursor}</div>`;
      return `<div class="py-repl terminal-running-panel">${chrome}<div class="py-repl-body">${status}</div></div>`;
    }

    if (meta.idle) {
      const status = '<p class="py-elice-status">/* 코드가 실행되기를 기다리고 있습니다... */</p>';
      const hint = meta.hint
        ? `<p class="py-elice-hint">${escapeHtml(meta.hint)}</p>`
        : "";
      return `<div class="py-repl">${chrome}<div class="py-repl-body">${status}${hint}</div></div>`;
    }

    const body = [];
    const cleanErr = filterPyStderr(stderr);

    if (!elice && meta.command?.trim()) {
      const cmdLines = meta.command.trim().split("\n");
      cmdLines.forEach((line, i) => {
        const prompt = i === 0 ? "In [*]:" : "...:";
        body.push(
          `<div class="py-repl-line py-repl-in"><span class="py-repl-prompt">${prompt}</span><code>${escapeHtml(line)}</code></div>`
        );
      });
    }

    if (cleanErr) {
      const errText = elice ? summarizePyError(cleanErr) : cleanErr.trim();
      body.push(`<pre class="py-repl-out py-repl-err">${escapeHtml(errText)}</pre>`);
    } else {
      const out = stdout?.trim() ? stdout : meta.showEmpty === false ? "" : PY_EMPTY_OUTPUT;
      if (out && out !== PY_EMPTY_OUTPUT) {
        body.push(
          `<pre class="py-repl-out${elice ? " py-repl-out--plain" : ""}">${escapeHtml(out.trim())}</pre>`
        );
      } else if (!elice && out === PY_EMPTY_OUTPUT) {
        body.push(`<pre class="py-repl-out">${escapeHtml(out)}</pre>`);
      }

      if (meta.plotB64) {
        body.push(
          '<div class="py-repl-plot-note">📊 그래프가 생성되었습니다. 실행 시 미리보기 창에서 확인할 수 있습니다.</div>'
        );
      }

      if (meta.resultPreviewHtml) {
        body.push(`<div class="py-repl-result-table">${meta.resultPreviewHtml}</div>`);
      }

      if (elice && meta.complete !== false) {
        body.push('<p class="py-elice-status">/* 코드 실행이 완료되었습니다! */</p>');
      }
    }

    const foot = [];
    const shownOut = stdout?.trim() || "";
    if (!meta.success && !cleanErr && normalizePythonOutput(shownOut) === "None") {
      foot.push(
        '<div class="py-repl-foot py-repl-hint">💡 <strong>None</strong> = TODO 변수가 비어 있음. 왼쪽 표에서 열을 확인한 뒤 코드를 작성하세요.</div>'
      );
    } else if (
      !meta.success &&
      !shownOut &&
      !cleanErr &&
      meta.showEmpty !== false &&
      !elice
    ) {
      foot.push(
        '<div class="py-repl-foot py-repl-hint">💡 출력 없음 — <code>print(변수)</code>로 결과를 보여주세요.</div>'
      );
    } else if (elice && !meta.success && !shownOut && !cleanErr && meta.showEmpty !== false) {
      foot.push(
        '<div class="py-repl-foot py-repl-hint py-repl-hint--compact">💡 <code>print()</code>로 결과를 출력하면 여기에 표시됩니다.</div>'
      );
    }
    if (meta.success) {
      foot.push('<div class="py-repl-foot py-repl-ok">✅ 정답 — 기대 출력과 일치합니다.</div>');
      if (meta.resultPreviewHtml) {
        foot.push(
          '<div class="py-repl-foot py-repl-hint">💡 왼쪽 <strong>실행 결과</strong> 표에서 필터·가공된 데이터를 확인하세요.</div>'
        );
      }
    } else if (meta.hint && !meta.idle) {
      foot.push(`<div class="py-repl-foot py-repl-hint">${escapeHtml(meta.hint)}</div>`);
    }

    return `<div class="py-repl">${chrome}<div class="py-repl-body">${body.join("")}${foot.join("")}</div></div>`;
  }

  function formatPythonIdleConsole(message) {
    return formatPythonConsole("", "", {
      idle: true,
      showEmpty: false,
      hint: message || "▶ [실행] 또는 Ctrl+Enter · 데이터 탐색 버튼으로 바로 실행",
    });
  }

  async function initPython() {
    if (pyodide) return pyodide;
    if (pyInitPromise) return pyInitPromise;

    pyInitPromise = (async () => {
      if (typeof loadPyodide !== "function") {
        throw new Error("Pyodide를 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 페이지를 새로고침하세요.");
      }
      resetPyCapture();
      pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        stdout: (text) => {
          pyStdoutChunks.push(text);
        },
        stderr: (text) => {
          pyStderrChunks.push(text);
        },
      });
      return pyodide;
    })();

    return pyInitPromise;
  }

  function makeFreshGlobals() {
    return pyodide.globals.get("dict")();
  }

  async function runPython(code, options = {}) {
    const item = options.item || null;
    const trimmed = String(code || "").trim();
    if (!trimmed && !item?.setupCode?.trim()) {
      return { ok: false, error: "실행할 Python 코드를 입력하세요." };
    }

    try {
      if (item) {
        const exec = await executePythonWithItem(trimmed, item);
        const resultPreviewHtml = formatDataFramePreviewsHtml(exec.previews);
        return {
          ok: true,
          text: exec.text,
          stdout: exec.stdout,
          stderr: exec.stderr,
          plotB64: exec.plotB64,
          previews: exec.previews,
          globals: exec.globals,
          html: formatPythonConsole(exec.stdout, exec.stderr, {
            plotB64: exec.plotB64,
            resultPreviewHtml,
          }),
        };
      }

      await initPython();
      resetPyCapture();
      const globals = options.fresh ? makeFreshGlobals() : undefined;
      if (globals) {
        pyodide.runPython(trimmed, { globals });
      } else {
        pyodide.runPython(trimmed);
      }
      const { stdout, stderr } = getPyCaptureText();
      const text = stdout.trim() || (stderr.trim() ? "" : PY_EMPTY_OUTPUT);
      return {
        ok: true,
        text,
        stdout,
        stderr,
        html: formatPythonConsole(stdout, stderr),
      };
    } catch (err) {
      const { stderr } = getPyCaptureText();
      const message = err.message || String(err);
      return {
        ok: false,
        error: message,
        stderr,
        html: formatPythonConsole("", stderr || message),
      };
    }
  }

  async function getReferencePythonOutput(item) {
    const validate = item?.validate || {};
    if (validate.expectedOutput != null && String(validate.expectedOutput).trim()) {
      return String(validate.expectedOutput);
    }
    if (!item?.referenceCode) return null;
    const cacheKey = `${item.id || ""}:${item.setupCode || ""}:${item.referenceCode}`;
    if (refOutputCache.has(cacheKey)) return refOutputCache.get(cacheKey);
    try {
      const exec = await executePythonWithItem(item.referenceCode, item);
      refOutputCache.set(cacheKey, exec.text);
      return exec.text;
    } catch (_) {
      return null;
    }
  }

  async function matchesReferenceOutput(run, item) {
    if (!run?.ok) return { comparable: false };
    if (isMatplotlibItem(item)) return { comparable: false };
    const expected = await getReferencePythonOutput(item);
    if (expected == null) return { comparable: false };
    const ok = outputsMatch(run.text, expected);
    return { comparable: true, ok, run, expected };
  }

  async function initSql() {
    if (sqlDb) return sqlDb;
    if (sqlInitPromise) return sqlInitPromise;

    sqlInitPromise = (async () => {
      const SQL = await initSqlJs({
        locateFile: (file) =>
          `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
      });
      sqlDb = new SQL.Database();
      return sqlDb;
    })();

    return sqlInitPromise;
  }

  function resetSchema(schemaKey) {
    const sql = SCHEMAS[schemaKey];
    if (!sql) throw new Error(`알 수 없는 스키마: ${schemaKey}`);
    sqlDb.exec(sql);
  }

  function resetSqlSession(schemaKey) {
    if (!schemaKey) {
      sqlSessionSchemaKey = null;
      return;
    }
    resetSchema(schemaKey);
    sqlSessionSchemaKey = schemaKey;
  }

  function ensureSqlSession(schemaKey, options = {}) {
    if (!schemaKey) return;
    if (options.fresh || sqlSessionSchemaKey !== schemaKey) {
      resetSqlSession(schemaKey);
    }
  }

  function formatCliTable(columns, rows) {
    if (!columns?.length) return "";
    const widths = columns.map((c, i) => {
      const cells = rows.map((r) => String(r[i] ?? "NULL"));
      return Math.max(String(c).length, ...cells.map((s) => s.length), 3);
    });
    const pad = (s, w) => s + " ".repeat(Math.max(0, w - s.length));
    const sep = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";
    const fmtRow = (r) =>
      "| " + r.map((c, i) => pad(String(c ?? "NULL"), widths[i])).join(" | ") + " |";
    const lines = [sep, fmtRow(columns), sep];
    rows.forEach((r) => lines.push(fmtRow(r)));
    lines.push(sep);
    return lines.join("\n");
  }

  function formatCliTableHtml(columns, rows) {
    const text = formatCliTable(columns, rows);
    return text ? `<pre class="sql-cli-table">${escapeHtml(text)}</pre>` : "";
  }

  function formatSqlConsole(innerHtml, meta = {}) {
    if (meta.running) {
      const cursor = meta.streamUi
        ? '<span class="terminal-cursor-blink" aria-hidden="true">▍</span>'
        : "";
      return (
        '<div class="sql-elice-console terminal-running-panel">' +
        `<p class="py-elice-status terminal-running-msg">/* 코드가 실행되는 중입니다${cursor} */</p></div>`
      );
    }
    if (meta.idle) {
      const hint = meta.hint
        ? `<p class="py-elice-hint">${escapeHtml(meta.hint)}</p>`
        : "";
      return (
        '<div class="sql-elice-console">' +
        '<p class="py-elice-status">/* 코드가 실행되기를 기다리고 있습니다... */</p>' +
        hint +
        "</div>"
      );
    }
    const parts = [];
    if (meta.error) {
      if (meta.failedSql) {
        parts.push(
          `<pre class="sql-cli-table sql-cli-table--err">${escapeHtml(meta.failedSql)}</pre>`
        );
      }
      parts.push(`<pre class="sql-cli-table sql-cli-table--err">${escapeHtml(meta.error)}</pre>`);
    } else {
      if (innerHtml) parts.push(innerHtml);
      if (meta.complete !== false) {
        parts.push('<p class="py-elice-status">/* 코드 실행이 완료되었습니다! */</p>');
      }
    }
    return `<div class="sql-elice-console">${parts.join("")}</div>`;
  }

  function formatSqlIdleConsole(hint) {
    return formatSqlConsole("", {
      idle: true,
      hint:
        hint ||
        "▶ [실행]: 커서까지 누적 실행(DB 상태 유지) · [전체 실행]: 모든 문장 · [초기화]: DB·코드 복원",
    });
  }

  function rowsToTable(result) {
    if (!result?.length) {
      return { columns: [], rows: [], text: "(결과 없음)" };
    }
    const { columns, values } = result[0];
    const header = columns.join(" | ");
    const sep = "-".repeat(Math.min(header.length, 60));
    const body = values.map((row) => row.join(" | ")).join("\n");
    const text = `${columns.join("\t")}\n${values.map((r) => r.join("\t")).join("\n")}`;
    return {
      columns,
      rows: values,
      text: `${header}\n${sep}\n${body}\n\n(${values.length}행)`,
      html: formatCliTableHtml(columns, values) || "<p class='sql-cli-muted'>(결과 없음)</p>",
    };
  }

  function formatTableHtml(columns, rows) {
    if (!columns.length) return "<p class='sandbox-empty'>(결과 없음)</p>";
    const th = columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
    const tr = rows
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell ?? ""))}</td>`).join("")}</tr>`
      )
      .join("");
    return `<div class="sandbox-table-wrap"><table class="sandbox-table"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table><p class="sandbox-meta">${rows.length}행</p></div>`;
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function runSql(query, schemaKey, options = {}) {
    await initSql();
    ensureSqlSession(schemaKey, { fresh: options.fresh === true });

    const mode = options.mode === "all" ? "all" : options.mode === "through" ? "through" : "single";
    let statements;
    let executedSql = "";

    if (mode === "all") {
      statements = filterRunnableStatements(splitSqlStatements(query));
      if (!statements.length) {
        return { ok: false, error: "실행할 SQL을 입력하세요." };
      }
      executedSql = statements.map((s) => s.trim()).join(";\n\n");
    } else if (mode === "through") {
      statements = pickStatementsThroughCursor(query, {
        cursor: options.cursor,
        selection: options.selection,
      });
      if (!statements.length) {
        return {
          ok: false,
          error: "실행할 SQL 문을 찾을 수 없습니다. 커서를 완성된 쿼리 안에 두고 [실행]하세요.",
        };
      }
      executedSql = statements.map((s) => s.trim()).join(";\n\n");
    } else {
      executedSql = pickStatementForRun(query, {
        cursor: options.cursor,
        selection: options.selection,
      });
      if (!executedSql) {
        return { ok: false, error: "실행할 SQL 문을 찾을 수 없습니다. 커서를 쿼리 안에 두고 [실행]하세요." };
      }
      statements = [executedSql];
    }

    const execResult = execStatementsOnDb(statements, {
      continueOnError: mode === "all" || mode === "through",
    });
    if (!execResult.ok) {
      return {
        ok: false,
        error: execResult.error,
        failedSql: execResult.failedStatement || executedSql,
      };
    }

    const formatted = formatMultiResults(execResult.allResults);
    formatted.executedSql = executedSql;
    formatted.mode = mode;
    return formatted;
  }

  function normalizeSql(sql) {
    return String(sql).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function isCommentOnly(stmt) {
    return stmt
      .split("\n")
      .every((line) => {
        const t = line.trim();
        return !t || t.startsWith("--");
      });
  }

  function splitSqlStatements(sql) {
    const statements = [];
    let current = "";
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < sql.length; i++) {
      const ch = sql[i];
      if (!inString && (ch === "'" || ch === '"')) {
        inString = true;
        stringChar = ch;
        current += ch;
      } else if (inString && ch === stringChar && sql[i - 1] !== "\\") {
        inString = false;
        current += ch;
      } else if (!inString && ch === ";") {
        const stmt = current.trim();
        if (stmt && !isCommentOnly(stmt)) statements.push(stmt);
        current = "";
      } else {
        current += ch;
      }
    }

    const tail = current.trim();
    if (tail && !isCommentOnly(tail)) statements.push(tail);
    return statements;
  }

  function splitSqlStatementsWithRanges(sql) {
    const statements = [];
    let current = "";
    let inString = false;
    let stringChar = "";
    let stmtStart = 0;
    let hasContent = false;

    for (let i = 0; i < sql.length; i++) {
      const ch = sql[i];
      if (!inString && (ch === "'" || ch === '"')) {
        inString = true;
        stringChar = ch;
        if (!hasContent) {
          stmtStart = i;
          hasContent = true;
        }
        current += ch;
      } else if (inString && ch === stringChar && sql[i - 1] !== "\\") {
        inString = false;
        current += ch;
      } else if (!inString && ch === ";") {
        const stmt = current.trim();
        if (stmt && !isCommentOnly(stmt)) {
          statements.push({ text: stmt, start: stmtStart, end: i + 1 });
        }
        current = "";
        hasContent = false;
        stmtStart = i + 1;
      } else {
        if (!hasContent && !/\s/.test(ch)) {
          stmtStart = i;
          hasContent = true;
        }
        current += ch;
      }
    }

    const tail = current.trim();
    if (tail && !isCommentOnly(tail)) {
      statements.push({ text: tail, start: stmtStart, end: sql.length });
    }
    return statements;
  }

  function unwrapSqlIdent(raw) {
    return String(raw || "")
      .replace(/^[`"'\[]+|[`"'\]]+$/g, "")
      .trim();
  }

  function isDescTableStatement(stmt) {
    const body = stripLineComments(stmt).trim();
    return /^\s*(?:DESC|DESCRIBE)\s+[`"[]?[A-Za-z_][\w]*[`"\]]?\s*;?\s*$/i.test(body);
  }

  function isSchemaDescribeStatement(stmt) {
    return isPragmaTableInfo(stmt) || isDescTableStatement(stmt);
  }

  function tableNameFromDescribe(stmt) {
    const body = stripLineComments(stmt).trim();
    let m = body.match(/table_info\s*\(\s*([`"'\[\]\w]+)\s*\)/i);
    if (m) return unwrapSqlIdent(m[1]);
    m = body.match(/^\s*(?:DESC|DESCRIBE)\s+([`"'\[\]\w]+)/i);
    if (m) return unwrapSqlIdent(m[1]);
    return "";
  }

  function stmtToPragmaTableInfo(stmt) {
    const body = stripLineComments(stmt).trim();
    if (!body) return body;
    if (isPragmaTableInfo(body)) return body.replace(/;+\s*$/, "");
    if (isDescTableStatement(body)) {
      const tbl = tableNameFromDescribe(body);
      return tbl ? `PRAGMA table_info(${tbl})` : body;
    }
    return body;
  }

  function pragmaToDescSql(sql) {
    return String(sql || "").replace(
      /\bPRAGMA\s+table_info\s*\(\s*([`"'\[\]\w]+)\s*\)/gi,
      (_, tbl) => `DESC ${unwrapSqlIdent(tbl)}`
    );
  }

  function isRunnableStatement(stmt) {
    const lower = normalizeSql(stripLineComments(stmt));
    if (/^\s*(?:desc|describe)\s+[`"'\w]/.test(lower)) return true;
    return /^\s*(with|select|pragma|insert|update|delete|create|drop|alter)\b/.test(lower);
  }

  function isIncompletePracticeStatement(stmt) {
    const body = stripLineComments(stmt);
    if (!body) return true;
    if (/\/\*\s*TODO/i.test(body)) return true;
    if (/\bTODO\b/i.test(body)) return true;
    return false;
  }

  function filterRunnableStatements(statements) {
    return statements.filter((st) => !isIncompletePracticeStatement(st));
  }

  function pickStatementsThroughCursor(sql, options = {}) {
    const text = String(sql || "");
    const selection = String(options.selection || "").trim();
    if (selection && isRunnableStatement(selection)) {
      return [selection];
    }

    const cursor = Number.isFinite(options.cursor) ? options.cursor : text.length;
    const statements = splitSqlStatementsWithRanges(text);
    if (!statements.length) return [];

    let endIdx = statements.findIndex((st) => cursor >= st.start && cursor <= st.end);
    if (endIdx < 0) {
      for (let i = statements.length - 1; i >= 0; i--) {
        if (statements[i].start <= cursor) {
          endIdx = i;
          break;
        }
      }
    }
    if (endIdx < 0) endIdx = 0;

    return filterRunnableStatements(
      statements.slice(0, endIdx + 1).map((st) => st.text)
    );
  }

  function pragmaResultToDescShape(stmt, result) {
    const tableName = tableNameFromDescribe(stmt);
    const descColumns = ["Field", "Type", "Null", "Key", "Default", "Extra"];
    const descRows = (result.values || []).map((row) => {
      const name = row[1];
      const type = row[2];
      const notnull = row[3];
      const dflt = row[4];
      const pk = row[5];
      return [
        name,
        type,
        notnull == 1 || notnull === "1" ? "NO" : "YES",
        pk == 1 || pk === "1" ? "PRI" : "",
        dflt == null || dflt === "" ? "NULL" : String(dflt),
        "",
      ];
    });
    return { tableName, columns: descColumns, values: descRows };
  }

  function resultItemToDisplay(item) {
    if (item.empty) {
      return {
        empty: true,
        emptyMsg: isPragmaTableInfo(item.statement) ? "Empty set" : "(행 없음)",
      };
    }
    if (isSchemaDescribeStatement(item.statement)) {
      const desc = pragmaResultToDescShape(item.statement, item.result);
      return {
        columns: desc.columns,
        values: desc.values,
        isDesc: true,
        tableName: desc.tableName,
      };
    }
    return {
      columns: item.result.columns,
      values: item.result.values,
    };
  }

  function pickStatementForRun(sql, options = {}) {
    const text = String(sql || "");
    const selection = String(options.selection || "").trim();
    if (selection && isRunnableStatement(selection)) {
      return selection;
    }

    const cursor = Number.isFinite(options.cursor) ? options.cursor : text.length;
    const statements = splitSqlStatementsWithRanges(text);
    if (!statements.length) return null;

    const containing = statements.find((st) => cursor >= st.start && cursor <= st.end);
    if (containing) return containing.text;

    for (let i = statements.length - 1; i >= 0; i--) {
      if (statements[i].start <= cursor) return statements[i].text;
    }
    return statements[statements.length - 1].text;
  }

  function formatExecutedSqlLabel(sql) {
    const lines = String(sql || "").split("\n");
    const preview = lines.length > 6 ? `${lines.slice(0, 6).join("\n")}\n…` : lines.join("\n");
    return `<div class="sandbox-run-header"><p class="sandbox-run-label">▸ 실행한 쿼리 (sql.js 실시간)</p><pre class="sandbox-run-sql">${escapeHtml(preview)}</pre></div>`;
  }

  function isSelectLike(stmt) {
    const lower = normalizeSql(stmt);
    return /^\s*(with|select)\b/.test(lower);
  }

  function pickGradableSql(sql) {
    const statements = splitSqlStatements(sql);
    const merged = [];
    for (const stmt of statements) {
      const head = stripLineComments(stmt).trim();
      if (/^(UNION(?:\s+ALL)?|INTERSECT|EXCEPT)\b/i.test(head) && merged.length) {
        merged[merged.length - 1] = `${merged[merged.length - 1]}\n${stmt}`;
      } else {
        merged.push(stmt);
      }
    }
    for (let i = merged.length - 1; i >= 0; i--) {
      if (isSelectLike(merged[i])) return merged[i];
    }
    return merged[merged.length - 1] || String(sql || "").trim();
  }

  function stripLineComments(sql) {
    return String(sql)
      .split("\n")
      .map((line) => {
        let inString = false;
        let quote = "";
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (!inString && (ch === "'" || ch === '"')) {
            inString = true;
            quote = ch;
            continue;
          }
          if (inString && ch === quote && line[i - 1] !== "\\") {
            inString = false;
            continue;
          }
          if (!inString && ch === "-" && line[i + 1] === "-") {
            return line.slice(0, i).trimEnd();
          }
        }
        return line;
      })
      .join("\n")
      .trim();
  }

  function isDdlStatement(stmt) {
    const head = stripLineComments(stmt).trim();
    return /^(create|drop|alter|insert|update|delete|pragma)\b/i.test(head);
  }

  function statementSuccessMessage(stmt) {
    const body = stripLineComments(stmt).trim();
    const dropMatch = body.match(
      /^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?[`"[]?([A-Za-z_][\w]*)[`"\]]?/i
    );
    if (dropMatch) {
      return `테이블 '${dropMatch[1]}'이(가) 삭제되었습니다.`;
    }
    if (/^CREATE\s+TABLE\b/i.test(body)) {
      const createMatch = body.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"[]?([A-Za-z_][\w]*)[`"\]]?/i);
      return createMatch
        ? `테이블 '${createMatch[1]}'이(가) 생성되었습니다.`
        : "테이블이 생성되었습니다.";
    }
    if (/^ALTER\s+TABLE\b/i.test(body)) return "테이블 구조가 변경되었습니다.";
    if (/^INSERT\b/i.test(body)) return "데이터가 삽입되었습니다.";
    if (/^UPDATE\b/i.test(body)) return "데이터가 수정되었습니다.";
    if (/^DELETE\b/i.test(body)) return "데이터가 삭제되었습니다.";
    if (isSchemaDescribeStatement(body)) return "";
    return "쿼리가 성공적으로 실행되었습니다.";
  }

  function execStatementsOnDb(statements, options = {}) {
    const continueOnError = options.continueOnError === true;
    const allResults = [];
    for (const stmt of statements) {
      const cleaned = stmtToPragmaTableInfo(stmt);
      if (!cleaned) continue;
      try {
        const results = sqlDb.exec(cleaned);
        if (results?.length) {
          results.forEach((result) => {
            allResults.push({ statement: stmt, result });
          });
        } else {
          allResults.push({
            statement: stmt,
            empty: true,
            successMsg: statementSuccessMessage(stmt),
          });
        }
      } catch (err) {
        const message = err.message || String(err);
        if (continueOnError) {
          allResults.push({ statement: stmt, error: message });
          continue;
        }
        return { ok: false, error: message, failedStatement: cleaned, allResults };
      }
    }
    return { ok: true, allResults };
  }

  function isPragmaTableInfo(stmt) {
    return /^\s*PRAGMA\s+table_info\s*\(/i.test(String(stmt || "").trim());
  }

  function queryLabelFromStatement(stmt, idx, total) {
    if (isSchemaDescribeStatement(stmt)) {
      const name = tableNameFromDescribe(stmt);
      return name ? `DESC ${name}` : "DESC";
    }
    if (total > 1) return `쿼리 ${idx + 1} 결과`;
    return "";
  }

  function normalizePreviewQueries(meta) {
    if (!meta) return [];
    const raw =
      meta.previewQueries ||
      (meta.previewSql ? String(meta.previewSql).split(/\n--\n/) : []).filter(Boolean);
    return raw
      .map((entry) => {
        if (typeof entry === "string") {
          const sql = entry.trim();
          if (!sql) return null;
          const fromMatch = sql.match(/FROM\s+[`"[]?([A-Za-z_][\w]*)[`"\]]?/i);
          return { label: fromMatch ? fromMatch[1] : "조회", sql };
        }
        if (!entry?.sql) return null;
        return { label: entry.label || "조회", sql: String(entry.sql).trim() };
      })
      .filter(Boolean);
  }

  function getProbeQueries(schemaKey) {
    return normalizePreviewQueries(TABLE_META[schemaKey]);
  }

  function getSamplePreviewTables(schemaKey) {
    const meta = TABLE_META[schemaKey];
    return meta?.samplePreview ? [...meta.samplePreview] : [];
  }

  function formatMultiResults(allResults) {
    if (!allResults?.length) {
      return {
        ok: true,
        columns: [],
        rows: [],
        text: "(결과 없음)",
        html: "<p class='sandbox-empty'>(결과 없음 — PRAGMA/DDL은 표가 없을 수 있습니다)</p>",
      };
    }

    const htmlParts = [];
    const textParts = [];
    let lastTable = null;

    allResults.forEach((item, idx) => {
      const title = queryLabelFromStatement(item.statement, idx, allResults.length);
      const label = title ? `<p class="sandbox-query-label sandbox-query-label--sub">${escapeHtml(title)}</p>` : "";
      if (item.error) {
        htmlParts.push(
          `${label}<pre class="sql-cli-table sql-cli-table--err">${escapeHtml(item.error)}</pre>`
        );
        textParts.push(`${title || `쿼리 ${idx + 1}`}: ERROR ${item.error}`);
        return;
      }
      if (item.empty) {
        const display = resultItemToDisplay(item);
        const emptyMsg =
          item.successMsg || display.emptyMsg || "(행 없음)";
        htmlParts.push(`${label}<p class="sql-cli-muted sql-cli-ok">${escapeHtml(emptyMsg)}</p>`);
        textParts.push(`${title || `쿼리 ${idx + 1}`}: ${emptyMsg}`);
      } else {
        const display = resultItemToDisplay(item);
        const table = rowsToTable([
          { columns: display.columns, values: display.values },
        ]);
        htmlParts.push(`${label}${table.html}`);
        textParts.push(title ? `--- ${title} ---\n${table.text}` : table.text);
        lastTable = table;
      }
    });

    return {
      ok: true,
      columns: lastTable?.columns || [],
      rows: lastTable?.rows || [],
      text: textParts.join("\n\n"),
      html: htmlParts.join(""),
    };
  }

  function cellEqual(a, b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return Math.abs(na - nb) < 0.001;
    }
    return String(a).trim() === String(b).trim();
  }

  function alignRows(values, fromCols, toCols) {
    const indexByCol = {};
    fromCols.forEach((c, i) => {
      indexByCol[c.toLowerCase()] = i;
    });
    return values.map((row) =>
      toCols.map((col) => {
        const idx = indexByCol[col.toLowerCase()];
        return idx === undefined ? null : row[idx];
      })
    );
  }

  function compareResultSets(expected, actual, validate = {}, guide = {}) {
    if (!expected?.columns?.length && !actual?.columns?.length) {
      return { ok: true };
    }
    if (!expected || !actual?.columns?.length) {
      return { ok: false, message: "쿼리 결과가 없습니다. SELECT 문과 컬럼을 확인해 보세요." };
    }

    const expCols = expected.columns;
    const actCols = actual.columns;
    const expLower = expCols.map((c) => c.toLowerCase());
    const actLower = actCols.map((c) => c.toLowerCase());
    const strictOrder = validate.strictColumnOrder === true;

    if (strictOrder) {
      if (expLower.join("|") !== actLower.join("|")) {
        return {
          ok: false,
          message: `컬럼 순서가 다릅니다. 기대: ${expCols.join(", ")} / 실제: ${actCols.join(", ")}`,
        };
      }
    } else {
      const expSet = new Set(expLower);
      const missing = expCols.filter((c) => !actLower.includes(c.toLowerCase()));
      if (missing.length) {
        return {
          ok: false,
          message: `결과에 필요한 컬럼이 없습니다: ${missing.join(", ")}`,
        };
      }
      const extra = actCols.filter((c) => !expSet.has(c.toLowerCase()));
      if (extra.length && validate.allowExtraColumns !== true) {
        return {
          ok: false,
          level: "partial",
          message: `불필요한 컬럼이 포함되어 있습니다: ${extra.join(", ")}. 지시사항의 컬럼만 선택해 보세요.`,
        };
      }
    }

    const minRows = validate.minRows ?? 1;
    if ((actual.values?.length || 0) < minRows) {
      return { ok: false, message: `결과 행이 ${minRows}개 이상이어야 합니다.` };
    }

    const compareCols = strictOrder ? expCols : expCols;
    const expRows = alignRows(expected.values || [], expCols, compareCols);
    const actRows = alignRows(actual.values || [], actCols, compareCols);

    const orderMatters = validate.orderMatters !== false;
    if (orderMatters) {
      const sameLen = expRows.length === actRows.length;
      const sameData =
        sameLen &&
        expRows.every((row, ri) => row.every((cell, ci) => cellEqual(cell, actRows[ri][ci])));
      if (!sameData) {
        return {
          ok: false,
          level: "partial",
          message:
            "컬럼은 맞지만 행 내용 또는 정렬 순서가 모범 답안과 다릅니다. [실행]으로 결과를 비교해 보세요.",
        };
      }
    } else {
      const serialize = (rows) =>
        rows
          .map((r) => r.map((c) => String(c ?? "")).join("\t"))
          .sort()
          .join("\n");
      if (serialize(expRows) !== serialize(actRows)) {
        return { ok: false, message: "행 데이터가 모범 답안과 다릅니다." };
      }
    }

    if (guide?.outputColumns?.length && !strictOrder) {
      const actSet = new Set(actLower);
      const need = guide.outputColumns.map((c) => c.toLowerCase());
      const lack = need.filter((c) => !actSet.has(c));
      if (lack.length) {
        return {
          ok: false,
          message: `지시사항 컬럼이 결과에 없습니다: ${lack.join(", ")}`,
        };
      }
    }

    return { ok: true };
  }

  function runScriptOnFreshSchema(schemaKey, query) {
    resetSqlSession(schemaKey);
    const statements = filterRunnableStatements(splitSqlStatements(query));
    if (!statements.length) {
      throw new Error("실행할 SQL이 없습니다.");
    }
    const execResult = execStatementsOnDb(statements, { continueOnError: true });
    return execResult;
  }

  function runQueryOnFreshSchema(schemaKey, query) {
    const execResult = runScriptOnFreshSchema(schemaKey, query);
    if (!execResult.ok) {
      throw new Error(execResult.error);
    }
    const withData = execResult.allResults.filter((r) => r.result);
    if (!withData.length) {
      return { result: null, execResult };
    }
    return { result: withData[withData.length - 1].result, execResult };
  }

  function tableExistsInSession(tableName) {
    const name = String(tableName || "").trim();
    if (!name) return false;
    const rows = sqlDb.exec(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${name.replace(/'/g, "''")}'`
    );
    return !!(rows[0]?.values?.length);
  }

  function validateSql(query, validate = {}) {
    const nq = normalizeSql(query);
    const patterns = (validate.patterns || []).map((p) => p.toLowerCase());
    const missing = patterns.filter((p) => !nq.includes(p));
    if (missing.length) {
      return {
        ok: false,
        message: `쿼리에 필요한 요소가 빠졌습니다: ${missing.join(", ")}`,
      };
    }
    if (validate.forbidden) {
      const bad = validate.forbidden.find((p) => nq.includes(p.toLowerCase()));
      if (bad) return { ok: false, message: `사용하면 안 되는 요소: ${bad}` };
    }
    return { ok: true };
  }

  async function gradeSql(query, item) {
    const validate = item.validate || {};
    const schemaKey = item.sandbox || "book";
    const gradable = pickGradableSql(query);

    if (!gradable) {
      return { level: "wrong", message: "채점할 SQL 문이 없습니다." };
    }

    await initSql();

    if (item.referenceSql && isSelectLike(gradable)) {
      try {
        const refSql = pickGradableSql(item.referenceSql) || item.referenceSql.trim();
        const expected = runQueryOnFreshSchema(schemaKey, refSql);
        const actual = runQueryOnFreshSchema(schemaKey, gradable);
        const cmp = compareResultSets(
          expected.result,
          actual.result,
          validate,
          item.practiceGuide
        );
        const run = rowsToTable(actual.result ? [actual.result] : []);

        if (cmp.ok) {
          return {
            level: "correct",
            message: "내 쿼리 실행 결과가 모범 답안과 일치합니다! (마지막 SELECT만 채점)",
            runResult: run,
          };
        }
        return {
          level: cmp.level || "wrong",
          message: `${cmp.message} [실행]으로 내 쿼리 결과를 먼저 확인해 보세요.`,
          runResult: run,
        };
      } catch (err) {
        return { level: "wrong", message: `실행 오류: ${err.message}` };
      }
    }

    const patternCheck = validateSql(query, validate);
    if (!patternCheck.ok) {
      const splitBySemi = splitSqlStatements(query);
      const hasSetOp = /\b(except|union|intersect)\b/i.test(normalizeSql(query));
      const brokenSetOp =
        hasSetOp &&
        splitBySemi.some((st) => /^(except|union|intersect)\b/i.test(stripLineComments(st).trim()));
      if (brokenSetOp) {
        return {
          level: "wrong",
          message:
            "EXCEPT/UNION/INTERSECT는 한 문장이어야 합니다. " +
            "첫 번째 SELECT 뒤에 ;(세미콜론)을 넣으면 쿼리가 끊깁니다. " +
            "위쪽 TODO 뼈대 코드는 지우고 아래처럼 한 덩어리로 작성하세요. " +
            patternCheck.message,
        };
      }
      if (splitBySemi.length > 1 && !isSelectLike(gradable)) {
        return {
          level: "wrong",
          message:
            "탐색은 [실행]으로 확인하세요. 채점은 마지막 SELECT(또는 PRAGMA) 문을 기준으로 합니다. " +
            patternCheck.message,
        };
      }
      return { level: "wrong", message: patternCheck.message };
    }

    try {
      const dropMatch = String(item.referenceSql || "").match(
        /DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?[`"[]?([A-Za-z_][\w]*)[`"\]]?/i
      );
      if (dropMatch) {
        const tableName = dropMatch[1];
        const scriptResult = runScriptOnFreshSchema(schemaKey, query);
        const failed = scriptResult.allResults?.find((r) => r.error);
        if (failed) {
          return { level: "wrong", message: `실행 오류: ${failed.error}` };
        }
        if (tableExistsInSession(tableName)) {
          return {
            level: "wrong",
            message: `테이블 '${tableName}'이(가) 아직 존재합니다. DROP TABLE이 실행되었는지 [실행]으로 확인하세요.`,
          };
        }
        return {
          level: "correct",
          message: `테이블 '${tableName}'이(가) 정상적으로 삭제되었습니다!`,
          runResult: {
            ok: true,
            text: `테이블 '${tableName}'이(가) 삭제되었습니다.`,
            html: `<p class="sql-cli-muted sql-cli-ok">테이블 '${escapeHtml(tableName)}'이(가) 삭제되었습니다.</p>`,
          },
        };
      }

      const actual = runQueryOnFreshSchema(schemaKey, gradable);
      const run = rowsToTable(actual.result ? [actual.result] : []);
      const minRows = validate.minRows ?? (actual.result ? 1 : 0);

      if (actual.result && (actual.result.values?.length || 0) < minRows) {
        return { level: "wrong", message: `결과 행이 ${minRows}개 이상이어야 합니다.` };
      }

      if (validate.requiredColumns?.length && actual.result) {
        const cols = (actual.result.columns || []).map((c) => c.toLowerCase());
        const need = validate.requiredColumns.map((c) => c.toLowerCase());
        const lack = need.filter((c) => !cols.includes(c));
        if (lack.length) {
          return {
            level: "partial",
            message: `결과 컬럼 확인: ${lack.join(", ")} 포함 필요`,
            runResult: run,
          };
        }
      }

      return {
        level: "correct",
        message: "쿼리가 정상 실행되었습니다!",
        runResult: run,
      };
    } catch (err) {
      return { level: "wrong", message: `실행 오류: ${err.message}` };
    }
  }

  async function gradePython(code, item) {
    const validate = item.validate || {};
    const nq = normalizeSql(code).replace(/;/g, "");

    if (validate.patterns?.length) {
      const missing = validate.patterns.filter((p) => !nq.includes(p.toLowerCase()));
      if (missing.length) {
        return { level: "wrong", message: `코드에 필요한 요소: ${missing.join(", ")}` };
      }
    }

    let run;
    try {
      const exec = await executePythonWithItem(code, item);
      run = {
        ok: true,
        text: exec.text,
        stdout: exec.stdout,
        stderr: exec.stderr,
        plotB64: exec.plotB64,
        previews: exec.previews,
        globals: exec.globals,
        html: formatPythonConsole(exec.stdout, exec.stderr, {
          plotB64: exec.plotB64,
          resultPreviewHtml: formatDataFramePreviewsHtml(exec.previews),
        }),
      };
    } catch (err) {
      return {
        level: "wrong",
        message: `실행 오류: ${err.message}`,
        runResult: { ok: false, error: err.message },
      };
    }

    if (validate.assertCode?.trim()) {
      try {
        pyodide.runPython(validate.assertCode, { globals: run.globals });
      } catch (err) {
        return {
          level: "wrong",
          message: `결과 검증 실패: ${err.message}`,
          runResult: run,
        };
      }
    }

    if (isMatplotlibItem(item, code)) {
      if (!run.plotB64) {
        return {
          level: "wrong",
          message: "plt.show()를 호출해 그래프를 표시했는지 확인하세요.",
          runResult: run,
        };
      }
      return {
        level: "correct",
        message: "정답입니다! 그래프 코드가 요구사항을 충족합니다.",
        runResult: {
          ...run,
          html: formatPythonConsole(run.stdout, run.stderr, {
            success: true,
            plotB64: run.plotB64,
          }),
        },
      };
    }

    const expected = await getReferencePythonOutput(item);
    if (expected != null) {
      if (!outputsMatch(run.text, expected)) {
        return {
          level: "wrong",
          message: "출력 결과가 기대값과 다릅니다. [실행]으로 결과를 확인해 보세요.",
          expected: normalizePythonOutput(expected),
          runResult: run,
        };
      }
      return {
        level: "correct",
        message: "정답입니다! 출력 결과가 일치합니다.",
        runResult: {
          ...run,
          html: formatPythonConsole(run.stdout, run.stderr, {
            success: true,
            resultPreviewHtml: formatDataFramePreviewsHtml(run.previews),
          }),
        },
      };
    }

    return {
      level: "correct",
      message: "코드가 정상 실행되었습니다!",
      runResult: run,
    };
  }

  async function previewTable(schemaKey, options = {}) {
    const meta = TABLE_META[schemaKey];
    if (!meta) return { ok: false, error: "테이블 정보가 없습니다." };
    await initSql();
    resetSqlSession(schemaKey);

    const previewQueries = normalizePreviewQueries(meta);
    if (!previewQueries.length) {
      return { ok: false, error: "테이블 정보가 없습니다." };
    }

    const elice = options.elice === true;
    const htmlParts = elice
      ? []
      : [
          `<div class="sandbox-preview"><p class="sandbox-preview-note">아래는 <strong>참고용 샘플 데이터</strong>입니다. 에디터 위 「테이블 탐색」 버튼으로도 바로 조회할 수 있습니다.</p><pre class="sandbox-schema-text">${escapeHtml(meta.schemaText)}</pre><p class="sandbox-preview-label">샘플 테이블 미리보기</p>`,
        ];
    const textParts = elice ? [] : [`${meta.schemaText}\n\n샘플 데이터:`];

    for (let i = 0; i < previewQueries.length; i++) {
      const { label, sql } = previewQueries[i];
      if (!sql) continue;
      const data = await runSql(sql, null, { mode: "single" });
      if (!data.ok) return data;
      const blockLabel =
        previewQueries.length > 1
          ? `<p class="sandbox-query-label">▸ ${escapeHtml(label)}</p>`
          : "";
      htmlParts.push(`${blockLabel}${data.html}`);
      textParts.push(data.text);
    }

    if (!elice) htmlParts.push("</div>");
    return {
      ok: true,
      html: htmlParts.join(""),
      text: textParts.join("\n\n"),
    };
  }

  function getTableMeta(schemaKey) {
    return TABLE_META[schemaKey] || null;
  }

  function getCompletionsForSchema(schemaKey) {
    const meta = TABLE_META[schemaKey];
    if (meta?.completions) return meta.completions;
    if (!meta?.tableName) return { tables: [], columns: {} };
    const name = meta.tableName.split("/")[0].trim();
    return { tables: [name], columns: {} };
  }

  return {
    initSql,
    initPython,
    runSql,
    resetSqlSession,
    runPython,
    gradeSql,
    gradePython,
    comparePythonWithReference: matchesReferenceOutput,
    matchesReferenceOutput,
    getReferencePythonOutput,
    formatPythonConsole,
    formatPythonIdleConsole,
    formatSqlConsole,
    formatSqlIdleConsole,
    formatCliTable,
    formatCliTableHtml,
    pragmaToDescSql,
    previewTable,
    getTableMeta,
    getProbeQueries,
    getSamplePreviewTables,
    getCompletionsForSchema,
    collectDatasetNames,
    getDatasetPreview,
    formatDatasetPreviewHtml,
    formatDataFramePreviewHtml,
    formatDataFramePreviewsHtml,
    collectDataFramePreviews,
    prioritizeDataFramePreviews,
    preparePythonItem,
    SCHEMAS,
    TABLE_META,
  };
})();
