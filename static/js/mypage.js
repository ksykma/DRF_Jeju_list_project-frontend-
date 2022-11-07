// 전역 변수 //
const back_base_url = 'http://127.0.0.1:8000/'
const front_base_url = 'http://127.0.0.1:5500/templates/'


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

