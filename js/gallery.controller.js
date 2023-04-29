'use strict'

function renderGallery() {

    var imgs = getImgs()
    var strHtmls = imgs.map(img => `
    <article class="img-preview">
    <img onclick="onImgSelect('${img.id}')"  onerror="this.src='img/default.jpg'" src="img/meme-img/${img.id}.jpg" alt="Funny Image">
    </article>
    `
    )
    document.querySelector('.gallery').innerHTML = strHtmls.join('')
}


// function renderImg() {