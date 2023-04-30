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

function renderSavedMemes() {
    const memes = getSavedMemes()
    console.log(memes)

    var strHtmls = memes.map((meme, index) => `
    <article class="memes-preview">
    <img onclick="onMemeSelect('${index}')"  onerror="this.src='img/default.jpg'" src="${meme.img}" alt="Meme Image" >
    </article>
    `
    )
    document.querySelector('.saved-memes').innerHTML = strHtmls.join('')
}

function searchMeme(text) {
    gFilterSearch = text
    renderGallery()
    gFilterSearch = ''
}