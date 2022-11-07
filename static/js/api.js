
// 전역 변수 //
const backend_base_url = 'http://127.0.0.1:8000/'
const frontend_base_url = 'http://127.0.0.1:5500/templates/'

window.onload = () => {
    console.log("로딩되었음") 
}

// # 회원가입 // <회원가입 수정 안해도됨>
async function handleSignup(){
    const SignupData = {
        username : document.getElementById("floatingInput").value,
        password : document.getElementById("floatingPassword").value,
    }
    const response = await fetch(`${backend_base_url}user/signup/`, {
        headers:{
            Accept: "application/json",
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify(SignupData)
    })
    
    response_json = await response.json()
    
    if (response.status == 201) {
        window.location.replace(`${frontend_base_url}login.html`)
    } else {
        alert("조건에 맞춰 입력해주세요.")
    }
}


//# 로그인//
async function handleLogin(){
    const loginData = {
        username : document.getElementById("username").value,
        password : document.getElementById("password").value,
    }

    
    const response = await fetch(`${backend_base_url}user/api/token/`, {
        headers:{
            Accept: "application/json",
            'content-type':'application/json',
        },
        method:'POST',
        body: JSON.stringify(loginData)
    })
    response_json = await response.json()

    console.log(response_json)
    if (response.status == 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
 
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(
            function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        localStorage.setItem("payload", jsonPayload);
        window.location.replace(`${frontend_base_url}index.html`)
    } else {
        alert("잘못된 로그인입니다.", response.status)
    }
}


//#로그아웃//
async function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")

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

    $("#close" + change_to_int).fadeOut();
    modal_close(); //모달 닫기
}
// 모달 끝 //

//store, comment GET API //
function show_store(){
    console.log('ddddddddddddddddddddddddddddddddddddd')
    $.ajax({
        type: 'GET',
        url:`${backend_base_url}main/`,
        data: {},
        success: function(response) {
            let postings = response
            for (let i=0; i < postings.length; i++){
                append_temp_html(
                    postings[i].id,   
                    postings[i].store_name,
                    postings[i].address,
                    postings[i].img,
                    postings[i].star,
                    postings[i].comments,

                )
            }
            function append_temp_html(id, store_name, address, img, star, comments){
                temp_html = `
            <li>
                <div class="card-box">
                    <!-- 게시글 -->
                    <div class="card" id="${id}" onClick="page2machine(this.id)">
                        <div class="card-img" style="background: url(${img}) no-repeat center center/contain;"></div>
                        <div class="card-body">
                            <h5 class="card-title">${store_name}</h5>
                            <hr>
                            <p class="card-text">${address}</p>
                            <p class="card-text">${star}</p>
                        </div>
                    </div>
                    <button class="card-store-detail" id="${id}" onclick="open_modal(this.id)">
                        자세히
                    </button> 
                </div>
                <!-- 게시글 상세페이지 모달 -->
                <div class="popup-wrap" id="popup${id}">
                    <div class="popup">
                        <!-- 게시글 상세페이지 모달창 헤더 -->
                        <div class="popup-header">
                            <span></span>
                            <h2>${store_name} 님의 게시물</h2>
                            <span></span>
                            <i type="button" id="1${id}" onClick="close_modal(this.id)" class="popup-close fa-solid fa-square-xmark"></i>
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
            </li>
            `
            $('#card').append(temp_html)
            // 댓글
            for (let j = 0; j < comments.length; j++) {
    
                let time_post = new Date(comments[j].created_at)
    
            $(`#comment${id}`).append(`<p>${comments[j].user} : ${comments[j].content}
                &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp
                ${time_post}&nbsp&nbsp<i onclick="delete_comment(${comments[j].id})" class="fa-regular fa-trash-can"></i></p>
                  <hr>`)
    
                }
                }
            }
        });
} show_store()

function page2machine(id){
    alert('잠시만 기다려주세요')
    sessionStorage.setItem("id", id)
    // window.location.replace(`${frontend_base_url}mypage.html?store=${id}`)
    window.location.href = "./mypage.html"
    
}
// 댓글 작성 //
async function post_comment(id) {
    const content = document.getElementById("comment_input" + id).value
    const commentData = {
        "store": id,
        "content": content
    }
console.log(post_comment(id))
    const response = await fetch(`${backend_base_url}main/${id}/comment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("access")
        },
        body: JSON.stringify(commentData)       
    })
    console.log(3)
    if (response.status == 200) {
        console.log(commentData)
        window.opener.reload();
        return response
    } else {
        alert(response.status)
    }
}
