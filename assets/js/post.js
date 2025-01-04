$(document).ready(function () {
    $(window).scroll(function () {
        if ($(document).scrollTop() > 0 && $(window).width() > 991.98) {
            $('.navbar').addClass('setvisible');
        } else {
            $('.navbar').removeClass('setvisible');
        }
    });


    const contentDiv = document.getElementById('content');

    function loadContent(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = data;
            })
            .catch(error => console.error("Error loading content:", error));
    }

    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');

    if (currentPath.includes(".html")) {
        loadContent(`assets/pages/${page}.html`)
    }
});