'use strict'


let gStartPos
let gCurrLineDrag = -1
let gDragElement = ''
let gSave = false

const emojisPerView = 4;
let startIndex = 0;

function init() {
    renderGallery()
    renderCommonWords()
}

function getElementIdxClicked(ev) {
    const meme = getMeme()
    const { offsetX, offsetY } = ev

    const indexLine = meme.lines.findIndex(line => {
        return offsetX >= line.x && offsetX <= line.x + line.width
            && offsetY <= line.y && offsetY >= line.y - line.size
    })
    if (indexLine !== -1) {
        gDragElement = 'line'
        return indexLine
    }
    const indexEmoji = meme.emojis.findIndex(emoji => {
        return offsetX >= emoji.x && offsetX <= emoji.x + emoji.width
            && offsetY <= emoji.y && offsetY >= emoji.y - emoji.size
    })
    if (indexEmoji !== -1) {
        gDragElement = 'emoji'
        return indexEmoji
    } else return -1
}

function addMouseListeners() {
    gElcanvas.addEventListener('mousedown', onDown)
    gElcanvas.addEventListener('mousemove', onMove)
    gElcanvas.addEventListener('mouseup', onUp)
}

function addListeners() {
    addMouseListeners()
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (getElementIdxClicked(ev) === -1) return

    gCurrLineDrag = getElementIdxClicked(ev)
    setElementDrag(true, getElementIdxClicked(ev), gDragElement)
    gStartPos = pos
}

function onMove(ev) {
    if (gCurrLineDrag === -1) return
    const pos = getEvPos(ev)

    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveElement(dx, dy)
    gStartPos = pos
    renderMeme()
}

function moveElement(dx, dy) {
    updateElementPosition(gCurrLineDrag, dx, dy, gDragElement)
    renderMeme()
}

function onUp(ev) {
    updateElementDrag(gCurrLineDrag, false, gDragElement)
    gCurrLineDrag = -1
    gDragElement = ''
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }
    return pos
}

function onImgSelect(imgId) {
    const elGallery = document.querySelector('.gallery-container')
    document.getElementById
    elGallery.style.display = 'none'

    const elEditor = document.querySelector('.meme-editor')
    elEditor.style.display = 'flex'

    document.querySelector('.input-text').value = ''

    initCanvas()
    setImg(imgId)
    addListeners()
    renderMeme()
    renderEmojis()
}

function onMemeSelect(index) {
    const elSavedMemes = document.querySelector('.saved-memes')
    elSavedMemes.style.display = 'none'

    const memeIdx = index

    updateMemeData(index)
    onImgSelect(getImgId())
}

function initCanvas() {
    gElcanvas = document.querySelector('canvas')
    gCtx = gElcanvas.getContext('2d')

    const input = document.querySelector('.input-text')
    input.addEventListener('input', onInputChanged)
}

function renderMeme(callback) {
    const meme = getMeme()

    const elImg = new Image();
    elImg.src = `img/meme-img/${meme.selectedImgId}.jpg`
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElcanvas.width, gElcanvas.height)

        meme.lines.forEach((line, index) => {
            gCtx.font = ` ${line.size}px ${line.font}`
            gCtx.fillStyle = line.color
            gCtx.strokeStyle = line.stroke
            gCtx.textAlign = line.align

            gCtx.strokeText(line.txt, line.x, line.y)
            gCtx.fillText(line.txt, line.x, line.y)

            if (meme.selectedLineIdx === index && !gSave) {
                const size = gCtx.measureText(line.txt)

                gCtx.setLineDash([5, 5])
                gCtx.strokeRect(line.x - 5, line.y - line.size, size.width * 1.1, line.size * 1.2)
                gCtx.setLineDash([]);

            }

        })
        meme.emojis.forEach(emoji => {
            gCtx.font = ` ${emoji.size}px`
            gCtx.textAlign = emoji.align
            gCtx.fillText(emoji.txt, emoji.x, emoji.y)

        })
        if (callback) {
            callback();
        }
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
    renderMeme()
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
    const input = document.querySelector('.input-text')
    input.value = ''

    renderMeme()
}

function onSetFont(font) {
    SetFont(font)
    renderMeme()
}

function onDownloadCanvas(elLink) {
    gSave = true
    renderMeme()

    const data = gElcanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img'

    gSave = false
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

function closedSections() {
    const elMemes = document.querySelector('.saved-memes')
    elMemes.style.display = 'none'

    const elEditor = document.querySelector('.meme-editor')
    elEditor.style.display = 'none'

    const elAbout = document.querySelector('.about')
    elAbout.style.display = 'none'

    const elGallery = document.querySelector('.gallery-container')
    elGallery.style.display = 'none'
}

function onOpenGallery() {
    toggleMenu()
    initgMeme()
    closedSections()

    const elGallery = document.querySelector('.gallery-container')
    elGallery.style.display = 'flex'

    renderGallery()
}

function onOpenAbout() {
    toggleMenu()
    closedSections()
    const elAbout = document.querySelector('.about')
    elAbout.style.display = 'flex'
}

function onOpenMemes() {
    toggleMenu()
    closedSections()
    const elMemes = document.querySelector('.saved-memes')
    elMemes.style.display = 'flex'

    renderSavedMemes()
}

function onSaveMeme() {
    removeBorder()
    const imgDataUrl = gElcanvas.toDataURL('image/jpg');
    saveMeme(imgDataUrl)
    gSave = false
}

function OnClickedSeach() {
    var elTxt = document.querySelector('.search-input')
    searchMeme(elTxt.value)

    elTxt.value = ''
}

function renderCommonWords() {
    const commonWords = createSearchCountMap()
    const ElCommon = document.querySelector('.common-words')
    ElCommon.innerHTML = commonWords.join(" ");
}

function removeBorder() {
    gSave = true
    renderMeme()
}

function toggleMenu() {
    const elHeader = document.querySelector(".main-header")
    elHeader.classList.toggle('menu-open')
}