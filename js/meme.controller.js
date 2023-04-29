'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
let gStartPos
let gCurrLineDrag = -1
let gDragElement = ''


// let startIndex = 0;
// const emojisPerView = 4;

// let emojiContainer;
// let selectedEmoji

const emojisPerView = 4;
let startIndex = 0;

function init() {
    renderGallery()
}

function getLineIdxClicked(ev) {
    const meme = getMeme()
    const { offsetX, offsetY } = ev

    const indexLine = meme.lines.findIndex(line => {
        return offsetX >= line.x && offsetX <= line.x + line.width
            && offsetY <= line.y && offsetY >= line.y - line.size
    })
    if (indexLine !== -1) {
        gDragElement = 'line'
        console.log('line')
        return indexLine
    }
    const indexEmoji = meme.emojis.findIndex(emoji => {
        return offsetX >= emoji.x && offsetX <= emoji.x + emoji.width
            && offsetY <= emoji.y && offsetY >= emoji.y - emoji.size
    })
    if (indexEmoji !== -1) {
        gDragElement = 'emoji'
        console.log('emoji')
        return indexEmoji
    } else return -1
}


// function addTouchListeners() {
//     gElCanvas.addEventListener('touchstart', onDown)
//     gElCanvas.addEventListener('touchmove', onMove)
//     gElCanvas.addEventListener('touchend', onUp)
// }

function addMouseListeners() {
    gElcanvas.addEventListener('mousedown', onDown)
    gElcanvas.addEventListener('mousemove', onMove)
    gElcanvas.addEventListener('mouseup', onUp)
}


function addListeners() {
    addMouseListeners()
    // addTouchListeners()
    // Listen for resize ev
    // window.addEventListener('resize', () => {
    //   onInit()
    // })
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (getLineIdxClicked(ev) === -1) return

    gCurrLineDrag = getLineIdxClicked(ev)
    setLineDrag(true, getLineIdxClicked(ev))
    gStartPos = pos
}

function onMove(ev) {
    if (gCurrLineDrag === -1) return
    const pos = getEvPos(ev)

    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function moveLine(dx, dy) {
    updateLinePosition(gCurrLineDrag, dx, dy)
    renderMeme()
}

function onUp(ev) {
    updateLineDrag(gCurrLineDrag, false)
    gCurrLineDrag = -1
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    // console.log('pos:', pos)
    // Check if its a touch ev
    // if (TOUCH_EVS.includes(ev.type)) {
    //     //soo we will not trigger the mouse ev
    //     ev.preventDefault()
    //     //Gets the first touch point
    //     ev = ev.changedTouches[0]
    //     //Calc the right pos according to the touch screen
    //     // console.log('ev.pageX:', ev.pageX)
    //     // console.log('ev.pageY:', ev.pageY)
    //     pos = {
    //         x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
    //         y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    //     }
    //     // console.log('pos:', pos)
    // }
    return pos
}

function onImgSelect(imgId) {
    const elGallery = document.querySelector('.gallery-container')
    document.getElementById
    elGallery.style.display = 'none'

    const elEditor = document.querySelector('.meme-editor')
    elEditor.style.display = 'flex'
    // emojiContainer = document.querySelector(".emoji-container");

    initCanvas()
    setImg(imgId)
    addListeners()
    renderMeme()
    renderEmojis()
}

function initCanvas() {
    gElcanvas = document.querySelector('canvas')
    gCtx = gElcanvas.getContext('2d')

    const input = document.querySelector('.input-text')
    input.addEventListener('input', onInputChanged)
}

function renderMeme() {
    const meme = getMeme()

    const elImg = new Image();
    elImg.src = `img/meme-img/${meme.selectedImgId}.jpg`
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElcanvas.width, gElcanvas.height)

        meme.lines.forEach(line => {
            gCtx.font = ` ${line.size}px ${line.font}`
            gCtx.fillStyle = line.color
            gCtx.strokeStyle = line.stroke
            gCtx.textAlign = line.align

            gCtx.strokeText(line.txt, line.x, line.y)
            gCtx.fillText(line.txt, line.x, line.y)

        })
        meme.emojis.forEach(emoji => {
            gCtx.font = ` ${emoji.size}px`
            gCtx.textAlign = emoji.align
            gCtx.fillText(emoji.txt, emoji.x, emoji.y)

        })
    }
}


function onInputChanged() {
    const text = this.value
    const size = gCtx.measureText(text)

    setLineTxt(text, size.width)
    renderMeme()
}

function onAlign(alignType) {
    setAlignText(alignType)
}

function onResizeFont(num) {
    resizeFont(num)
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    document.querySelector('.input-text').value = gMeme.lines[gMeme.selectedLineIdx].txt
}

function onAddLine() {
    addLine()
    renderMeme()
    document.querySelector('.input-text').value = gMeme.lines[gMeme.selectedLineIdx].txt
}

function onDeleteLine() {
    deleteLine()
    // gCtx.clearRect(0, 0, gElcanvas.width, gElcanvas.height)
    const input = document.querySelector('.input-text')
    input.value = ''

    renderMeme()

}

function onSetFont(font) {
    SetFont(font)
    renderMeme()
}

function downloadCanvas(elLink) {
    const data = gElcanvas.toDataURL()
    console.log(data)
    elLink.href = data
    elLink.download = 'my-img'
}

function renderEmojis() {
    let emojisHTML = "";
    for (let i = startIndex; i < startIndex + emojisPerView && i < emojis.length; i++) {
        emojisHTML += `<div class="emoji" onclick="onAddEmoji('${emojis[i]}')">${emojis[i]}</div>`;
    }
    const emojiContainer = document.querySelector(".emoji-container");
    emojiContainer.innerHTML = emojisHTML;
}

function onAddEmoji(emoji) {
    addEmoji(emoji)
    renderMeme()


}

function onMoveLeftEmoji() {
    startIndex = Math.max(startIndex - emojisPerView, 0);
    renderEmojis();
}

function onMoveRightEmoji() {
    startIndex = Math.min(startIndex + emojisPerView, emojis.length - emojisPerView);
    renderEmojis();
}

function onChangedFontColor(value) {
    setFontColor(value);
    renderMeme();
}

function onChangedStrokeColor(value) {
    setStrokeColor(value);
    renderMeme();
}

function onOpenGallery() {
    const elEditor = document.querySelector('.meme-editor')
    elEditor.style.display = 'none'

    const elAbout = document.querySelector('.about')
    elAbout.style.display = 'none'

    const elGallery = document.querySelector('.gallery-container')
    elGallery.style.display = 'flex'
}

function onOpenAbout() {
    const elEditor = document.querySelector('.meme-editor')
    elEditor.style.display = 'none'

    const elGallery = document.querySelector('.gallery-container')
    elGallery.style.display = 'none'

    const elAbout = document.querySelector('.about')
    elAbout.style.display = 'flex'
}


