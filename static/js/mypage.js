// 전역 변수 //
const backend_base_url = 'http://127.0.0.1:8000/'
const frontend_base_url = 'http://127.0.0.1:5500/templates/'


// 로그인 하지 않은 유저 접근 금지 //
var token = localStorage.getItem("access")
if (!token) {
    window.location.replace(`${frontend_base_url}login.html`)
}



// 로그인한 user.id 찾는 함수 //
function parseJwt(token) {
    var base64Url = localStorage.getItem("access").split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(
        function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    return JSON.parse(jsonPayload);
};

// 모달 제어 //
function open_modal(id) {
    //팝업을 flex속성으로 바꿔준 후 hide()로 숨기고 다시 fadeIn()으로 효과
    $("#popup" + id).css('display', 'flex').hide().fadeIn();
}


function close_modal(id) {
    // id 파라미터가 str값 으로 넘어와서 slice하고 int로 변환
    change_to_int = parseInt(id)

    function modal_close() {
        $("#popup" + change_to_int).fadeOut();
    }

    $("#close" + change_to_int)
    modal_close(); //모달 닫기
}
// 모달 끝 //


window.onload = function show_store_machine(){
    console.log('adniopadnaiopw')
    console.log(sessionStorage.getItem("id"))
    a = sessionStorage.getItem("id")
    console.log('이건이거익무ㅐ우맺두매ㅑㅈ둠ㅈㄷㅁ', a)
    $.ajax({
        type: 'GET',
        url:`${backend_base_url}main/${a}/`,
        data: {},
        success: function(response) {
            let postings = response
            // window.location.replace(`${frontend_base_url}mypage.html?store=${a}`)

            for (let i=0; i < postings.length; i++){
                append_temp_html(
                    postings[i].id,   
                    postings[i].store_name,
                    postings[i].address,
                    postings[i].img,
                    postings[i].star,

                )
            }
            function append_temp_html(id, store_name, address, img, star){
                temp_html = `
            <li>
                <div class="card-box">
                    <!-- 게시글 -->
                    <div class="card" id="${id}" onclick="open_modal(this.id)">
                        <div class="card-img" style="background: url(${img}) no-repeat center center/contain;"></div>
                        <div class="card-body">
                            <h5 class="card-title">${store_name}</h5>
                            <hr>
                            <p class="card-text">${address}</p>
                            <p class="card-text">${star}</p>
                        </div>
                    </div>
                    <!-- 게시글 상세페이지 모달 -->
                    <div class="popup-wrap" id="popup${id}">
                    <div class="popup">
                    <!-- 게시글 상세페이지 모달창 헤더 -->
                    <div class="popup-header">
                        <span></span>
                        <h2>${store_name} 가게의 정보</h2>
                        <span></span>
                        <i type="button" id="${id}" onclick="close_modal(this.id)" class="popup-close fa-solid fa-square-xmark"></i>
                    </div>
            
                    <!-- 게시글 상세페이지 모달창 바디 -->
                    <div class="popup-body">
                        <div class="popup-img" style="background: url(${img}) no-repeat center center/contain;">
                    </div>
                    <h2 class="popup-title">${store_name}</h2>
                    <hr>
                    <h5 class="popup-content">${address}</h5>
                    <hr>
                </div>
                <!-- 게시글 상세페이지 모달창 댓글 input -->
                <div class="popup-post-comment">
                    <input class="popup-post-input" id="comment_input${id}" type="text" placeholder="댓글을 입력 해주세요..." />
                    <button class="popup-post-input-btn" onclick="post_comment(${id})">저장</button>
                </div>
                <!-- 게시글 상세페이지 모달창 댓글 output -->
                <div class="popup-comment" id="comment${id}">
                </div>
            </div>
        </div>
    </li>
            `
            $('#card_machine').append(temp_html)
            }
        }
        
    })
    

}

