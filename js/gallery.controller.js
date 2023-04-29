'use strict'

let gFilterSearch = ''

function renderGallery() {
    var imgs = getImgs()

    if (gFilterSearch) {
        const regex = new RegExp(gFilterSearch, 'i')
        const filteredImgs = imgs.filter(image => image.keywords.some(keyword => regex.test(keyword)))
        imgs = filteredImgs
    }

    var strHtmls = imgs.map(img => `
    <article class="img-preview">
    <img onclick="onImgSelect('${img.id}')"  onerror="this.src='img/default.jpg'" src="img/meme-img/${img.id}.jpg" alt="Funny Image">
    </article>
    `
    )
    document.querySelector('.gallery').innerHTML = strHtmls.join('')
}


function searchMeme(text) {
    gFilterSearch = text
    renderGallery()
    gFilterSearch = ''
}