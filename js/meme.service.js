'use strict'


let gElcanvas
let gCtx



var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

const emojis = ["😜", "😝", "😛", "🤪", "🤡", "👻", "💩", "👽", "🤖", "👺", "👹", "👿", "😈", "🤯", "🥴",
    "🤢", "🤮", "🤕", "🥵", "🥶", "🤬", "🤐", "🤫", "🤥", "🤫", "🙄", "😒", "😏", "😹", "😺", "😻"]

var gImgs = [
    { id: 1, url: 'img/meme-img/1.jpg', keywords: ['Funny', 'Men', 'Famous'] },
    { id: 2, url: 'img/meme-img/2.jpg', keywords: ['Cute', 'Animal'] },
    { id: 3, url: 'img/meme-img/3.jpg', keywords: ['Cute', 'Baby', 'Animal'] },
    { id: 4, url: 'img/meme-img/4.jpg', keywords: ['Sleep', 'Animal', 'Cat'] },
    { id: 5, url: 'img/meme-img/5.jpg', keywords: ['Funny', 'Baby'] },
    { id: 6, url: 'img/meme-img/6.jpg', keywords: ['Men', 'TV', 'Funny'] },
    { id: 7, url: 'img/meme-img/7.jpg', keywords: ['Funny', 'Baby'] },
    { id: 8, url: 'img/meme-img/8.jpg', keywords: ['Funny', 'Clown', 'TV'] },
    { id: 9, url: 'img/meme-img/9.jpg', keywords: ['Funny', 'Baby'] },
    { id: 10, url: 'img/meme-img/10.jpg', keywords: ['Funny', 'Men', 'Famous'] },
    { id: 11, url: 'img/meme-img/11.jpg', keywords: ['Men', 'Hug', 'Sport'] },
    { id: 12, url: 'img/meme-img/12.jpg', keywords: ['Men', 'TV', 'Famous'] },
    { id: 13, url: 'img/meme-img/13.jpg', keywords: ['Famous', 'Men', 'TV'] },
    { id: 14, url: 'img/meme-img/14.jpg', keywords: ['Men', 'TV'] },
    { id: 15, url: 'img/meme-img/15.jpg', keywords: ['TV', 'Men'] },
    { id: 16, url: 'img/meme-img/16.jpg', keywords: ['TV', 'Funny'] },
    { id: 17, url: 'img/meme-img/17.jpg', keywords: ['Famous', 'Men'] },
    { id: 18, url: 'img/meme-img/18.jpg', keywords: ['Cartoon', 'Funny'] },
];

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            font: 'impact',
            txt: '',
            size: 40,
            align: 'left',
            color: 'black',
            stroke: '',
            x: 30,
            y: 50,
            width: 0,
            isDrag: false
        },
        {
            font: 'impact',
            txt: '',
            size: 40,
            align: 'left',
            color: 'black',
            stroke: '',
            x: 30,
            y: 400,
            width: 0,
            isDrag: false
        }
    ],
    emojis: [

    ]
}


function getImgs() {
    const imgs = gImgs
    return imgs
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function getMeme() {
    return gMeme
}

function setLineTxt(text, width) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text
    gMeme.lines[gMeme.selectedLineIdx].width = width

}

function deleteLine() {
    if (gMeme.selectedLineIdx === 0 || gMeme.selectedLineIdx === 1)
        gMeme.lines[gMeme.selectedLineIdx].txt = ''
    else gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}

function SetFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function resizeFont(num) {
    gMeme.lines[gMeme.selectedLineIdx].size += num
}

function setAlignText(alignType) {
    gMeme.lines[0].align = alignType
    console.log('gMeme.lines[0].align', gMeme.lines[0].align)
}

function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1)
        gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}

function addLine() {
    if (gMeme.lines.length === 3) return
    gMeme.lines.push({
        font: 'impact',
        txt: '',
        size: 40,
        align: 'left',
        color: 'black',
        stroke: '',
        x: 30,
        y: gMeme.lines[gMeme.lines.length - 2].y + 150,
        width: 0,
        isDrag: false
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function getFontSize() {
    return gMeme.lines[0].size
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].stroke = color
}

function setLineDrag(isDrag, lineIdx) {
    gMeme.lines[lineIdx].isDrag = isDrag
}

function updateLinePosition(lineIdx, dx, dy) {
    gMeme.lines[lineIdx].x += dx
    gMeme.lines[lineIdx].y += dy
}

function updateLineDrag(lineIdx, isDrag) {
    gMeme.lines[lineIdx].isDrag = isDrag
}

function addEmoji(emoji) {
    gMeme.emojis.push({
        txt: emoji,
        size: 40,
        align: 'left',
        x: 250,
        y: 250,
        width: 0,
        isDrag: false
    })
}


