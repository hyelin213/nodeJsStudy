//-- 서버 JS --//

const maria = require('mysql');

const pool = maria.createPool({ // pool 객체화
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '506greendg@',
    database: 'uiuxboard',
    connectionLimit: 5
    // connection을 5개 만들어서 사용하겠다.
})

function getConnection(cb) {
    pool.getConnection((err, conn) => {
        if(err) {
            console.log(err);
            return;
        } // 에러가 터졌다면(고속도로x)

        cb(conn); // 고속도로 깔렸으면 ㄱㄱ
    })
}

module.exports = getConnection;
// 외부에서 사용할 수있게 하는 코드(public) 고속도로 까는 느낌
// app.js로 연결됨