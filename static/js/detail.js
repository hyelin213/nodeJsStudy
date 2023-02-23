//-- 브라우저 JS --//

(function() {

    'use strict'

    const $localConst = document.querySelector('#localConst');
    const $dltBtn = document.querySelector('#delete');
    const $mdfBtn = document.querySelector('#modify');

    $dltBtn.addEventListener('click', e => {
        if(confirm('삭제하시겠습니까?')){
            location.href = `delete?iboard=${$localConst.dataset.iboard}`;
        }
    })

    $mdfBtn.addEventListener('click', e => {
        if(confirm('수정하시겠습니까?')) {
            location.href = `update?iboard=${$localConst.dataset.iboard}`;
        }
    });

})();