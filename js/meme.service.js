'use strict'


let gElcanvas
let gCtx

const MEMEKEY = 'MmemeData'
const gSavedMemes = []

let gCommonWords = []
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

const emojis = ["😜", "😝", "😛", "🤪", "🤡", "👻", "💩", "👽", "🤖", "👺", "👹", "👿", "😈", "🤯", "🥴",
    "🤢", "🤮", "🤕", "🥵", "🥶", "🤬", "🤐", "🤫", "🤥", "🤫", "🙄", "😒", "😏", "😹", "😺", "😻"]

var gImgs = [
    { id: 1, url: 'img/meme-img/1.jpg', keywords: ['funny', 'men', 'famous'] },
    { id: 2, url: 'img/meme-img/2.jpg', keywords: ['cute', 'animal'] },
    { id: 3, url: 'img/meme-img/3.jpg', keywords: ['cute', 'baby', 'animal'] },
    { id: 4, url: 'img/meme-img/4.jpg', keywords: ['sleep', 'animal', 'cat'] },
    { id: 5, url: 'img/meme-img/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'img/meme-img/6.jpg', keywords: ['men', 'tv', 'funny'] },
    { id: 7, url: 'img/meme-img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'img/meme-img/8.jpg', keywords: ['funny', 'clown', 'tv'] },
    { id: 9, url: 'img/meme-img/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'img/meme-img/10.jpg', keywords: ['funny', 'men', 'famous'] },
    { id: 11, url: 'img/meme-img/11.jpg', keywords: ['men', 'hug', 'sport'] },
    { id: 12, url: 'img/meme-img/12.jpg', keywords: ['men', 'tv', 'famous'] },
    { id: 13, url: 'img/meme-img/13.jpg', keywords: ['famous', 'men', 'tv'] },
    { id: 14, url: 'img/meme-img/14.jpg', keywords: ['men', 'tv'] },
    { id: 15, url: 'img/meme-img/15.jpg', keywords: ['tv', 'men'] },
    { id: 16, url: 'img/meme-img/16.jpg', keywords: ['tv', 'funny'] },
    { id: 17, url: 'img/meme-img/17.jpg', keywords: ['famous', 'men'] },
    { id: 18, url: 'img/meme-img/18.jpg', keywords: ['cartoon', 'funny'] },
    { id: 19, url: 'img/meme-img/19.jpg', keywords: ['cry', 'baby'] },
]

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
    // gMeme.lines[gMeme.selectedLineIdx].align = alignType
    if (alignType === 'right') gMeme.lines[gMeme.selectedLineIdx].x = gElcanvas.width - gMeme.lines[gMeme.selectedLineIdx].width - 10
    else if (alignType === 'left') gMeme.lines[gMeme.selectedLineIdx].x = 10
    else gMeme.lines[gMeme.selectedLineIdx].x = (gElcanvas.width / 2) - (gMeme.lines[gMeme.selectedLineIdx].width / 2)

}

function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1)
        gMeme.selectedLineIdx = 0
    else gMeme.selectedLineIdx++
}

function initgMeme() {
    gMeme = {
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

function setElementDrag(isDrag, lineIdx, element) {
    if (element === 'line') gMeme.lines[lineIdx].isDrag = isDrag
    else gMeme.emojis[lineIdx].isDrag = isDrag
}

function updateElementPosition(lineIdx, dx, dy, element) {
    if (element === 'line') {
        gMeme.lines[lineIdx].x += dx
        gMeme.lines[lineIdx].y += dy
    } else {
        gMeme.emojis[lineIdx].x += dx
        gMeme.emojis[lineIdx].y += dy
    }
}

function updateElementDrag(lineIdx, isDrag, element) {
    if (element === 'line') gMeme.lines[lineIdx].isDrag = isDrag
    else gMeme.emojis[lineIdx].isDrag = isDrag
}

function addEmoji(emoji) {
    gMeme.emojis.push({
        txt: emoji,
        size: 40,
        align: 'left',
        x: 250,
        y: 250,
        width: 40,
        isDrag: false
    })
}

function saveMeme() {
    const memeData = JSON.stringify(gMeme);
    gSavedMemes.push(memeData);
    saveToStorage(MEMEKEY, gSavedMemes);
}

function createSearchCountMap() {
    const keywordsMap = {}

    gImgs.forEach(img => {
        img.keywords.forEach(keyword => {
            if (keywordsMap[keyword]) {
                keywordsMap[keyword]++
            } else {
                keywordsMap[keyword] = 1;
            }
        })
    })

    gKeywordSearchCountMap = keywordsMap
    const keyMapArray = Object.entries(gKeywordSearchCountMap);
    keyMapArray.sort((a, b) => b[1] - a[1]);
    gCommonWords = keyMapArray.slice(0, 5).map(pair => pair[0]);
    return gCommonWords
}




