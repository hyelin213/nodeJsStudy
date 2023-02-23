//-- 서버 JS --//

const path = require('path');
// path 라이브러리 이용(합치는 것) => + 쓸 거면 굳이 인폿 ㄴㄴ
const express = require('express');
const app = express();
// app 서버를 돌릴 수 있게 셋팅하는 것

const port = 3000;
const getConn = require('./mariadb');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// post 방식으로 오는 자료를 받을 수 있는 코드

app.set('views', path.join(__dirname, 'views')); // views : 폴더명
app.set('view engine', 'ejs');
// 템플릿 엔진 셋팅 => 이걸 안 쓰면 ㄱ
// app.get('/~~', (req, res) => {} 안에 const html = `<html></html>...`; 다 써야됨
// __dirname : 경로를 알려 줌

app.use('/static', express.static(__dirname + '/static')); // 특정 파일만 열어두겠다.
// 외부에서 요청이 들어왔을 때 연결 시켜주는 것
// express.static(경로 + '/static') => 문자열을 합쳐 주는 것

// ---------------------------------------------------------------------------------------------------------------------
// 주소값에 따른 셋팅

app.get('/api/list', (req, res) => {
    
    const sql = `
        SELECT
            iboard, title, writer
        FROM t_board
        ORDER BY iboard DESC
    `;

    getConn(conn => {
        conn.query(sql, (err, rows, fields) => {
            if(!err) {
                res.json(rows)
            }
        })
        conn.release();
    })
})

app.get('/list', (req, res) => {
    // req: 리퀘스트(모든 정보가 req에 담김)
    // res: 리스펀스(응답과 관련된 것은 res에 담김)
    // '/요청 주소값', (req, res): 모든 언어가 사용한다.
    
    const sql = `
        SELECT
            iboard, title, writer
        FROM t_board
        ORDER BY iboard DESC
    `; // SELECT문은 배열로 넘어옴

    getConn(conn => {
        conn.query(sql, (err, rows, fields) => {
            if(!err) {
                console.log(rows);
                res.render('list', {data : rows}); // 객체로 담는 것
            }
        })
        conn.release();
    })
})

app.get('/write', (req, res) => {
    res.render('write');
});

app.post('/write', async (req, res) => {    
    const data = req.body;
    console.log(data);
    const sql = `
        INSERT INTO t_board
        (title, ctnts, writer)
        VALUES
        ('${data.title}', '${data.ctnts}', '${data.writer}')
    `;
    console.log(sql);
    
    getConn(conn => {
        conn.query(sql, (err, rows, fields) => {
            console.log(err);
            if(!err) {
                console.log(rows); // 복수 SELECT
                res.redirect('/list');
            }            
        });
        conn.release();
    });
});

app.get('/detail', (req, res) => {
    console.log(req.query);
    const sql = `
        SELECT * FROM t_board
        WHERE iboard = ${req.query.iboard}
    `;

    getConn(conn => {
        conn.query(sql, (err, rows, fields) => {
            if(!err) {
                const data = rows[0] // 단수 SELECT
                res.render('detail', {data})
            }            
        });
        conn.release();
    });

})

app.get('/delete', (req, res) => {
    const sql = `
        DELETE FROM t_board
        WHERE iboard = ${req.query.iboard}
    `;

    getConn(conn => {
        conn.query(sql, (err, rows, fields) => {
            if(!err) {
                res.redirect('/list')
            }            
        });
        conn.release();
    });
    
});

app.get('/update', (req, res) => {
    const sql = `
        SELECT * FROM t_board
        WHERE iboard = ${req.query.iboard}
    `;

    getConn(conn => {
        conn.query(sql, (err, rows, fields) => {
            if(!err) {
                const data = rows[0] // 단수 SELECT
                res.render('update', {data})
            }            
        });
        conn.release();
    });
})

app.post('/update', (req,res) => {
    const data = req.body;
    const sql = `
        UPDATE t_board
        SET title = '${data.title}'
        , ctnts = '${data.ctnts}'
        , writer = '${data.writer}'
        WHERE iboard = '${data.iboard}'
    `;

    getConn(conn => {
        conn.query(sql, (err, rows, fields) => {
            if(!err) {
                res.redirect(`/detail?iboard=${data.iboard}`);
            }
        });
        conn.release();
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/hi', (req, res) => {
    const result = `
        <html>
            <head>
                <meta charset="UTF-8">
            </head>
            <body>
                <h1>반가워</h1>
                <div>좋아요</div>
            </body>
        </html>
    `;
    res.send(result);
});

app.listen(port, () => {
    console.log(`서버 실행 포트번호 ${port}`);
});

// app.get('/', (req, res) => { // get 방식
//     res.send('Hello World!');
// }); // localhost:3000
// // '/' => 주소값

// 메소드, 주소값, 리퀘스트(req), 리스펜스(res) : 필수요소

// app.get('/hi', (req, res) => {
//     const result = `
//         <html>
//             <head>
//                 <meta charset="UTF-8">
//             </head>
//             <body>
//                 <h1>반가워</h1>
//                 <div>좋아요</div>
//             </body>
//         </html>
//     `;
//     // res.send('안녕!');
//     res.send(result);
// }) // localhost:3000/hi

// app.listen(port, () => { // 서버가 기동되는 코드
//     console.log(`서버 실행 포트번호 ${port}`);
// })